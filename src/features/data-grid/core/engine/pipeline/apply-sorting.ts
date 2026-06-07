import type { ColumnDef, SortState } from '../../types';
import { getColumnId, resolveCellValue, sortCompare } from '../../utils';

export interface ApplySortingOptions<TRow = unknown> {
    rows: TRow[];
    columns: Array<ColumnDef<TRow>>;
    sortState?: SortState;
}

export const applySorting = <TRow = unknown>(
    options: ApplySortingOptions<TRow>,
): TRow[] => {
    const { rows, columns, sortState } = options;
    const sorts = sortState?.items ?? [];

    if (!sorts.length) {
        return rows;
    }

    const columnMap = new Map(columns.map((column) => [getColumnId(column), column]));

    return [...rows].sort((leftRow, rightRow) => {
        const leftIndex = rows.indexOf(leftRow);
        const rightIndex = rows.indexOf(rightRow);

        for (const sortItem of sorts) {
            const column = columnMap.get(sortItem.columnId);

            if (!column) {
                continue;
            }

            const leftValue = resolveCellValue({
                row: leftRow,
                rowIndex: leftIndex,
                column,
            });

            const rightValue = resolveCellValue({
                row: rightRow,
                rowIndex: rightIndex,
                column,
            });

            if (typeof column.sortComparator === 'function') {
                const result = column.sortComparator(leftValue, rightValue, {
                    rowA: leftRow,
                    rowB: rightRow,
                    column,
                });

                if (result !== 0) {
                    return sortItem.direction === 'desc' ? -result : result;
                }

                continue;
            }

            const result = sortCompare(leftValue, rightValue, {
                direction: sortItem.direction ?? 'asc',
            });

            if (result !== 0) {
                return result;
            }
        }

        return 0;
    });
};
