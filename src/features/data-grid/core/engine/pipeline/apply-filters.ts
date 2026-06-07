import type { ColumnDef, FilterState } from '../../types';
import { getColumnId, resolveCellValue } from '../../utils';

export interface ApplyFiltersOptions<TRow = unknown> {
    rows: TRow[];
    columns: Array<ColumnDef<TRow>>;
    filterState?: FilterState;
}

const isNil = (value: unknown): value is null | undefined => {
    return value === null || value === undefined;
};

const normalizeComparableValue = (value: unknown): unknown => {
    if (value instanceof Date) {
        return value.getTime();
    }

    return value;
};

const includesValue = (source: unknown, target: unknown): boolean => {
    if (isNil(source)) {
        return false;
    }

    return String(source).toLowerCase().includes(String(target ?? '').toLowerCase());
};

const isBetween = (value: unknown, range: unknown): boolean => {
    if (!Array.isArray(range) || range.length < 2) {
        return true;
    }

    const normalizedValue = normalizeComparableValue(value);
    const min = normalizeComparableValue(range[0]);
    const max = normalizeComparableValue(range[1]);

    if (typeof normalizedValue !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
        return false;
    }

    return normalizedValue >= min && normalizedValue <= max;
};

const matchesFilter = (cellValue: unknown, operator: string, filterValue: unknown): boolean => {
    switch (operator) {
        case 'eq':
            return normalizeComparableValue(cellValue) === normalizeComparableValue(filterValue);

        case 'neq':
            return normalizeComparableValue(cellValue) !== normalizeComparableValue(filterValue);

        case 'contains':
            return includesValue(cellValue, filterValue);

        case 'startsWith':
            return String(cellValue ?? '')
                .toLowerCase()
                .startsWith(String(filterValue ?? '').toLowerCase());

        case 'endsWith':
            return String(cellValue ?? '')
                .toLowerCase()
                .endsWith(String(filterValue ?? '').toLowerCase());

        case 'gt':
            return Number(normalizeComparableValue(cellValue)) > Number(normalizeComparableValue(filterValue));

        case 'gte':
            return Number(normalizeComparableValue(cellValue)) >= Number(normalizeComparableValue(filterValue));

        case 'lt':
            return Number(normalizeComparableValue(cellValue)) < Number(normalizeComparableValue(filterValue));

        case 'lte':
            return Number(normalizeComparableValue(cellValue)) <= Number(normalizeComparableValue(filterValue));

        case 'in':
            return Array.isArray(filterValue)
                ? filterValue.some((item) => normalizeComparableValue(item) === normalizeComparableValue(cellValue))
                : false;

        case 'between':
            return isBetween(cellValue, filterValue);

        case 'isEmpty':
            return cellValue === '' || isNil(cellValue);

        case 'isNotEmpty':
            return !(cellValue === '' || isNil(cellValue));

        default:
            return true;
    }
};

export const applyFilters = <TRow = unknown>(
    options: ApplyFiltersOptions<TRow>,
): TRow[] => {
    const { rows, columns, filterState } = options;
    const filters = filterState?.items ?? [];

    if (!filters.length) {
        return rows;
    }

    const columnMap = new Map(columns.map((column) => [getColumnId(column), column]));

    return rows.filter((row, rowIndex) => {
        return filters.every((filterItem) => {
            const column = columnMap.get(filterItem.columnId);

            if (!column) {
                return true;
            }

            const cellValue = resolveCellValue({
                row,
                rowIndex,
                column,
            });

            const operator = filterItem.operator ?? 'eq';
            return matchesFilter(cellValue, operator, filterItem.value);
        });
    });
};
