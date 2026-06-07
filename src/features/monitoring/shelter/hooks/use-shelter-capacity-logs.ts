"use client";

import { useQuery } from "@tanstack/react-query";
import { getShelterCapacityLogs } from "../api/shelter-monitoring.api";

export function useShelterCapacityLogs(params?: {
    page?: number;
    per_page?: number;
    neighborhood_hall_id?: number | string;
    from_date?: string;
    to_date?: string;
}) {
    return useQuery({
        queryKey: ["shelter-capacity-logs", params],
        queryFn: () => getShelterCapacityLogs(params),
        refetchInterval: 45000,
        retry: 2,
    });
}
