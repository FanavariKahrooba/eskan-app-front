import {
    mapRestQuery,
    type RestQueryMapperOptions,
    type RestQueryMapperParams,
} from './rest-query-mapper';
import {
    mapRestResponse,
    type RestResponseMapperOptions,
    type MappedRestResponse,
} from './rest-response-mapper';

export interface RestDataAdapterOptions<TRow> {
    endpoint: string;
    method?: 'GET' | 'POST';
    headers?: HeadersInit;
    credentials?: RequestCredentials;
    queryMapperOptions?: RestQueryMapperOptions;
    responseMapperOptions?: RestResponseMapperOptions;
    mapParams?: (params: RestQueryMapperParams) => RestQueryMapperParams;
    mapResponse?: (response: unknown) => MappedRestResponse<TRow>;
    fetcher?: typeof fetch;
}

export function createRestDataAdapter<TRow>(
    options: RestDataAdapterOptions<TRow>,
) {
    const fetcher = options.fetcher ?? fetch;

    return {
        async load(
            params: RestQueryMapperParams = {},
        ): Promise<MappedRestResponse<TRow>> {
            const mappedParams = options.mapParams?.(params) ?? params;

            const method = options.method ?? 'GET';

            let url = options.endpoint;
            let body: BodyInit | undefined;

            if (method === 'GET') {
                const query = mapRestQuery(mappedParams, options.queryMapperOptions);
                const separator = url.includes('?') ? '&' : '?';
                url = query.toString() ? `${url}${separator}${query.toString()}` : url;
            } else {
                body = JSON.stringify(mappedParams);
            }

            const res = await fetcher(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers ?? {}),
                },
                credentials: options.credentials,
                body,
            });

            if (!res.ok) {
                throw new Error(`REST adapter request failed: ${res.status}`);
            }

            const json = await res.json();

            if (options.mapResponse) {
                return options.mapResponse(json);
            }

            return mapRestResponse<TRow>(json, options.responseMapperOptions);
        },
    };
}

export type RestDataAdapter<TRow> = ReturnType<
    typeof createRestDataAdapter<TRow>
>;
