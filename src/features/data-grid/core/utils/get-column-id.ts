import type { ColumnDef } from '../types';

export const getColumnId = <TRow = unknown>(column: ColumnDef<TRow>): string => {
    if (column.id && String(column.id).trim()) {
        return String(column.id);
    }

    if (typeof column.accessorKey === 'string' && column.accessorKey.trim()) {
        return column.accessorKey;
    }

    throw new Error(
        '[DataGrid] Column id is required. Each column must define either "id" or "accessorKey".',
    );
};
