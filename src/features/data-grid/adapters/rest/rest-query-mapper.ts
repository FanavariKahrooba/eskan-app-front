export interface RestSortParam {
    columnId: string;
    direction: 'asc' | 'desc';
}

export interface RestFilterParam {
    columnId: string;
    operator?: string;
    value: unknown;
}

export interface RestQueryMapperParams {
    pageIndex?: number;
    pageSize?: number;
    search?: string;
    sorting?: RestSortParam[];
    filters?: RestFilterParam[];
    extra?: Record<string, unknown>;
}

export interface RestQueryMapperOptions {
    pageParam?: string;
    pageSizeParam?: string;
    searchParam?: string;
    sortParam?: string;
    filterParam?: string;
    oneBasedPage?: boolean;
}

export function mapRestQuery(
    params: RestQueryMapperParams,
    options: RestQueryMapperOptions = {},
): URLSearchParams {
    const {
        pageParam = 'page',
        pageSizeParam = 'pageSize',
        searchParam = 'search',
        sortParam = 'sort',
        filterParam = 'filters',
        oneBasedPage = true,
    } = options;

    const query = new URLSearchParams();

    if (typeof params.pageIndex === 'number') {
        query.set(
            pageParam,
            String(oneBasedPage ? params.pageIndex + 1 : params.pageIndex),
        );
    }

    if (typeof params.pageSize === 'number') {
        query.set(pageSizeParam, String(params.pageSize));
    }

    if (params.search) {
        query.set(searchParam, params.search);
    }

    if (params.sorting?.length) {
        query.set(
            sortParam,
            params.sorting
                .map((sort) => `${sort.direction === 'desc' ? '-' : ''}${sort.columnId}`)
                .join(','),
        );
    }

    if (params.filters?.length) {
        query.set(filterParam, JSON.stringify(params.filters));
    }

    if (params.extra) {
        Object.entries(params.extra).forEach(([key, value]) => {
            if (value != null) {
                query.set(key, String(value));
            }
        });
    }

    return query;
}
