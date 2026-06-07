import clsx, { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function makeId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random()}`;
}

export function formatRelativeDate(input?: string | null) {
    if (!input) return "بدون تاریخ";

    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return "نامشخص";

    return new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
}
