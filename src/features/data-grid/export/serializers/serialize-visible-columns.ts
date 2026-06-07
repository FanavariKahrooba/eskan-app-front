export interface SerializableColumn {
    id: string;
    header: string;
    accessorKey?: string;
    type?: string;
    meta?: Record<string, unknown>;
}

function getColumnId(column: any, index: number): string {
    return String(
        column.id ??
        column.accessorKey ??
        column.field ??
        `column_${index}`,
    );
}

function getColumnHeader(column: any, fallback: string): string {
    if (typeof column.header === 'string') return column.header;
    if (typeof column.label === 'string') return column.label;
    return fallback;
}

export function serializeVisibleColumns(
    columns: any[],
): SerializableColumn[] {
    return columns
        .filter((column) => column?.hidden !== true)
        .map((column, index) => {
            const id = getColumnId(column, index);

            return {
                id,
                header: getColumnHeader(column, id),
                accessorKey: column.accessorKey ?? column.field,
                type: column.type,
                meta: column.meta,
            };
        });
}
