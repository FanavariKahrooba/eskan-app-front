export const safeStringify = (
    value: unknown,
    space: number = 2,
    fallback = '',
): string => {
    try {
        return JSON.stringify(value, null, space) ?? fallback;
    } catch {
        return fallback;
    }
};
