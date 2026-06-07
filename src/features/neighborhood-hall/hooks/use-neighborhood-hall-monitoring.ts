"use client";

import * as React from "react";
import { neighborhoodHallMonitoringApi } from "../api/neighborhood-hall-monitoring-api";
import type {
    MonitoringDashboardResponse,
    MonitoringFilterState,
} from "../types/neighborhood-hall-monitoring-types";

export function useNeighborhoodHallMonitoring() {
    const [data, setData] = React.useState<MonitoringDashboardResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [autoRefresh, setAutoRefresh] = React.useState(true);
    const [filters, setFilters] = React.useState<MonitoringFilterState>({
        regionId: "all",
        serviceStatus: "all",
    });

    const loadDashboard = React.useCallback(async (silent?: boolean) => {
        try {
            if (silent) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);
            const response = await neighborhoodHallMonitoringApi.dashboard();
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "خطا در دریافت داده‌های مانیتورینگ");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDashboard();
    }, [loadDashboard]);

    React.useEffect(() => {
        if (!autoRefresh || !data?.refresh_interval_sec) return;

        const timer = window.setInterval(() => {
            loadDashboard(true);
        }, data.refresh_interval_sec * 1000);

        return () => window.clearInterval(timer);
    }, [autoRefresh, data?.refresh_interval_sec, loadDashboard]);

    const regions = React.useMemo(() => {
        const source = data?.vectors || [];
        return source.map((item) => ({
            id: String(item.id),
            name: item.name,
        }));
    }, [data?.vectors]);

    const filteredServices = React.useMemo(() => {
        const source = data?.services || [];

        return source.filter((item) => {
            const regionOk =
                filters.regionId === "all" || String(item.region_id) === filters.regionId;

            const statusOk =
                filters.serviceStatus === "all" || item.status === filters.serviceStatus;

            return regionOk && statusOk;
        });
    }, [data?.services, filters]);

    const filteredAlerts = React.useMemo(() => {
        const source = data?.alerts || [];

        return source.filter((item) => {
            if (filters.regionId === "all") return true;
            return String(item.region_id) === filters.regionId;
        });
    }, [data?.alerts, filters.regionId]);

    const filteredVectors = React.useMemo(() => {
        const source = data?.vectors || [];

        if (filters.regionId === "all") return source;
        return source.filter((item) => String(item.id) === filters.regionId);
    }, [data?.vectors, filters.regionId]);

    return {
        data,
        loading,
        refreshing,
        error,
        autoRefresh,
        setAutoRefresh,
        filters,
        setFilters,
        regions,
        filteredServices,
        filteredAlerts,
        filteredVectors,
        reload: loadDashboard,
    };
}
