export const reorderArray = <T>(
    items: T[],
    fromIndex: number,
    toIndex: number,
): T[] => {
    if (fromIndex === toIndex) {
        return [...items];
    }

    if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= items.length ||
        toIndex >= items.length
    ) {
        return [...items];
    }

    const result = [...items];
    const [moved] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, moved);

    return result;
};
