import {
    ShelterCapacityLogsResponse,
    ShelterMonitoringDashboardResponse,
    ShelterMonitoringFilters,
} from "../types/shelter-monitoring.types";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

function buildQuery(params?: Record<string, unknown>) {
    if (!params) return "";

    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        search.set(key, String(value));
    });

    const query = search.toString();
    return query ? `?${query}` : "";
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    const response = await fetch(url, {
        ...init,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
        credentials: "include",
        cache: "no-store",
    });

    if (!response.ok) {
        let message = "خطا در دریافت اطلاعات از سرور";

        try {
            const errorBody = await response.json();
            message =
                errorBody?.message ||
                errorBody?.error ||
                `API Error: ${response.status}`;
        } catch {
            message = `API Error: ${response.status}`;
        }

        throw new Error(message);
    }

    return response.json() as Promise<T>;
}

/**
 * اگر بک‌اند مستقیم object dashboard را برگرداند، همین خروجی را می‌گیریم.
 * اگر داخل data برگرداند، normalize می‌کنیم.
 */
function unwrapDashboardResponse(payload: any): ShelterMonitoringDashboardResponse {
    return payload?.data ?? payload;
}

export async function getShelterMonitoringDashboard(
    filters?: ShelterMonitoringFilters
): Promise<ShelterMonitoringDashboardResponse> {
    const query = buildQuery(filters as Record<string, unknown>);

    const payload = await apiFetch<any>(
        `/api/v1/admin/shelter/dashboard${query}`
    );

    return unwrapDashboardResponse(payload);
}

export async function getShelterCapacityLogs(params?: {
    page?: number;
    per_page?: number;
    neighborhood_hall_id?: number | string;
    from_date?: string;
    to_date?: string;
}): Promise<ShelterCapacityLogsResponse> {
    const query = buildQuery(params);

    const payload = await apiFetch<any>(
        `/api/v1/admin/shelter/capacity-logs${query}`
    );

    if (Array.isArray(payload)) {
        return {
            data: payload,
        };
    }

    return {
        data: payload?.data ?? [],
        meta: payload?.meta,
    };
}
