import type { ColumnDef } from '../core/types';

export type RowId = string;

export interface DataGridRowModel<TRow> {
    id: RowId;
    index: number;
    original: TRow;
    values: Record<string, unknown>;
    depth: number;
    parentId?: RowId;
    subRows?: Array<DataGridRowModel<TRow>>;
}

export interface CreateRowModelOptions<TRow> {
    getRowId?: (row: TRow, index: number) => string;
    getSubRows?: (row: TRow) => TRow[] | undefined;
}

function getColumnId<TRow>(column: ColumnDef<TRow>, index: number): string {
    const col = column as any;

    return String(
        col.id ??
        col.accessorKey ??
        col.field ??
        `column_${index}`,
    );
}

function getCellValue<TRow>(
    row: TRow,
    column: ColumnDef<TRow>,
): unknown {
    const col = column as any;

    if (typeof col.accessorFn === 'function') {
        return col.accessorFn(row);
    }

    const key = col.accessorKey ?? col.field;

    if (!key) return undefined;

    return String(key)
        .split('.')
        .reduce<unknown>((acc, part) => {
            if (acc == null) return undefined;
            return (acc as Record<string, unknown>)[part];
        }, row as unknown);
}

function createRowsRecursive<TRow>(
    rows: TRow[],
    columns: Array<ColumnDef<TRow>>,
    options: CreateRowModelOptions<TRow>,
    depth: number,
    parentId?: string,
): Array<DataGridRowModel<TRow>> {
    return rows.map((row, index) => {
        const id = options.getRowId
            ? options.getRowId(row, index)
            : parentId
                ? `${parentId}.${index}`
                : String(index);

        const values: Record<string, unknown> = {};

        columns.forEach((column, columnIndex) => {
            const columnId = getColumnId(column, columnIndex);
            values[columnId] = getCellValue(row, column);
        });

        const subRows = options.getSubRows?.(row);

        return {
            id,
            index,
            original: row,
            values,
            depth,
            parentId,
            subRows: subRows?.length
                ? createRowsRecursive(subRows, columns, options, depth + 1, id)
                : undefined,
        };
    });
}

export function createRowModel<TRow>(
    rows: TRow[],
    columns: Array<ColumnDef<TRow>>,
    options: CreateRowModelOptions<TRow> = {},
): Array<DataGridRowModel<TRow>> {
    return createRowsRecursive(rows, columns, options, 0);
}
