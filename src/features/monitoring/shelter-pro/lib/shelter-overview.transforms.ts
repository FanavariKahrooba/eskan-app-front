import { ShelterOverviewData } from "../types/shelter-overview.types";
import {
    capacityColors,
    requestPriorityColors,
    requestStatusColors,
    severityColors,
    spaceTypePalette,
} from "./shelter-overview.colors";

export function transformCapacityBreakdown(data: ShelterOverviewData) {
    return (data.capacity_breakdown ?? []).map((item) => ({
        ...item,
        color: capacityColors[item.key] ?? "#94a3b8",
    }));
}

export function transformRequestStatuses(data: ShelterOverviewData) {
    return (data.request_statuses ?? []).map((item) => ({
        ...item,
        color: requestStatusColors[item.key] ?? "#94a3b8",
    }));
}

export function transformRequestPriorities(data: ShelterOverviewData) {
    return (data.request_priorities ?? []).map((item) => ({
        ...item,
        color: requestPriorityColors[item.key] ?? "#94a3b8",
    }));
}

export function transformSpaceTypes(data: ShelterOverviewData) {
    return (data.space_types ?? []).map((item, index) => ({
        ...item,
        color: spaceTypePalette[index % spaceTypePalette.length],
    }));
}

export function transformAlerts(data: ShelterOverviewData) {
    return (data.alerts ?? []).map((item) => ({
        ...item,
        color: severityColors[item.severity] ?? "#94a3b8",
    }));
}

export function buildKpis(data: ShelterOverviewData) {
    const k = data.kpis;

    return [
        {
            key: "total_capacity",
            title: "ظرفیت کل",
            value: k.total_capacity,
            subtitle: `قابل استفاده: ${k.usable_capacity}`,
            tone: "neutral",
        },
        {
            key: "available_capacity",
            title: "ظرفیت خالی",
            value: k.available_capacity,
            subtitle: `${Math.round((k.available_capacity / Math.max(k.usable_capacity, 1)) * 100)}٪ از ظرفیت`,
            tone: k.available_capacity <= 10 ? "danger" : "success",
        },
        {
            key: "usage_rate",
            title: "نرخ مصرف ظرفیت",
            value: `${k.usage_rate}%`,
            subtitle: `Used: ${k.used_capacity}`,
            tone: k.usage_rate >= 95 ? "danger" : k.usage_rate >= 85 ? "warning" : "success",
        },
        {
            key: "occupancy_rate",
            title: "نرخ اشغال",
            value: `${k.occupancy_rate}%`,
            subtitle: `Occupied: ${k.occupied_capacity}`,
            tone: k.occupancy_rate >= 95 ? "danger" : k.occupancy_rate >= 85 ? "warning" : "info",
        },
        {
            key: "active_requests",
            title: "درخواست‌های فعال",
            value: k.active_requests,
            subtitle: `رزرو فعال: ${k.active_reservations}`,
            tone: "info",
        },
        {
            key: "total_halls",
            title: "سراهای فعال",
            value: k.enabled_halls,
            subtitle: `کل سراها: ${k.total_halls}`,
            tone: "neutral",
        },
    ];
}
