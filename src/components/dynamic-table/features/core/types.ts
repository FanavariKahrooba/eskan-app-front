// src/features/data-grid/core/types.ts

import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

export type SortState = {
    field: string
    direction: SortDirection
}

export type PaginationState = {
    page: number
    pageSize: number
}

export type RowKey<TData> = keyof TData | ((row: TData, index: number) => string)

export type ColumnDef<TData> = {
    id: string
    header: ReactNode
    accessorKey?: keyof TData
    accessorFn?: (row: TData) => unknown

    width?: number | string
    minWidth?: number
    maxWidth?: number

    hidden?: boolean
    searchable?: boolean
    sortable?: boolean

    resizable?: boolean
    reorderable?: boolean

    headerClassName?: string
    cellClassName?: string

    renderHeader?: (context: { column: ColumnDef<TData> }) => ReactNode
    renderCell?: (context: {
        row: {
            id: string
            original: TData
            index: number
        }
        value: unknown
        column: ColumnDef<TData>
    }) => ReactNode
}

export type LoadParams = {
    page: number
    pageSize: number
    search?: string
    sort?: SortState[]
}

export type LoadResult<TData> = {
    rows: TData[]
    total?: number
}

export interface DataAdapter<TData> {
    load(params: LoadParams): Promise<LoadResult<TData>>
}

export type TableFeatures = {
    search?: boolean
    sorting?: boolean
    pagination?: boolean
    columnResize?: boolean
    columnReorder?: boolean
}

export type TableInitialState = {
    search?: string
    sorting?: SortState[]
    pagination?: PaginationState
    columnOrder?: string[]
    columnSizing?: Record<string, number>
}

export type DataGridConfig<TData> = {
    id?: string
    columns: ColumnDef<TData>[]
    dataSource: TData[] | DataAdapter<TData>
    rowKey: RowKey<TData>
    mode?: 'client' | 'server'
    features?: TableFeatures
    initialState?: TableInitialState
    pagination?: {
        pageSize?: number
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
        body?: string
    }
    events?: {
        onRowClick?: (row: TData) => void
        onRowsLoaded?: (rows: TData[]) => void
        onError?: (error: Error) => void
    }
}
