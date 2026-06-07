import { getColumnId, resolveCellValue } from '../../utils';
import type { GroupedRowNode } from './apply-grouping';
import type { AggregationDefinition, AggregationType, ColumnDef } from '../../types';



export type AggregationValueMap = Record<string, unknown>;

export interface AggregatedRowNode<TRow = unknown> extends GroupedRowNode<TRow> {
    aggregationValues?: AggregationValueMap;
    children?: Array<AggregatedRowNode<TRow>>;
}

export interface ApplyAggregationResult<TRow = unknown> {
    rows: Array<AggregatedRowNode<TRow>>;
    flatRows: Array<AggregatedRowNode<TRow>>;
}

export interface ApplyAggregationOptions<TRow = unknown> {
    groupedRows: Array<GroupedRowNode<TRow>>;
    columns: Array<ColumnDef<TRow>>;
    aggregations?: AggregationDefinition[];
}

const toNumber = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);

        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return null;
};

const aggregateValues = (
    values: unknown[],
    type: AggregationType,
): unknown => {
    switch (type) {
        case 'count':
            return values.length;

        case 'sum': {
            return values.reduce((total: any, value) => {
                const numberValue = toNumber(value);
                return numberValue === null ? total : total + numberValue;
            }, 0);
        }

        case 'avg': {
            const numbers = values
                .map(toNumber)
                .filter((value): value is number => value !== null);

            if (!numbers.length) {
                return null;
            }

            const total = numbers.reduce((sum, value) => sum + value, 0);
            return total / numbers.length;
        }

        case 'min': {
            const numbers = values
                .map(toNumber)
                .filter((value): value is number => value !== null);

            if (!numbers.length) {
                return null;
            }

            return Math.min(...numbers);
        }

        case 'max': {
            const numbers = values
                .map(toNumber)
                .filter((value): value is number => value !== null);

            if (!numbers.length) {
                return null;
            }

            return Math.max(...numbers);
        }

        case 'first':
            return values[0] ?? null;

        case 'last':
            return values[values.length - 1] ?? null;

        default:
            return null;
    }
};

const flattenAggregatedRows = <TRow>(
    nodes: Array<AggregatedRowNode<TRow>>,
    output: Array<AggregatedRowNode<TRow>> = [],
): Array<AggregatedRowNode<TRow>> => {
    for (const node of nodes) {
        output.push(node);

        if (node.children?.length) {
            flattenAggregatedRows(node.children, output);
        }
    }

    return output;
};

const applyAggregationToNode = <TRow>(
    node: GroupedRowNode<TRow>,
    columns: Array<ColumnDef<TRow>>,
    aggregations: Array<AggregationDefinition[]>,
): AggregatedRowNode<TRow> => {
    const children = node.children?.map((child) =>
        applyAggregationToNode(child, columns, aggregations),
    );

    if (node.type !== 'group') {
        return {
            ...node,
            children,
        };
    }

    const aggregationValues: AggregationValueMap = {};

    for (const aggregation of aggregations) {
        const column = columns.find((item) => getColumnId(item) === aggregation.columnId);

        if (!column) {
            continue;
        }

        const values = node.leafRows.map((row, index) => {
            return resolveCellValue({
                row,
                rowIndex: index,
                column,
            });
        });

        const aggregationId = aggregation.id ?? `${aggregation.columnId}.${aggregation.type}`;

        aggregationValues[aggregationId] = aggregateValues(values, aggregation.type);
    }

    return {
        ...node,
        children,
        aggregationValues,
    };
};

export const applyAggregation = <TRow = unknown>(
    options: ApplyAggregationOptions<TRow>,
): ApplyAggregationResult<TRow> => {
    const { groupedRows, columns, aggregations = [] } = options;

    if (!aggregations?.length) {
        const rows = groupedRows as Array<AggregatedRowNode<TRow>>;

        return {
            rows,
            flatRows: flattenAggregatedRows(rows),
        };
    }

    const rows = groupedRows.map((node) =>
        applyAggregationToNode(node, columns, aggregations),
    );

    return {
        rows,
        flatRows: flattenAggregatedRows(rows),
    };
};
