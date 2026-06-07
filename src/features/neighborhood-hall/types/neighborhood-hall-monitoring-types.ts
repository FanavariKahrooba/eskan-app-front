export type MonitoringKpiStatus = "healthy" | "warning" | "critical" | "neutral";

export type MonitoringKpi = {
    title: string;
    value: number | string;
    unit?: string;
    change?: number;
    status?: MonitoringKpiStatus;
};

export type MonitoringServiceState = "online" | "degraded" | "offline";

export type MonitoringServiceStatus = {
    id: string | number;
    name: string;
    region_id?: string | number;
    region_name?: string;
    status: MonitoringServiceState;
    latency_ms: number;
    uptime_percent: number;
    last_check_at: string;
};

export type MonitoringTrafficPoint = {
    time: string;
    requests: number;
    errors: number;
    active_users: number;
};

export type MonitoringAlertSeverity = "info" | "warning" | "critical";

export type MonitoringAlert = {
    id: string | number;
    title: string;
    severity: MonitoringAlertSeverity;
    source: string;
    created_at: string;
    description?: string;
    region_id?: string | number;
    region_name?: string;
};

export type MonitoringLogLevel = "info" | "warning" | "error";

export type MonitoringLogRow = {
    id: string | number;
    event: string;
    level: MonitoringLogLevel;
    actor?: string;
    target?: string;
    created_at: string;
};

export type MonitoringRegionVectorStatus = "healthy" | "warning" | "critical";

export type MonitoringRegionVector = {
    id: number | string;
    name: string;
    load_percent: number;
    active_halls: number;
    status: MonitoringRegionVectorStatus;
};

export type MonitoringDashboardResponse = {
    generated_at: string;
    refresh_interval_sec: number;
    kpis: MonitoringKpi[];
    services: MonitoringServiceStatus[];
    traffic: MonitoringTrafficPoint[];
    alerts: MonitoringAlert[];
    logs: MonitoringLogRow[];
    vectors: MonitoringRegionVector[];
};

export type MonitoringFilterState = {
    regionId: string;
    serviceStatus: "all" | MonitoringServiceState;
};
