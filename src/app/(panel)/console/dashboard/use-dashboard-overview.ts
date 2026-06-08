"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type DashboardOverviewFilters = {
    top?: number;
    recent?: number;
    alerts?: number;
    search?: string;
    tab?: string;
    region_id?: number | null;
    district_id?: number | null;
};

export function useDashboardOverview(filters: DashboardOverviewFilters) {
    return useQuery({
        queryKey: ["dashboard-overview", filters],
        queryFn: async () => {
            const shelterParams = {
                top: filters.top ?? 5,
                recent_requests: filters.recent ?? 8,
                capacity_logs: filters.alerts ?? 8,
            };

            const hallsParams = {
                top: filters.top ?? 8,
                region_id: filters.region_id ?? null,
                district_id: filters.district_id ?? null,
            };

            const [shelterResponse, hallsResponse] = await Promise.all([
                axios.get("/api/dashboard/shelter-overview", {
                    params: shelterParams,
                }),
                axios.get("/api/dashboard/halls-overview", {
                    params: hallsParams,
                }),
            ]);

            return {
                shelter: shelterResponse.data,
                halls: hallsResponse.data,
                filters,
            };
        },
    });
}
