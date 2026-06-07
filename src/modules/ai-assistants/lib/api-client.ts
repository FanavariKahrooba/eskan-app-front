import { AI_ASSISTANT_CONFIG } from "../config/ai-assistant";


type RequestOptions = RequestInit & {
    params?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
    const url = new URL(path, AI_ASSISTANT_CONFIG.apiBaseUrl);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });
    }

    return url.toString();
}

export async function apiRequest<T>(
    path: string,
    options: RequestOptions = {}
): Promise<T> {
    const { params, headers, ...rest } = options;

    const response = await fetch(buildUrl(path, params), {
        ...rest,
        headers: {
            Accept: "application/json",
            ...(rest.body ? { "Content-Type": "application/json" } : {}),
            ...headers,
        },
        cache: "no-store",
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(json?.message || "API request failed");
    }

    return json as T;
}
