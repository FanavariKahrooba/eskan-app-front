"use client";

import { useQuery } from "@tanstack/react-query";

export type HallsOverviewParams = {
    region_id?: number | string;
    district_id?: number | string;
    top?: number | string;
};

export type HallsOverviewAlertSeverity = "info" | "warning" | "critical";

export type HallsOverviewAlert = {
    title: string;
    message: string;
    severity: HallsOverviewAlertSeverity;
};

export type HallsOverviewTopHall = {
    id: number | string;
    name: string;
    region_id?: number | string | null;
    district_id?: number | string | null;
    region_name?: string | null;
    district_name?: string | null;
    is_active?: boolean;
    has_coordinates?: boolean;
    has_contact?: boolean;
    has_manager?: boolean;
    score?: number;
};

export type HallsOverviewData = {
    summary: {
        total_halls: number;
        active_halls: number;
        inactive_halls: number;
        activity_rate: number;
    };
    data_quality: {
        with_coordinates: number;
        without_coordinates: number;
        with_contact: number;
        without_contact: number;
        with_manager: number;
        without_manager: number;
    };
    infrastructure: {
        theater: number;
        workshop: number;
        sports: number;
        fire_safety: number;
    };
    charts?: {
        activity?: Array<{ label: string; value: number }>;
        geo_quality?: Array<{ label: string; value: number }>;
        data_quality?: Array<{ label: string; value: number }>;
        infrastructure?: Array<{ label: string; value: number }>;
    };
    top_halls?: HallsOverviewTopHall[];
    alerts?: HallsOverviewAlert[];
    [key: string]: unknown;
};

export type HallsOverviewResponse = {
    success?: boolean;
    message?: string;
    data: HallsOverviewData;
};

async function getHallsOverview(
    params: HallsOverviewParams = {},
): Promise<HallsOverviewData> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL تنظیم نشده است");
    }

    const searchParams = new URLSearchParams();

    if (params.region_id !== undefined && params.region_id !== null) {
        searchParams.set("region_id", String(params.region_id));
    }

    if (params.district_id !== undefined && params.district_id !== null) {
        searchParams.set("district_id", String(params.district_id));
    }

    if (params.top !== undefined && params.top !== null) {
        searchParams.set("top", String(params.top));
    }

    const url = `${baseUrl}/api/v1/admin/monitoring/halls/overview${searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات مانیتورینگ سراها");
    }

    const result: HallsOverviewResponse = await response.json();

    if (!result?.data) {
        throw new Error("داده‌ای برای مانیتورینگ سراها دریافت نشد");
    }

    return result.data;
}

export function useHallsOverview(params: HallsOverviewParams = {}) {
    return useQuery({
        queryKey: ["monitoring", "halls", "overview", params],
        queryFn: () => getHallsOverview(params),
        staleTime: 20 * 1000,
        refetchInterval: 30 * 1000,
        refetchOnWindowFocus: true,
    });
}
