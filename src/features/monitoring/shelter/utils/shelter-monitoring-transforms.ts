import {
    ShelterMonitoringChartDatum,
    ShelterMonitoringDashboardResponse,
    ShelterMonitoringKpiItem,
} from "../types/shelter-monitoring.types";
import { formatNumber, formatPercent } from "./shelter-monitoring-format";

const FALLBACK_COLORS = [
    "#22d3ee",
    "#38bdf8",
    "#818cf8",
    "#a78bfa",
    "#f472b6",
    "#fb7185",
    "#f59e0b",
    "#22c55e",
];

export function chartMapToData(
    map?: Record<string, number> | null,
    labelResolver?: (key: string) => string
): ShelterMonitoringChartDatum[] {
    if (!map) return [];

    return Object.entries(map).map(([key, value], index) => ({
        name: labelResolver ? labelResolver(key) : key,
        value: Number(value ?? 0),
        color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }));
}

export function safeDashboardData(
    data?: Partial<ShelterMonitoringDashboardResponse> | null
): ShelterMonitoringDashboardResponse {
    return {
        summary: {
            enabled_shelters_count: data?.summary?.enabled_shelters_count ?? 0,
            active_shelters_count: data?.summary?.active_shelters_count ?? 0,
            active_spaces_count: data?.summary?.active_spaces_count ?? 0,
            reservable_spaces_count: data?.summary?.reservable_spaces_count ?? 0,
            requests_count: data?.summary?.requests_count ?? 0,
            reservations_count: data?.summary?.reservations_count ?? 0,
            active_reservations_count: data?.summary?.active_reservations_count ?? 0,
        },
        capacity: {
            total: data?.capacity?.total ?? 0,
            usable: data?.capacity?.usable ?? 0,
            available: data?.capacity?.available ?? 0,
            reserved: data?.capacity?.reserved ?? 0,
            occupied: data?.capacity?.occupied ?? 0,
            emergency: data?.capacity?.emergency ?? 0,
            occupancy_percent: data?.capacity?.occupancy_percent ?? 0,
        },
        charts: {
            requests_by_status: data?.charts?.requests_by_status ?? {},
            requests_by_priority: data?.charts?.requests_by_priority ?? {},
            requests_by_type: data?.charts?.requests_by_type ?? {},
            reservations_by_status: data?.charts?.reservations_by_status ?? {},
        },
        top_shelters_by_occupancy: data?.top_shelters_by_occupancy ?? [],
        recent_requests: data?.recent_requests ?? [],
    };
}

export function buildShelterKpis(
    dashboard: ShelterMonitoringDashboardResponse
): ShelterMonitoringKpiItem[] {
    const { summary, capacity } = dashboard;

    const occupancy = Number(capacity.occupancy_percent ?? 0);

    return [
        {
            id: "total-capacity",
            label: "ظرفیت کل",
            value: formatNumber(capacity.total),
            hint: "مجموع ظرفیت ثبت‌شده",
            severity: "info",
        },
        {
            id: "usable-capacity",
            label: "ظرفیت قابل استفاده",
            value: formatNumber(capacity.usable),
            hint: "ظرفیت عملیاتی قابل تخصیص",
            severity: "success",
        },
        {
            id: "available-capacity",
            label: "ظرفیت خالی",
            value: formatNumber(capacity.available),
            hint: "ظرفیت باقی‌مانده برای پذیرش",
            severity:
                capacity.available <= 0
                    ? "danger"
                    : occupancy >= 85
                        ? "warning"
                        : "success",
        },
        {
            id: "reserved-capacity",
            label: "رزرو شده",
            value: formatNumber(capacity.reserved),
            hint: "ظرفیت رزرو و در انتظار اشغال",
            severity: "warning",
        },
        {
            id: "occupied-capacity",
            label: "اشغال شده",
            value: formatNumber(capacity.occupied),
            hint: "ظرفیت فعلاً اشغال‌شده",
            severity: occupancy >= 90 ? "danger" : "info",
        },
        {
            id: "emergency-capacity",
            label: "ظرفیت اضطراری",
            value: formatNumber(capacity.emergency),
            hint: "ظرفیت مخصوص شرایط اضطراری",
            severity: capacity.emergency <= 0 ? "danger" : "warning",
        },
        {
            id: "occupancy-rate",
            label: "نرخ اشغال",
            value: formatPercent(capacity.occupancy_percent),
            hint: "نسبت اشغال به ظرفیت قابل استفاده",
            severity:
                occupancy >= 90
                    ? "danger"
                    : occupancy >= 75
                        ? "warning"
                        : "success",
        },
        {
            id: "active-reservations",
            label: "رزروهای فعال",
            value: formatNumber(summary.active_reservations_count),
            hint: "رزروهایی که هنوز فعال هستند",
            severity: "info",
        },
    ];
}
