import type { ColumnDef, ColumnOrderState } from '../../types';
import { getColumnId } from '../../utils';

export interface ApplyColumnOrderOptions<TRow = unknown> {
    columns: Array<ColumnDef<TRow>>;
    columnOrderState?: ColumnOrderState;
}

export const applyColumnOrder = <TRow = unknown>(
    options: ApplyColumnOrderOptions<TRow>,
): Array<ColumnDef<TRow>> => {
    const { columns, columnOrderState } = options;
    const orderedIds = columnOrderState?.orderedColumnIds ?? [];

    if (!orderedIds.length) {
        return columns;
    }

    const columnMap = new Map(columns.map((column) => [getColumnId(column), column]));
    const used = new Set<string>();
    const result: Array<ColumnDef<TRow>> = [];

    for (const columnId of orderedIds) {
        const column = columnMap.get(columnId);

        if (!column) {
            continue;
        }

        result.push(column);
        used.add(columnId);
    }

    for (const column of columns) {
        const columnId = getColumnId(column);

        if (used.has(columnId)) {
            continue;
        }

        result.push(column);
    }

    return result;
};
