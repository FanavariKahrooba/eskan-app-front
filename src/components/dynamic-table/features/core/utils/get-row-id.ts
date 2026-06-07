// src/features/data-grid/core/utils/get-row-id.ts

import type { RowKey } from '../types'

export function getRowId<TData>(
    row: TData,
    rowKey: RowKey<TData>,
    index?: number
): string {
    if (typeof rowKey === 'function') {
        return String(rowKey(row))
    }

    const value = row[rowKey]

    if (value === undefined || value === null) {
        return String(index ?? crypto.randomUUID())
    }

    return String(value)
}
