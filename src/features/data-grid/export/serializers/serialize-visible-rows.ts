import type { SerializableColumn } from './serialize-visible-columns';

export interface SerializableRow {
    id?: string;
    values: Record<string, unknown>;
    original?: unknown;
}

function deepGet(source: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, part) => {
        if (acc == null) return undefined;
        return (acc as Record<string, unknown>)[part];
    }, source);
}

function getCellValue(row: any, column: SerializableColumn): unknown {
    if (row?.values && column.id in row.values) {
        return row.values[column.id];
    }

    const original = row?.original ?? row;

    if (column.accessorKey) {
        return deepGet(original, column.accessorKey);
    }

    return deepGet(original, column.id);
}

export function serializeVisibleRows(
    rows: any[],
    columns: SerializableColumn[],
): SerializableRow[] {
    return rows.map((row) => {
        const values: Record<string, unknown> = {};

        columns.forEach((column) => {
            values[column.id] = getCellValue(row, column);
        });

        return {
            id: row?.id ? String(row.id) : undefined,
            values,
            original: row?.original ?? row,
        };
    });
}
