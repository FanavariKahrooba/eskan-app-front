export interface GraphQLLoadParams {
    pageIndex?: number;
    pageSize?: number;
    search?: string;
    sorting?: Array<{
        columnId: string;
        direction: 'asc' | 'desc';
    }>;
    filters?: Array<{
        columnId: string;
        operator?: string;
        value: unknown;
    }>;
    extra?: Record<string, unknown>;
}

export interface GraphQLLoadResult<TRow> {
    rows: TRow[];
    totalRows: number;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    raw: unknown;
}

export interface GraphQLDataAdapterOptions<TRow> {
    endpoint: string;
    query: string;
    operationName?: string;
    headers?: HeadersInit;
    credentials?: RequestCredentials;
    variables?: Record<string, unknown>;

    mapVariables?: (
        params: GraphQLLoadParams,
    ) => Record<string, unknown>;

    mapResponse?: (
        response: unknown,
        params: GraphQLLoadParams,
    ) => GraphQLLoadResult<TRow>;

    fetcher?: typeof fetch;
}

function defaultMapVariables(params: GraphQLLoadParams) {
    return {
        page: (params.pageIndex ?? 0) + 1,
        pageSize: params.pageSize ?? 10,
        search: params.search,
        sorting: params.sorting,
        filters: params.filters,
        ...(params.extra ?? {}),
    };
}

function deepGet(source: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, part) => {
        if (acc == null) return undefined;
        return (acc as Record<string, unknown>)[part];
    }, source);
}

function defaultMapResponse<TRow>(
    response: unknown,
    params: GraphQLLoadParams,
): GraphQLLoadResult<TRow> {
    const rows =
        deepGet(response, 'data.rows') ??
        deepGet(response, 'data.items') ??
        deepGet(response, 'data.nodes') ??
        [];

    const totalRows =
        Number(
            deepGet(response, 'data.totalRows') ??
            deepGet(response, 'data.total') ??
            0,
        );

    const pageSize = params.pageSize ?? 10;
    const pageIndex = params.pageIndex ?? 0;

    return {
        rows: Array.isArray(rows) ? (rows as TRow[]) : [],
        totalRows,
        pageIndex,
        pageSize,
        pageCount: Math.ceil(totalRows / pageSize),
        raw: response,
    };
}

export function createGraphQLDataAdapter<TRow>(
    options: GraphQLDataAdapterOptions<TRow>,
) {
    const fetcher = options.fetcher ?? fetch;

    return {
        async load(
            params: GraphQLLoadParams = {},
        ): Promise<GraphQLLoadResult<TRow>> {
            const variables = {
                ...(options.variables ?? {}),
                ...(options.mapVariables?.(params) ?? defaultMapVariables(params)),
            };

            const res = await fetcher(options.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers ?? {}),
                },
                credentials: options.credentials,
                body: JSON.stringify({
                    query: options.query,
                    operationName: options.operationName,
                    variables,
                }),
            });

            if (!res.ok) {
                throw new Error(`GraphQL adapter request failed: ${res.status}`);
            }

            const json = await res.json();

            if ((json as any).errors?.length) {
                throw new Error((json as any).errors[0]?.message ?? 'GraphQL error');
            }

            return options.mapResponse
                ? options.mapResponse(json, params)
                : defaultMapResponse<TRow>(json, params);
        },
    };
}

export type GraphQLDataAdapter<TRow> = ReturnType<
    typeof createGraphQLDataAdapter<TRow>
>;
