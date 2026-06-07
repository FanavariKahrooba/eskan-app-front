"use client";

import { useQuery } from "@tanstack/react-query";
import {
    getHallsOverview,
    HallsOverviewFilters,
} from "../api/get-halls-overview";

export function useHallsOverview(filters: HallsOverviewFilters = {}) {
    return useQuery({
        queryKey: ["monitoring", "halls", "overview", filters],
        queryFn: () => getHallsOverview(filters),
        refetchInterval: 30000,
        staleTime: 20000,
        retry: 1,
    });
}
