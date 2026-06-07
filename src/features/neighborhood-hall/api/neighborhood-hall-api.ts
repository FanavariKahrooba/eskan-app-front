import type {
    ApiCollectionResponse,
    ApiSingleResponse,
    NeighborhoodHallDashboard,
    NeighborhoodHallDetail,
    NeighborhoodHallDistrictOption,
    NeighborhoodHallEmployee,
    NeighborhoodHallEmployeePayload,
    NeighborhoodHallFormPayload,
    NeighborhoodHallListItem,
    NeighborhoodHallPosition,
    NeighborhoodHallRegionOption,
    NeighborhoodHallUserOption,
} from "../types/neighborhood-hall-types";

const API_BASE = "/api/v1/admin";

type ListParams = {
    q?: string;
    page?: number;
};

function buildQuery(params?: Record<string, string | number | undefined>) {
    const query = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.set(key, String(value));
        }
    });

    const qs = query.toString();
    return qs ? `?${qs}` : "";
}

async function requestJson<T>(
    url: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (!response.ok) {
        let message = "خطا در ارتباط با سرور";

        try {
            const body = await response.json();
            message = body.message || body.error || message;
        } catch {
            // ignore
        }

        throw new Error(message);
    }

    return response.json();
}

function toFormData(payload: NeighborhoodHallFormPayload) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === "create_hall_cover_image" && value instanceof File) {
            formData.append(key, value);
            return;
        }

        formData.append(key, String(value));
    });

    return formData;
}

export const neighborhoodHallApi = {
    dashboard: () => {
        return requestJson<NeighborhoodHallDashboard>(
            `${API_BASE}/neighborhood-hall/list-info`,
        );
    },

    list: (params?: ListParams) => {
        return requestJson<ApiCollectionResponse<NeighborhoodHallListItem>>(
            `${API_BASE}/neighborhood-hall/${buildQuery(params)}`,
        );
    },

    userList: (params?: ListParams) => {
        return requestJson<ApiCollectionResponse<NeighborhoodHallListItem>>(
            `${API_BASE}/user/neighborhood-hall/${buildQuery(params)}`,
        );
    },

    show: (id: number | string) => {
        return requestJson<ApiSingleResponse<NeighborhoodHallDetail>>(
            `${API_BASE}/neighborhood-hall/${id}/edit`,
        );
    },

    create: (payload: NeighborhoodHallFormPayload) => {
        return requestJson<{ status: string }>(
            `${API_BASE}/neighborhood-hall/store`,
            {
                method: "POST",
                body: toFormData(payload),
            },
        );
    },

    update: (payload: NeighborhoodHallFormPayload) => {
        return requestJson<{ status: string }>(
            `${API_BASE}/neighborhood-hall/update`,
            {
                method: "POST",
                body: toFormData(payload),
            },
        );
    },

    disable: (id: number | string) => {
        return requestJson<{ status?: string; message?: string }>(
            `${API_BASE}/neighborhood-hall/${id}/disable`,
            {
                method: "DELETE",
            },
        );
    },

    users: () => {
        return requestJson<NeighborhoodHallUserOption[]>(
            `${API_BASE}/user-management/list-users`,
        );
    },

    districts: () => {
        return requestJson<NeighborhoodHallDistrictOption[]>(
            `${API_BASE}/district/`,
        );
    },

    regions: () => {
        return requestJson<NeighborhoodHallRegionOption[]>(
            `${API_BASE}/region/`,
        );
    },

    employees: {
        list: (params?: ListParams) => {
            return requestJson<ApiCollectionResponse<NeighborhoodHallEmployee>>(
                `${API_BASE}/neighborhood-hall-employees/${buildQuery(params)}`,
            );
        },

        servants: (params?: ListParams) => {
            return requestJson<ApiCollectionResponse<NeighborhoodHallEmployee>>(
                `${API_BASE}/neighborhood-hall-employees/servants${buildQuery(params)}`,
            );
        },

        positions: () => {
            return requestJson<NeighborhoodHallPosition[]>(
                `${API_BASE}/neighborhood-hall-employees/positions`,
            );
        },

        show: (id: number | string) => {
            return requestJson<ApiSingleResponse<NeighborhoodHallEmployee>>(
                `${API_BASE}/neighborhood-hall-employees/${id}/edit`,
            );
        },

        create: (payload: NeighborhoodHallEmployeePayload) => {
            return requestJson<{ status: string; message?: string }>(
                `${API_BASE}/neighborhood-hall-employees/store`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );
        },

        update: (payload: NeighborhoodHallEmployeePayload) => {
            return requestJson<{ status: string; message?: string }>(
                `${API_BASE}/neighborhood-hall-employees/update`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );
        },

        destroy: (id: number | string) => {
            return requestJson<{ message?: string }>(
                `${API_BASE}/neighborhood-hall-employees/${id}`,
                {
                    method: "DELETE",
                },
            );
        },
    },
};
