"use client";

import { useQuery } from "@tanstack/react-query";

type ShelterOverviewParams = {
    top?: number;
    recent_requests?: number;
    capacity_logs?: number;
};

export function useShelterOverview(params: ShelterOverviewParams) {
    return useQuery({
        queryKey: ["shelter-overview", params],
        queryFn: async () => {
            const search = new URLSearchParams();

            if (params.top != null) search.set("top", String(params.top));
            if (params.recent_requests != null) {
                search.set("recent_requests", String(params.recent_requests));
            }
            if (params.capacity_logs != null) {
                search.set("capacity_logs", String(params.capacity_logs));
            }

            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("token")
                    : null;

            const response = await fetch(
                `/api/dashboard/shelter-overview?${search.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    cache: "no-store",
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "خطا در دریافت اطلاعات اسکان");
            }

            return response.json();
        },
    });
}
