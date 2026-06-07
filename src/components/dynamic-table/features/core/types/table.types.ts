// src/features/data-grid/core/types/table.types.ts

import type { ColumnDef } from './column.types'
import type { DataAdapter } from './datasource.types'
import type { PaginationState } from './pagination.types'

export type RowKey<TData> = keyof TData | ((row: TData) => string)

export type DataGridMode = 'client' | 'server'

export type DataGridFeatures = {
    search?: boolean
    sorting?: boolean
    filtering?: boolean
    pagination?: boolean
    selection?: boolean
    columnVisibility?: boolean
    columnDnD?: boolean
    rowDnD?: boolean
    columnResize?: boolean
    columnPinning?: boolean
    virtualization?: boolean
    export?: boolean
    urlSync?: boolean
}

export type DataGridConfig<TData = unknown> = {
    id: string
    columns: ColumnDef<TData>[]
    dataSource: DataAdapter<TData> | TData[]
    rowKey: RowKey<TData>
    mode?: DataGridMode

    features?: DataGridFeatures

    initialState?: {
        search?: string
        pagination?: Partial<PaginationState>
    }

    pagination?: {
        pageSize?: number
        pageSizeOptions?: number[]
    }

    search?: {
        placeholder?: string
    }

    className?: string

    classNames?: {
        root?: string
        toolbar?: string
        table?: string
        header?: string
        row?: string
        cell?: string
    }

    events?: {
        onRowClick?: (row: TData) => void
        onRowsLoaded?: (rows: TData[]) => void
        onError?: (error: Error) => void
    }
}
