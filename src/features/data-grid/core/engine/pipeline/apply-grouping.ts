import type { ColumnDef, GroupingState } from '../../types';
import { getColumnId, resolveCellValue } from '../../utils';

export interface GroupedRowNode<TRow = unknown> {
    id: string;
    type: 'group' | 'row';
    depth: number;
    parentId?: string;
    groupingColumnId?: string;
    groupingValue?: unknown;
    row?: TRow;
    rowIndex?: number;
    children?: Array<GroupedRowNode<TRow>>;
    leafRows: TRow[];
}

export interface ApplyGroupingResult<TRow = unknown> {
    rows: Array<GroupedRowNode<TRow>>;
    flatRows: Array<GroupedRowNode<TRow>>;
    grouped: boolean;
    groupingColumnIds: string[];
}

export interface ApplyGroupingOptions<TRow = unknown> {
    rows: TRow[];
    columns: Array<ColumnDef<TRow>>;
    groupingState?: GroupingState;
}

const toGroupKey = (value: unknown): string => {
    if (value === null) {
        return '__null__';
    }

    if (value === undefined) {
        return '__undefined__';
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    return String(value);
};

const createRowNode = <TRow>(
    row: TRow,
    rowIndex: number,
    depth: number,
    parentId?: string,
): GroupedRowNode<TRow> => {
    const id = parentId ? `${parentId}.__row__.${rowIndex}` : `__row__.${rowIndex}`;

    return {
        id,
        type: 'row',
        depth,
        parentId,
        row,
        rowIndex,
        leafRows: [row],
    };
};

const flattenGroupedRows = <TRow>(
    nodes: Array<GroupedRowNode<TRow>>,
    output: Array<GroupedRowNode<TRow>> = [],
): Array<GroupedRowNode<TRow>> => {
    for (const node of nodes) {
        output.push(node);

        if (node.children?.length) {
            flattenGroupedRows(node.children, output);
        }
    }

    return output;
};

const buildGroupLevel = <TRow>(
    rows: TRow[],
    sourceRows: TRow[],
    columns: Array<ColumnDef<TRow>>,
    groupingColumnIds: string[],
    depth: number,
    parentId?: string,
): Array<GroupedRowNode<TRow>> => {
    const groupingColumnId = groupingColumnIds[depth];

    if (!groupingColumnId) {
        return rows.map((row) => {
            const rowIndex = sourceRows.indexOf(row);

            return createRowNode(row, rowIndex, depth, parentId);
        });
    }

    const column = columns.find((item) => getColumnId(item) === groupingColumnId);

    if (!column) {
        return rows.map((row) => {
            const rowIndex = sourceRows.indexOf(row);

            return createRowNode(row, rowIndex, depth, parentId);
        });
    }

    const groups = new Map<string, { value: unknown; rows: TRow[] }>();

    rows.forEach((row) => {
        const rowIndex = sourceRows.indexOf(row);
        const value = resolveCellValue({
            row,
            rowIndex,
            column,
        });

        const key = toGroupKey(value);
        const existing = groups.get(key);

        if (existing) {
            existing.rows.push(row);
            return;
        }

        groups.set(key, {
            value,
            rows: [row],
        });
    });

    const nodes: Array<GroupedRowNode<TRow>> = [];

    for (const [key, group] of groups.entries()) {
        const id = parentId
            ? `${parentId}.${groupingColumnId}:${key}`
            : `${groupingColumnId}:${key}`;

        const children = buildGroupLevel(
            group.rows,
            sourceRows,
            columns,
            groupingColumnIds,
            depth + 1,
            id,
        );

        nodes.push({
            id,
            type: 'group',
            depth,
            parentId,
            groupingColumnId,
            groupingValue: group.value,
            children,
            leafRows: group.rows,
        });
    }

    return nodes;
};

export const applyGrouping = <TRow = unknown>(
    options: ApplyGroupingOptions<TRow>,
): ApplyGroupingResult<TRow> => {
    const { rows, columns, groupingState } = options;

    const groupingColumnIds = groupingState?.columnIds ?? [];

    if (!groupingColumnIds.length) {
        const rowNodes = rows.map((row, index) => createRowNode(row, index, 0));

        return {
            rows: rowNodes,
            flatRows: rowNodes,
            grouped: false,
            groupingColumnIds: [],
        };
    }

    const groupedRows = buildGroupLevel(
        rows,
        rows,
        columns,
        groupingColumnIds,
        0,
    );

    return {
        rows: groupedRows,
        flatRows: flattenGroupedRows(groupedRows),
        grouped: true,
        groupingColumnIds,
    };
};
