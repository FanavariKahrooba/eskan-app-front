export const deepGet = <TValue = unknown>(
    source: unknown,
    path: string | string[],
    fallback?: TValue,
): TValue | undefined => {
    if (!source || typeof source !== 'object') {
        return fallback;
    }

    const segments = Array.isArray(path) ? path : path.split('.').filter(Boolean);

    if (!segments.length) {
        return fallback;
    }

    let current: unknown = source;

    for (const segment of segments) {
        if (!current || typeof current !== 'object') {
            return fallback;
        }

        current = (current as Record<string, unknown>)[segment];
    }

    return (current as TValue | undefined) ?? fallback;
};
