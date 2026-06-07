// src/features/data-grid/core/engine/apply-pagination.ts

export function applyPagination<TData>(
    rows: TData[],
    page: number,
    pageSize: number
): TData[] {
    const safePage = Math.max(1, page)
    const safePageSize = Math.max(1, pageSize)

    const start = (safePage - 1) * safePageSize
    const end = start + safePageSize

    return rows.slice(start, end)
}
