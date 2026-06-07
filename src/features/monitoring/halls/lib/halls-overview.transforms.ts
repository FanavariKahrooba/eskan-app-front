import { HallsOverviewData } from "../types/halls-overview.types";

export const hallStatusColors: Record<string, string> = {
    active: "#22c55e",
    inactive: "#ef4444",
    pending: "#f59e0b",
    disabled: "#64748b",
    "فعال": "#22c55e",
    "غیرفعال": "#ef4444",
    unknown: "#94a3b8",
};

export function buildHallKpis(data: HallsOverviewData) {
    const k = data.kpis;

    return [
        {
            key: "total_halls",
            title: "کل سراها",
            value: k.total_halls,
            subtitle: `فعال: ${k.active_halls} / غیرفعال: ${k.inactive_halls}`,
            tone: "info" as const,
        },
        {
            key: "halls_with_info",
            title: "دارای اطلاعات تکمیلی",
            value: k.halls_with_info,
            subtitle: `فاقد اطلاعات: ${k.halls_without_info}`,
            tone: k.halls_without_info > 0 ? ("warning" as const) : ("success" as const),
        },
        {
            key: "geo_quality",
            title: "دارای مختصات",
            value: k.halls_with_geo,
            subtitle: `مختصات ناقص: ${k.halls_with_missing_geo}`,
            tone: k.halls_with_missing_geo > 0 ? ("warning" as const) : ("success" as const),
        },
        {
            key: "contact_quality",
            title: "دارای اطلاعات تماس",
            value: k.halls_with_contact,
            subtitle: `تماس ناقص: ${k.halls_with_missing_contact}`,
            tone: k.halls_with_missing_contact > 0 ? ("warning" as const) : ("success" as const),
        },
        {
            key: "shelter_enabled_halls",
            title: "سراهای دارای اسکان",
            value: k.shelter_enabled_halls,
            subtitle: `پروفایل اسکان: ${k.halls_with_profile}`,
            tone: "purple" as const,
        },
        {
            key: "capacity",
            title: "ظرفیت خالی اسکان",
            value: k.available_capacity,
            subtitle: `قابل استفاده: ${k.usable_capacity}`,
            tone: k.available_capacity <= 20 ? ("danger" as const) : ("success" as const),
        },
        {
            key: "critical_halls",
            title: "سراهای بحرانی",
            value: k.critical_halls,
            subtitle: `میانگین مصرف: ${k.average_usage_rate}%`,
            tone: k.critical_halls > 0 ? ("danger" as const) : ("success" as const),
        },
        {
            key: "programs",
            title: "سراهای دارای برنامه فعال",
            value: k.halls_with_programs,
            subtitle: `بدون مدیر: ${k.halls_without_manager}`,
            tone: k.halls_without_manager > 0 ? ("warning" as const) : ("info" as const),
        },
    ];
}
