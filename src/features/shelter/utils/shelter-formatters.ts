import type {
    ShelterRequestStatus,
    ShelterReservationStatus,
    ShelterSpaceType,
    ShelterStatus,
} from "../types/shelter-types";

export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function toPersianDigits(value: string | number) {
    return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export function formatDate(dateIso?: string) {
    if (!dateIso) return "—";

    try {
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date(dateIso));
    } catch {
        return "—";
    }
}

export function formatRelative(dateIso?: string) {
    if (!dateIso) return "—";

    const diff = Date.now() - new Date(dateIso).getTime();
    const mins = Math.max(0, Math.floor(diff / 60000));

    if (mins < 1) return "همین حالا";
    if (mins < 60) return `${toPersianDigits(mins)} دقیقه پیش`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;

    const days = Math.floor(hours / 24);
    return `${toPersianDigits(days)} روز پیش`;
}

export function getShelterStatusMeta(status?: ShelterStatus) {
    switch (status) {
        case "active":
            return {
                label: "فعال",
                className:
                    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
            };

        case "maintenance":
            return {
                label: "در حال تعمیر",
                className:
                    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
            };

        case "inactive":
        default:
            return {
                label: "غیرفعال",
                className:
                    "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
            };
    }
}

export function getSpaceTypeLabel(type?: ShelterSpaceType) {
    switch (type) {
        case "room":
            return "اتاق";
        case "hall":
            return "سالن";
        case "bed":
            return "تخت";
        case "family_room":
            return "اتاق خانوادگی";
        case "emergency":
            return "اضطراری";
        default:
            return "—";
    }
}

export function getRequestStatusMeta(status?: ShelterRequestStatus) {
    switch (status) {
        case "pending":
            return {
                label: "در انتظار بررسی",
                className:
                    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
            };

        case "approved":
            return {
                label: "تأیید شده",
                className:
                    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
            };

        case "rejected":
            return {
                label: "رد شده",
                className:
                    "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
            };

        case "reserved":
            return {
                label: "رزرو شده",
                className:
                    "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
            };

        case "cancelled":
        default:
            return {
                label: "لغو شده",
                className:
                    "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
            };
    }
}

export function getReservationStatusMeta(status?: ShelterReservationStatus) {
    switch (status) {
        case "reserved":
            return {
                label: "رزرو شده",
                className:
                    "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
            };

        case "checked_in":
            return {
                label: "پذیرش شده",
                className:
                    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
            };

        case "checked_out":
            return {
                label: "خروج ثبت شده",
                className:
                    "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
            };

        case "expired":
            return {
                label: "منقضی شده",
                className:
                    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
            };

        case "cancelled":
        default:
            return {
                label: "لغو شده",
                className:
                    "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
            };
    }
}
