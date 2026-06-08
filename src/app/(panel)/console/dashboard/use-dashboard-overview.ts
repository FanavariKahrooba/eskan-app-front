"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type DashboardOverviewFilters = {
    top?: number;
    region_id?: number | null;
    district_id?: number | null;
};

export type HallKpis = {
    total_halls: number;
    active_halls: number;
    inactive_halls: number;
    halls_with_info: number;
    halls_without_info: number;
    halls_with_geo: number;
    halls_with_missing_geo: number;
    halls_with_contact: number;
    halls_with_missing_contact: number;
    halls_with_manager: number;
    halls_without_manager: number;
    shelter_enabled_halls: number;
    halls_with_profile: number;
    halls_without_profile: number;
    total_capacity: number;
    usable_capacity: number;
    available_capacity: number;
    reserved_capacity: number;
    occupied_capacity: number;
    average_usage_rate: number;
    average_occupancy_rate: number;
    critical_halls: number;
    halls_with_programs: number;
};

export type StatusBreakdownItem = {
    key: string;
    label: string;
    value: number;
};

export type RegionBreakdownItem = {
    region_id: number;
    region_name: string;
    total_halls: number;
    active_halls: number;
    shelter_enabled_halls: number;
    halls_with_info: number;
    total_capacity: number;
    available_capacity: number;
    usage_rate: number;
};

export type HallsOverviewResponse = {
    success: boolean;
    generated_at: string;
    data: {
        kpis: HallKpis;
        status_breakdown: StatusBreakdownItem[];
        region_breakdown: RegionBreakdownItem[];
    };
};

export function useDashboardOverview(filters: DashboardOverviewFilters = {}) {
    return useQuery<HallsOverviewResponse>({
        queryKey: ["dashboard-halls-overview", filters],
        queryFn: async () => {
            const response = await axios.get<HallsOverviewResponse>(
                "/api/dashboard/halls-overview",
                {
                    params: {
                        top: filters.top ?? 8,
                        region_id: filters.region_id ?? undefined,
                        district_id: filters.district_id ?? undefined,
                    },
                },
            );

            return response.data;
        },
    });
}
