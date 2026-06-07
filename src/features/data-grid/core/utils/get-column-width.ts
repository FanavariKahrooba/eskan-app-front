import type { ColumnDef } from '../types';

export interface GetColumnWidthOptions {
    fallback?: number;
}

export const getColumnWidth = <TRow = unknown>(
    column: ColumnDef<TRow>,
    options?: GetColumnWidthOptions,
): number => {
    if (typeof column.size === 'number' && column.size > 0) {
        return column.size;
    }

    if (typeof column.width === 'number' && column.width > 0) {
        return column.width;
    }

    return options?.fallback ?? 160;
};
