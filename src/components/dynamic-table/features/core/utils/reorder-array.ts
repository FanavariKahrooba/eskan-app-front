// src/features/data-grid/core/utils/reorder-array.ts

export function reorderArray<T>(
    items: T[],
    fromIndex: number,
    toIndex: number
): T[] {
    const result = [...items]
    const [removed] = result.splice(fromIndex, 1)
    result.splice(toIndex, 0, removed)

    return result
}
