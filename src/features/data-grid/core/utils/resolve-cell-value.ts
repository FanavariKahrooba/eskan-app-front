import type { ColumnDef } from '../types';
import { deepGet } from './deep-get';

export interface ResolveCellValueContext<TRow = unknown> {
    row: TRow;
    rowIndex: number;
    column: ColumnDef<TRow>;
}

export const resolveCellValue = <TRow = unknown>(
    context: ResolveCellValueContext<TRow>,
): unknown => {
    const { row, rowIndex, column } = context;

    if (typeof column.accessorFn === 'function') {
        return column.accessorFn(row, rowIndex);
    }

    if (typeof column.accessorKey === 'string' && column.accessorKey.length > 0) {
        return deepGet(row, column.accessorKey);
    }

    return undefined;
};
