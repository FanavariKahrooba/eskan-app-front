import {
    ShelterMonitoringAlert,
    ShelterMonitoringDashboardResponse,
} from "../types/shelter-monitoring.types";

function nowIso() {
    return new Date().toISOString();
}

function getChartValue(
    map: Record<string, number> | undefined,
    keys: string[]
): number {
    if (!map) return 0;

    return keys.reduce((sum, key) => {
        return sum + Number(map[key] ?? 0);
    }, 0);
}

export function buildShelterMonitoringAlerts(
    dashboard: ShelterMonitoringDashboardResponse
): ShelterMonitoringAlert[] {
    const alerts: ShelterMonitoringAlert[] = [];

    const occupancy = Number(dashboard.capacity.occupancy_percent ?? 0);
    const available = Number(dashboard.capacity.available ?? 0);
    const emergency = Number(dashboard.capacity.emergency ?? 0);
    const activeShelters = Number(dashboard.summary.active_shelters_count ?? 0);
    const enabledShelters = Number(dashboard.summary.enabled_shelters_count ?? 0);

    const urgentRequests = getChartValue(dashboard.charts.requests_by_priority, [
        "urgent",
        "emergency",
        "فوری",
    ]);

    const pendingRequests = getChartValue(dashboard.charts.requests_by_status, [
        "pending",
        "waiting",
        "در انتظار بررسی",
    ]);

    if (occupancy >= 95) {
        alerts.push({
            id: "critical-occupancy",
            title: "اشغال بحرانی ظرفیت",
            description:
                "نرخ اشغال ظرفیت از ۹۵٪ عبور کرده است. نیاز به بررسی فوری ظرفیت‌های جایگزین وجود دارد.",
            severity: "danger",
            metric: `${occupancy}%`,
            createdAt: nowIso(),
        });
    } else if (occupancy >= 85) {
        alerts.push({
            id: "high-occupancy",
            title: "اشغال بالا",
            description:
                "نرخ اشغال ظرفیت بالا است و ممکن است در پذیرش درخواست‌های جدید محدودیت ایجاد شود.",
            severity: "warning",
            metric: `${occupancy}%`,
            createdAt: nowIso(),
        });
    }

    if (available <= 0) {
        alerts.push({
            id: "no-available-capacity",
            title: "عدم وجود ظرفیت خالی",
            description:
                "هیچ ظرفیت خالی عملیاتی برای پذیرش جدید وجود ندارد.",
            severity: "danger",
            metric: available,
            createdAt: nowIso(),
        });
    } else if (available <= 5) {
        alerts.push({
            id: "low-available-capacity",
            title: "کاهش ظرفیت خالی",
            description:
                "ظرفیت خالی بسیار محدود شده است و بهتر است وضعیت سراها بازبینی شود.",
            severity: "warning",
            metric: available,
            createdAt: nowIso(),
        });
    }

    if (emergency <= 0) {
        alerts.push({
            id: "no-emergency-capacity",
            title: "ظرفیت اضطراری موجود نیست",
            description:
                "برای شرایط اضطراری، ظرفیت اختصاصی فعالی وجود ندارد.",
            severity: "danger",
            metric: emergency,
            createdAt: nowIso(),
        });
    }

    if (urgentRequests > 0) {
        alerts.push({
            id: "urgent-requests",
            title: "درخواست فوری فعال",
            description:
                "درخواست‌های فوری در صف بررسی وجود دارد و باید در اولویت پیگیری قرار گیرد.",
            severity: "danger",
            metric: urgentRequests,
            createdAt: nowIso(),
        });
    }

    if (pendingRequests >= 10) {
        alerts.push({
            id: "high-pending-requests",
            title: "انباشت درخواست‌های در انتظار",
            description:
                "تعداد درخواست‌های در انتظار بررسی بالا است و ممکن است باعث تأخیر عملیاتی شود.",
            severity: "warning",
            metric: pendingRequests,
            createdAt: nowIso(),
        });
    }

    if (enabledShelters > 0 && activeShelters === 0) {
        alerts.push({
            id: "no-active-shelters",
            title: "هیچ سرای فعالی وجود ندارد",
            description:
                "با وجود سراهای فعال‌شده، هیچ سرای عملیاتی فعالی گزارش نشده است.",
            severity: "danger",
            metric: activeShelters,
            createdAt: nowIso(),
        });
    }

    if (alerts.length === 0) {
        alerts.push({
            id: "all-normal",
            title: "وضعیت پایدار",
            description:
                "در حال حاضر هشدار عملیاتی مهمی در سامانه اسکان شناسایی نشده است.",
            severity: "success",
            createdAt: nowIso(),
        });
    }

    return alerts;
}
