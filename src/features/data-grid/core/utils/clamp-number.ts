export const clampNumber = (value: number, min: number, max: number): number => {
    if (Number.isNaN(value)) {
        return min;
    }

    return Math.min(Math.max(value, min), max);
};
