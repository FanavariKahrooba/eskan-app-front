"use client";

import { useQuery } from "@tanstack/react-query";

export type ShelterOverviewParams = {
    region_id?: number | string;
    district_id?: number | string;
    top?: number | string;
    recent_requests?: number | string;
    capacity_logs?: number | string;
};

export type ShelterAlertSeverity = "info" | "warning" | "critical";

export type ShelterAlert = {
    title: string;
    message: string;
    severity: ShelterAlertSeverity;
};

export type ShelterTopHall = {
    id: number | string;
    name: string;
    region_id?: number | string | null;
    district_id?: number | string | null;
    region_name?: string | null;
    district_name?: string | null;
    total_capacity?: number;
    occupied_capacity?: number;
    available_capacity?: number;
    occupancy_rate?: number;
};

export type ShelterOverviewKpis = {
    total_halls: number;
    active_halls: number;
    total_capacity: number;
    usable_capacity: number;
    available_capacity: number;
    reserved_capacity: number;
    occupied_capacity: number;
    emergency_capacity: number;
    used_capacity: number;
    usage_rate: number;
    occupancy_rate: number;
    active_requests: number;
    active_reservations: number;
    alerts_count?: number;
    critical_shelters?: number;
};

export type ShelterOverviewData = {
    kpis: ShelterOverviewKpis;
    capacity_breakdown?: Array<{
        label: string;
        value: number;
    }>;
    request_status_breakdown?: Array<{
        label: string;
        value: number;
    }>;
    request_priority_breakdown?: Array<{
        label: string;
        value: number;
    }>;
    top_shelters?: ShelterTopHall[];
    alerts?: ShelterAlert[];
    [key: string]: unknown;
};

export type ShelterOverviewResponse = {
    success?: boolean;
    message?: string;
    data: ShelterOverviewData;
};

async function getShelterOverview(
    params: ShelterOverviewParams = {},
): Promise<ShelterOverviewResponse> {
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

    if (
        params.recent_requests !== undefined &&
        params.recent_requests !== null
    ) {
        searchParams.set("recent_requests", String(params.recent_requests));
    }

    if (params.capacity_logs !== undefined && params.capacity_logs !== null) {
        searchParams.set("capacity_logs", String(params.capacity_logs));
    }

    const url = `${baseUrl}/api/v1/admin/shelter/overview${searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات مانیتورینگ اسکان");
    }

    const result: ShelterOverviewResponse = await response.json();

    if (!result?.data) {
        throw new Error("داده‌ای برای مانیتورینگ اسکان دریافت نشد");
    }

    return result;
}

export function useShelterOverview(params: ShelterOverviewParams = {}) {
    return useQuery({
        queryKey: ["monitoring", "shelter", "overview", params],
        queryFn: () => getShelterOverview(params),
        staleTime: 20 * 1000,
        refetchInterval: 30 * 1000,
        refetchOnWindowFocus: true,
    });
}
