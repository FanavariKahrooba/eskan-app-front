// src/features/data-grid/hooks/use-column-layout.ts

'use client'

import { useMemo } from 'react'
import type { ColumnDef } from '../core/types'

export function useColumnLayout<TData>(
    columns: ColumnDef<TData>[],
    columnOrder: string[],
    columnSizing: Record<string, number>
) {
    return useMemo(() => {
        const visibleColumns = columns.filter((column) => !column.hidden)

        const map = new Map(visibleColumns.map((column) => [column.id, column]))

        const ordered =
            columnOrder.length > 0
                ? [
                    ...columnOrder.map((id) => map.get(id)).filter(Boolean),
                    ...visibleColumns.filter((column) => !columnOrder.includes(column.id)),
                ]
                : visibleColumns

        return ordered.map((column) => ({
            ...column!,
            width:
                columnSizing[column!.id] ??
                (typeof column!.width === 'number' ? column!.width : column!.width),
        }))
    }, [columns, columnOrder, columnSizing])
}
