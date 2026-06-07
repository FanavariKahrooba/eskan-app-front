export interface ShelterMonitoringSummary {
    enabled_shelters_count: number;
    active_shelters_count: number;
    active_spaces_count: number;
    reservable_spaces_count: number;
    requests_count: number;
    reservations_count: number;
    active_reservations_count: number;
}

export interface ShelterMonitoringCapacity {
    total: number;
    usable: number;
    available: number;
    reserved: number;
    occupied: number;
    emergency: number;
    occupancy_percent: number;
}

export type MonitoringChartMap = Record<string, number>;

export interface ShelterMonitoringCharts {
    requests_by_status: MonitoringChartMap;
    requests_by_priority: MonitoringChartMap;
    requests_by_type: MonitoringChartMap;
    reservations_by_status: MonitoringChartMap;
}

export interface ShelterTopItem {
    neighborhood_hall_id: number;
    neighborhood_hall_name: string | null;
    total_capacity: number;
    usable_capacity: number;
    available_capacity: number;
    reserved_capacity: number;
    occupied_capacity: number;
    occupancy_percent: number;
}

export interface ShelterRecentRequestItem {
    id: number;
    request_number: string;
    neighborhood_hall_id: number | null;
    neighborhood_hall_name: string | null;
    applicant_name: string;
    applicant_mobile: string | null;
    household_size: number;
    request_type: string;
    priority_level: string;
    status: string;
    created_at: string;
}

export interface ShelterMonitoringDashboardResponse {
    summary: ShelterMonitoringSummary;
    capacity: ShelterMonitoringCapacity;
    charts: ShelterMonitoringCharts;
    top_shelters_by_occupancy: ShelterTopItem[];
    recent_requests: ShelterRecentRequestItem[];
}

export interface ShelterMonitoringFilters {
    neighborhood_hall_id?: number | string;
    from_date?: string;
    to_date?: string;
}

export interface ShelterMonitoringApiEnvelope<T> {
    data?: T;
    message?: string;
    status?: boolean;
}

export type ShelterMonitoringSeverity = "normal" | "info" | "warning" | "danger" | "success";

export interface ShelterMonitoringAlert {
    id: string;
    title: string;
    description: string;
    severity: ShelterMonitoringSeverity;
    metric?: string | number;
    createdAt: string;
}

export interface ShelterMonitoringChartDatum {
    name: string;
    value: number;
    color?: string;
}

export interface ShelterMonitoringKpiItem {
    id: string;
    label: string;
    value: number | string;
    hint?: string;
    severity?: ShelterMonitoringSeverity;
    trendLabel?: string;
}

export interface ShelterCapacityLogItem {
    id: number;
    shelter_space_id?: number | null;
    neighborhood_hall_id?: number | null;
    neighborhood_hall_name?: string | null;
    before_available_capacity?: number | null;
    after_available_capacity?: number | null;
    before_reserved_capacity?: number | null;
    after_reserved_capacity?: number | null;
    before_occupied_capacity?: number | null;
    after_occupied_capacity?: number | null;
    change_type?: string | null;
    description?: string | null;
    created_at?: string | null;
}

export interface ShelterCapacityLogsResponse {
    data: ShelterCapacityLogItem[];
    meta?: {
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
}
