"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getShelterMonitoringDashboard } from "../api/shelter-monitoring.api";
import { ShelterMonitoringFilters } from "../types/shelter-monitoring.types";
import {
    buildShelterKpis,
    safeDashboardData,
} from "../utils/shelter-monitoring-transforms";
import { buildShelterMonitoringAlerts } from "../utils/shelter-monitoring-alerts";

export function useShelterMonitoringDashboard(
    filters?: ShelterMonitoringFilters,
    options?: {
        refetchInterval?: number;
        enabled?: boolean;
    }
) {
    const query = useQuery({
        queryKey: ["shelter-monitoring-dashboard", filters],
        queryFn: () => getShelterMonitoringDashboard(filters),
        refetchInterval: options?.refetchInterval ?? 30000,
        enabled: options?.enabled ?? true,
        retry: 2,
    });

    const dashboard = useMemo(
        () => safeDashboardData(query.data),
        [query.data]
    );

    const kpis = useMemo(
        () => buildShelterKpis(dashboard),
        [dashboard]
    );

    const alerts = useMemo(
        () => buildShelterMonitoringAlerts(dashboard),
        [dashboard]
    );

    return {
        ...query,
        dashboard,
        kpis,
        alerts,
        lastUpdatedAt: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    };
}
