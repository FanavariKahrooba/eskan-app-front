export function toPersianDigits(value: string | number | null | undefined) {
    if (value === null || value === undefined) return "—";

    return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export function formatDate(value?: string | null) {
    if (!value) return "—";

    try {
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date(value));
    } catch {
        return "—";
    }
}

export function yesNo(value?: boolean | number | string | null) {
    if (value === true || value === 1 || value === "1") return "بله";
    if (value === false || value === 0 || value === "0") return "خیر";
    return "—";
}

export function formatEmploymentType(value?: string | null) {
    if (value === "full_time") return "تمام‌وقت";
    if (value === "part_time") return "پاره‌وقت";
    return "—";
}

export function getUserName(user?: { name?: string | null; first_name?: string | null; last_name?: string | null } | null) {
    if (!user) return "—";
    if (user.name) return user.name;

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
    return fullName || "—";
}

export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}
