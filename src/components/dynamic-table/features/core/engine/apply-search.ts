// src/features/data-grid/core/engine/apply-search.ts

import type { ColumnDef } from '../types'
import { getCellValue } from '../utils/get-cell-value'

export function applySearch<TData>(
    rows: TData[],
    columns: ColumnDef<TData>[],
    query?: string
): TData[] {
    if (!query?.trim()) return rows

    const normalizedQuery = query.toLowerCase().trim()
    const searchableColumns = columns.filter(
        (column) => column.searchable !== false
    )

    if (searchableColumns.length === 0) return rows

    return rows.filter((row) =>
        searchableColumns.some((column) => {
            const value = getCellValue(row, column)
            return String(value ?? '').toLowerCase().includes(normalizedQuery)
        })
    )
}
