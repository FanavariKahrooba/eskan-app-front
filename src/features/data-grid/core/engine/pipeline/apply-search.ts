import type { ColumnDef, FilterState } from '../../types';
import { resolveCellValue } from '../../utils';

export interface ApplySearchOptions<TRow = unknown> {
    rows: TRow[];
    columns: Array<ColumnDef<TRow>>;
    filterState?: FilterState;
}

const normalizeSearchValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }

    if (value instanceof Date) {
        return value.toISOString().toLowerCase();
    }

    return String(value).toLowerCase();
};

export const applySearch = <TRow = unknown>(
    options: ApplySearchOptions<TRow>,
): TRow[] => {
    const { rows, columns, filterState } = options;
    const search = filterState?.search?.trim().toLowerCase();

    if (!search) {
        return rows;
    }

    const searchableColumns = columns.filter((column) => column.searchable !== false);

    if (!searchableColumns.length) {
        return rows;
    }

    return rows.filter((row, rowIndex) => {
        return searchableColumns.some((column) => {
            const rawValue = resolveCellValue({
                row,
                rowIndex,
                column,
            });

            const normalized = normalizeSearchValue(rawValue);
            return normalized.includes(search);
        });
    });
};
