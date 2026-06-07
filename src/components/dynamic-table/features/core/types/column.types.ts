// src/features/data-grid/core/types/column.types.ts

import type { ReactNode } from 'react'

export type ColumnType =
    | 'text'
    | 'number'
    | 'date'
    | 'datetime'
    | 'boolean'
    | 'select'
    | 'multiSelect'
    | 'badge'
    | 'image'
    | 'currency'
    | 'custom'

export type CellContext<TData = unknown, TValue = unknown> = {
    row: {
        id: string
        original: TData
        index: number
    }
    value: TValue
    column: ColumnDef<TData, TValue>
}

export type HeaderContext<TData = unknown> = {
    column: ColumnDef<TData>
}

export type ColumnDef<TData = unknown, TValue = unknown> = {
    id: string

    accessorKey?: keyof TData | string
    accessorFn?: (row: TData) => TValue

    header: string | ReactNode
    description?: string

    type?: ColumnType

    width?: number
    minWidth?: number
    maxWidth?: number

    sortable?: boolean
    searchable?: boolean
    filterable?: boolean
    draggable?: boolean
    resizable?: boolean

    hidden?: boolean
    enableHiding?: boolean

    className?: string
    headerClassName?: string
    cellClassName?: string

    meta?: Record<string, unknown>

    renderHeader?: (ctx: HeaderContext<TData>) => ReactNode
    renderCell?: (ctx: CellContext<TData, TValue>) => ReactNode
}
