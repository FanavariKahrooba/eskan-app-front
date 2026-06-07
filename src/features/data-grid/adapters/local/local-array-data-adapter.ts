export type SortDirection = 'asc' | 'desc';

export interface LocalArraySort {
    columnId: string;
    direction: SortDirection;
}

export interface LocalArrayFilter {
    columnId: string;
    operator?: string;
    value: unknown;
}

export interface LocalArrayLoadParams {
    pageIndex?: number;
    pageSize?: number;
    search?: string;
    sorting?: LocalArraySort[];
    filters?: LocalArrayFilter[];
}

export interface LocalArrayLoadResult<TRow> {
    rows: TRow[];
    totalRows: number;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
}

export interface LocalArrayDataAdapterOptions<TRow> {
    data: TRow[];
    searchableKeys?: Array<keyof TRow | string>;
    getRowValue?: (row: TRow, columnId: string) => unknown;
}

function getValue<TRow>(
    row: TRow,
    key: string,
    customGetter?: (row: TRow, columnId: string) => unknown,
): unknown {
    if (customGetter) return customGetter(row, key);

    return key.split('.').reduce<unknown>((acc, part) => {
        if (acc == null) return undefined;
        return (acc as Record<string, unknown>)[part];
    }, row as unknown);
}

function compareValues(a: unknown, b: unknown): number {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }

    const ad = new Date(String(a));
    const bd = new Date(String(b));

    if (!Number.isNaN(ad.getTime()) && !Number.isNaN(bd.getTime())) {
        return ad.getTime() - bd.getTime();
    }

    return String(a).localeCompare(String(b), 'fa', {
        numeric: true,
        sensitivity: 'base',
    });
}

function applySearch<TRow>(
    rows: TRow[],
    search: string | undefined,
    keys: string[] | undefined,
    getter?: (row: TRow, columnId: string) => unknown,
): TRow[] {
    if (!search?.trim()) return rows;

    const q = search.trim().toLowerCase();

    return rows.filter((row) => {
        if (keys?.length) {
            return keys.some((key) =>
                String(getValue(row, key, getter) ?? '')
                    .toLowerCase()
                    .includes(q),
            );
        }

        return JSON.stringify(row).toLowerCase().includes(q);
    });
}

function applyFilters<TRow>(
    rows: TRow[],
    filters: LocalArrayFilter[] | undefined,
    getter?: (row: TRow, columnId: string) => unknown,
): TRow[] {
    if (!filters?.length) return rows;

    return rows.filter((row) =>
        filters.every((filter) => {
            const value = getValue(row, filter.columnId, getter);
            const target = filter.value;

            switch (filter.operator) {
                case 'equals':
                    return value === target;

                case 'notEquals':
                    return value !== target;

                case 'contains':
                    return String(value ?? '')
                        .toLowerCase()
                        .includes(String(target ?? '').toLowerCase());

                case 'startsWith':
                    return String(value ?? '')
                        .toLowerCase()
                        .startsWith(String(target ?? '').toLowerCase());

                case 'endsWith':
                    return String(value ?? '')
                        .toLowerCase()
                        .endsWith(String(target ?? '').toLowerCase());

                case 'gt':
                    return Number(value) > Number(target);

                case 'gte':
                    return Number(value) >= Number(target);

                case 'lt':
                    return Number(value) < Number(target);

                case 'lte':
                    return Number(value) <= Number(target);

                default:
                    return String(value ?? '')
                        .toLowerCase()
                        .includes(String(target ?? '').toLowerCase());
            }
        }),
    );
}

function applySorting<TRow>(
    rows: TRow[],
    sorting: LocalArraySort[] | undefined,
    getter?: (row: TRow, columnId: string) => unknown,
): TRow[] {
    if (!sorting?.length) return rows;

    return [...rows].sort((a, b) => {
        for (const sort of sorting) {
            const av = getValue(a, sort.columnId, getter);
            const bv = getValue(b, sort.columnId, getter);

            const result = compareValues(av, bv);

            if (result !== 0) {
                return sort.direction === 'desc' ? -result : result;
            }
        }

        return 0;
    });
}

export function createLocalArrayDataAdapter<TRow>(
    options: LocalArrayDataAdapterOptions<TRow>,
) {
    return {
        async load(
            params: LocalArrayLoadParams = {},
        ): Promise<LocalArrayLoadResult<TRow>> {
            const pageIndex = params.pageIndex ?? 0;
            const pageSize = params.pageSize ?? 10;

            let rows = [...options.data];

            rows = applySearch(
                rows,
                params.search,
                options.searchableKeys?.map(String),
                options.getRowValue,
            );

            rows = applyFilters(rows, params.filters, options.getRowValue);
            rows = applySorting(rows, params.sorting, options.getRowValue);

            const totalRows = rows.length;
            const pageCount = Math.ceil(totalRows / pageSize);
            const start = pageIndex * pageSize;
            const paginatedRows = rows.slice(start, start + pageSize);

            return {
                rows: paginatedRows,
                totalRows,
                pageIndex,
                pageSize,
                pageCount,
            };
        },
    };
}

export type LocalArrayDataAdapter<TRow> = ReturnType<
    typeof createLocalArrayDataAdapter<TRow>
>;
