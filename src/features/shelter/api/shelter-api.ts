import type {
    ApiResponse,
    PaginatedResponse,
    ShelterDashboard,
    ShelterProfile,
    ShelterRequest,
    ShelterReservation,
    ShelterSpace,
    ShelterCategory,
    ShelterCategoryStatus,
    ShelterFacility,
    ShelterFacilityStatus,
    ShelterCapacityRule,
    CapacityRuleStatus,
} from "../types/shelter-types";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "";

const ADMIN_SHELTER_BASE = `${API_BASE_URL}/api/v1/admin/shelter`;

type QueryValue = string | number | boolean | null | undefined;


type ListResponse<T> = {
    data: T[];
    meta?: {
        total?: number;
        per_page?: number;
        current_page?: number;
    };
};

type ListParams<TStatus extends string = string> = {
    search?: string;
    status?: TStatus;
    per_page?: number;
};

function getToken() {
    if (typeof window === "undefined") return null;

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("jwt")
    );
}

function buildQuery(params?: Record<string, QueryValue>) {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        searchParams.set(key, String(value));
    });

    const query = searchParams.toString();

    return query ? `?${query}` : "";
}

async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getToken();

    const response = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");

    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
        const message =
            payload?.message ||
            payload?.error ||
            `خطا در ارتباط با سرور. کد: ${response.status}`;

        throw new Error(message);
    }

    return payload as T;
}

export const shelterApi = {
    dashboard() {
        return request<ApiResponse<ShelterDashboard>>(
            `${ADMIN_SHELTER_BASE}/dashboard`,
        );
    },

    profiles(params?: {
        search?: string;
        status?: string;
        page?: number;
        per_page?: number;
        region_id?: number | string;
        district_id?: number | string;
    }) {
        return request<PaginatedResponse<ShelterProfile>>(
            `${ADMIN_SHELTER_BASE}/profiles${buildQuery(params)}`,
        );
    },

    profile(id: string | number) {
        return request<ApiResponse<ShelterProfile>>(
            `${ADMIN_SHELTER_BASE}/profiles/${id}`,
        );
    },

    createProfile(payload: Partial<ShelterProfile>) {
        return request<ApiResponse<ShelterProfile>>(
            `${ADMIN_SHELTER_BASE}/profiles`,
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    updateProfile(id: string | number, payload: Partial<ShelterProfile>) {
        return request<ApiResponse<ShelterProfile>>(
            `${ADMIN_SHELTER_BASE}/profiles/${id}`,
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    spaces(params?: {
        search?: string;
        status?: string;
        type?: string;
        shelter_profile_id?: number | string;
        page?: number;
        per_page?: number;
    }) {
        return request<PaginatedResponse<ShelterSpace>>(
            `${ADMIN_SHELTER_BASE}/spaces${buildQuery(params)}`,
        );
    },

    space(id: string | number) {
        return request<ApiResponse<ShelterSpace>>(
            `${ADMIN_SHELTER_BASE}/spaces/${id}`,
        );
    },

    createSpace(payload: Partial<ShelterSpace>) {
        return request<ApiResponse<ShelterSpace>>(
            `${ADMIN_SHELTER_BASE}/spaces`,
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    updateSpace(id: string | number, payload: Partial<ShelterSpace>) {
        return request<ApiResponse<ShelterSpace>>(
            `${ADMIN_SHELTER_BASE}/spaces/${id}`,
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    deleteSpace(id: string | number) {
        return request<ApiResponse<null>>(
            `${ADMIN_SHELTER_BASE}/spaces/${id}`,
            {
                method: "DELETE",
            },
        );
    },

    requests(params?: {
        search?: string;
        status?: string;
        shelter_profile_id?: number | string;
        page?: number;
        per_page?: number;
    }) {
        return request<PaginatedResponse<ShelterRequest>>(
            `${ADMIN_SHELTER_BASE}/requests${buildQuery(params)}`,
        );
    },

    request(id: string | number) {
        return request<ApiResponse<ShelterRequest>>(
            `${ADMIN_SHELTER_BASE}/requests/${id}`,
        );
    },

    reviewRequest(
        id: string | number,
        payload: {
            status: "approved" | "rejected";
            admin_note?: string;
        },
    ) {
        return request<ApiResponse<ShelterRequest>>(
            `${ADMIN_SHELTER_BASE}/requests/${id}/review`,
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    reservations(params?: {
        search?: string;
        status?: string;
        shelter_profile_id?: number | string;
        page?: number;
        per_page?: number;
    }) {
        return request<PaginatedResponse<ShelterReservation>>(
            `${ADMIN_SHELTER_BASE}/reservations${buildQuery(params)}`,
        );
    },

    reservation(id: string | number) {
        return request<ApiResponse<ShelterReservation>>(
            `${ADMIN_SHELTER_BASE}/reservations/${id}`,
        );
    },

    createReservation(payload: {
        shelter_request_id?: number | string;
        shelter_profile_id: number | string;
        shelter_space_id?: number | string;
        capacity: number;
    }) {
        return request<ApiResponse<ShelterReservation>>(
            `${ADMIN_SHELTER_BASE}/reservations`,
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    checkInReservation(id: string | number, payload?: { note?: string }) {
        return request<ApiResponse<ShelterReservation>>(
            `${ADMIN_SHELTER_BASE}/reservations/${id}/check-in`,
            {
                method: "POST",
                body: JSON.stringify(payload || {}),
            },
        );
    },

    checkOutReservation(id: string | number, payload?: { note?: string }) {
        return request<ApiResponse<ShelterReservation>>(
            `${ADMIN_SHELTER_BASE}/reservations/${id}/check-out`,
            {
                method: "POST",
                body: JSON.stringify(payload || {}),
            },
        );
    },

    cancelReservation(id: string | number, payload?: { reason?: string }) {
        return request<ApiResponse<ShelterReservation>>(
            `${ADMIN_SHELTER_BASE}/reservations/${id}/cancel`,
            {
                method: "POST",
                body: JSON.stringify(payload || {}),
            },
        );
    },

    categories: async (
        params?: ListParams<ShelterCategoryStatus>,
    ): Promise<ListResponse<ShelterCategory>> => {
        const query = new URLSearchParams();

        if (params?.search) query.set("search", params.search);
        if (params?.status) query.set("status", params.status);
        if (params?.per_page) query.set("per_page", String(params.per_page));

        const res = await fetch(`/api/shelter/categories?${query.toString()}`);

        if (!res.ok) {
            throw new Error("خطا در دریافت دسته‌بندی سراها");
        }

        return res.json();
    },

    facilities: async (
        params?: ListParams<ShelterFacilityStatus>,
    ): Promise<ListResponse<ShelterFacility>> => {
        const query = new URLSearchParams();

        if (params?.search) query.set("search", params.search);
        if (params?.status) query.set("status", params.status);
        if (params?.per_page) query.set("per_page", String(params.per_page));

        const res = await fetch(`/api/shelter/facilities?${query.toString()}`);

        if (!res.ok) {
            throw new Error("خطا در دریافت امکانات سرا");
        }

        return res.json();
    },

    capacityRules: async (
        params?: ListParams<CapacityRuleStatus>,
    ): Promise<ListResponse<ShelterCapacityRule>> => {
        const query = new URLSearchParams();

        if (params?.search) query.set("search", params.search);
        if (params?.status) query.set("status", params.status);
        if (params?.per_page) query.set("per_page", String(params.per_page));

        const res = await fetch(`/api/shelter/capacity-rules?${query.toString()}`);

        if (!res.ok) {
            throw new Error("خطا در دریافت قواعد ظرفیت");
        }

        return res.json();
    },
};
