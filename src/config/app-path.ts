export const APP_BASE_PATH = "/console";

export function isExternalPath(value: string) {
    return value.startsWith("http://") || value.startsWith("https://");
}

export function withBasePath(value = "") {
    if (!value) return APP_BASE_PATH;

    if (isExternalPath(value)) {
        return value;
    }

    const normalized = value.startsWith("/") ? value : `/${value}`;

    if (normalized === "/") {
        return APP_BASE_PATH;
    }

    if (
        normalized === APP_BASE_PATH ||
        normalized.startsWith(`${APP_BASE_PATH}/`)
    ) {
        return normalized;
    }

    return `${APP_BASE_PATH}${normalized}`;
}

export function removeBasePath(value = "") {
    if (!value) return "";

    if (isExternalPath(value)) {
        return value;
    }

    const normalized = value.startsWith("/") ? value : `/${value}`;

    if (normalized === APP_BASE_PATH) {
        return "/";
    }

    if (normalized.startsWith(`${APP_BASE_PATH}/`)) {
        return normalized.slice(APP_BASE_PATH.length) || "/";
    }

    return normalized;
}
