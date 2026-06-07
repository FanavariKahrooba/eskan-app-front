export interface RestResponseMapperOptions {
    rowsKey?: string;
    totalRowsKey?: string;
    pageIndexKey?: string;
    pageSizeKey?: string;
    pageCountKey?: string;
    oneBasedPage?: boolean;
}

function deepGet(source: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, part) => {
        if (acc == null) return undefined;
        return (acc as Record<string, unknown>)[part];
    }, source);
}

export interface MappedRestResponse<TRow> {
    rows: TRow[];
    totalRows: number;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    raw: unknown;
}

export function mapRestResponse<TRow>(
    response: unknown,
    options: RestResponseMapperOptions = {},
): MappedRestResponse<TRow> {
    const {
        rowsKey = 'data',
        totalRowsKey = 'total',
        pageIndexKey = 'page',
        pageSizeKey = 'pageSize',
        pageCountKey = 'pageCount',
        oneBasedPage = true,
    } = options;

    const rows = deepGet(response, rowsKey);
    const totalRows = Number(deepGet(response, totalRowsKey) ?? 0);
    const rawPageIndex = Number(deepGet(response, pageIndexKey) ?? 1);
    const pageSize = Number(deepGet(response, pageSizeKey) ?? 10);

    const pageIndex = oneBasedPage ? rawPageIndex - 1 : rawPageIndex;

    const pageCount =
        Number(deepGet(response, pageCountKey)) ||
        Math.ceil(totalRows / pageSize);

    return {
        rows: Array.isArray(rows) ? (rows as TRow[]) : [],
        totalRows,
        pageIndex,
        pageSize,
        pageCount,
        raw: response,
    };
}
