// src/features/data-grid/core/utils/get-cell-value.ts

import type { ColumnDef } from '../types'

export function getCellValue<TData, TValue = unknown>(
    row: TData,
    column: ColumnDef<TData, TValue>
): TValue {
    if (column.accessorFn) {
        return column.accessorFn(row)
    }

    if (!column.accessorKey) {
        return undefined as TValue
    }

    const key = String(column.accessorKey)

    if (key.includes('.')) {
        return key.split('.').reduce<unknown>((acc, part) => {
            if (acc && typeof acc === 'object') {
                return (acc as Record<string, unknown>)[part]
            }

            return undefined
        }, row as unknown) as TValue
    }

    return (row as Record<string, unknown>)[key] as TValue
}
