"use client";

import { useQuery } from "@tanstack/react-query";
import { getShelterOverview, ShelterOverviewFilters } from "../api/get-shelter-overview";

export function useShelterOverview(filters: ShelterOverviewFilters = {}) {
    return useQuery({
        queryKey: ["monitoring", "shelter", "overview", filters],
        queryFn: () => getShelterOverview(filters),
        refetchInterval: 30000,
        staleTime: 20000,
        retry: 1,
    });
}
