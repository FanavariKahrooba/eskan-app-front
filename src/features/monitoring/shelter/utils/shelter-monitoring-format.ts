export function formatNumber(value: number | string | null | undefined) {
    const numeric = Number(value ?? 0);

    try {
        return new Intl.NumberFormat("fa-IR").format(numeric);
    } catch {
        return String(numeric);
    }
}

export function formatPercent(value: number | string | null | undefined) {
    const numeric = Number(value ?? 0);

    try {
        return `${new Intl.NumberFormat("fa-IR", {
            maximumFractionDigits: 1,
        }).format(numeric)}٪`;
    } catch {
        return `${numeric}%`;
    }
}

export function formatDateTimeFa(value?: string | null) {
    if (!value) return "نامشخص";

    try {
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

export function labelizeShelterStatus(status?: string | null) {
    switch (status) {
        case "pending":
            return "در انتظار بررسی";
        case "approved":
            return "تأیید شده";
        case "rejected":
            return "رد شده";
        case "cancelled":
            return "لغو شده";
        case "completed":
            return "تکمیل شده";
        case "active":
            return "فعال";
        default:
            return status || "نامشخص";
    }
}

export function labelizePriority(priority?: string | null) {
    switch (priority) {
        case "urgent":
            return "فوری";
        case "high":
            return "بالا";
        case "normal":
            return "عادی";
        case "low":
            return "پایین";
        default:
            return priority || "نامشخص";
    }
}

export function labelizeRequestType(type?: string | null) {
    switch (type) {
        case "temporary":
            return "اسکان موقت";
        case "emergency":
            return "اسکان اضطراری";
        case "normal":
            return "عادی";
        default:
            return type || "نامشخص";
    }
}
