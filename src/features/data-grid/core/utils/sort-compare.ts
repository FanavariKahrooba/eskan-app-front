export interface SortCompareOptions {
    direction?: 'asc' | 'desc';
    nulls?: 'first' | 'last';
    locale?: string;
    numeric?: boolean;
    sensitivity?: Intl.CollatorOptions['sensitivity'];
}

const isNil = (value: unknown): value is null | undefined => {
    return value === null || value === undefined;
};

const toDateNumber = (value: unknown): number | undefined => {
    if (value instanceof Date) {
        const time = value.getTime();
        return Number.isNaN(time) ? undefined : time;
    }

    if (typeof value === 'string') {
        const time = Date.parse(value);
        return Number.isNaN(time) ? undefined : time;
    }

    return undefined;
};

export const sortCompare = (
    left: unknown,
    right: unknown,
    options?: SortCompareOptions,
): number => {
    const direction = options?.direction ?? 'asc';
    const nulls = options?.nulls ?? 'last';

    let result = 0;

    if (isNil(left) && isNil(right)) {
        result = 0;
    } else if (isNil(left)) {
        result = nulls === 'first' ? -1 : 1;
    } else if (isNil(right)) {
        result = nulls === 'first' ? 1 : -1;
    } else if (typeof left === 'number' && typeof right === 'number') {
        result = left - right;
    } else if (typeof left === 'boolean' && typeof right === 'boolean') {
        result = Number(left) - Number(right);
    } else {
        const leftDate = toDateNumber(left);
        const rightDate = toDateNumber(right);

        if (leftDate !== undefined && rightDate !== undefined) {
            result = leftDate - rightDate;
        } else {
            result = String(left).localeCompare(String(right), options?.locale, {
                numeric: options?.numeric ?? true,
                sensitivity: options?.sensitivity ?? 'base',
            });
        }
    }

    return direction === 'desc' ? -result : result;
};
