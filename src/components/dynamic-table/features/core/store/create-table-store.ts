'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SortState } from '../types/datasource.types'


export type ColumnVisibilityState = Record<string, boolean>
export type ColumnSizingState = Record<string, number>

export type TableStoreState = {
    hydrated: boolean

    search: string
    sorting: SortState[]

    page: number
    pageSize: number

    columnOrder: string[]
    columnSizing: ColumnSizingState
    columnVisibility: ColumnVisibilityState

    setHydrated: (value: boolean) => void

    setSearch: (value: string) => void
    setSorting: (value: SortState[]) => void

    setPage: (value: number) => void
    setPageSize: (value: number) => void

    setColumnOrder: (value: string[]) => void
    setColumnSizing: (value: ColumnSizingState) => void
    setColumnWidth: (columnId: string, width: number) => void

    setColumnVisibility: (value: ColumnVisibilityState) => void
    setColumnVisible: (columnId: string, visible: boolean) => void
    toggleColumnVisibility: (columnId: string) => void

    resetLayout: () => void
    resetFilters: () => void
    resetPagination: () => void
    resetTableState: () => void
}

type CreateTableStoreOptions = {
    storageKey?: string
    persistEnabled?: boolean
    defaultPageSize?: number
}

const storeRegistry = new Map<
    string,
    ReturnType<typeof create<TableStoreState>>
>()

export function createTableStore(
    tableId: string,
    options?: CreateTableStoreOptions
) {
    const storageKey = options?.storageKey ?? `data-grid:${tableId}`
    const persistEnabled = options?.persistEnabled ?? true
    const defaultPageSize = options?.defaultPageSize ?? 10

    if (storeRegistry.has(storageKey)) {
        return storeRegistry.get(storageKey)!
    }

    const initializer = (set: any, get: any): TableStoreState => ({
        hydrated: false,

        search: '',
        sorting: [],

        page: 1,
        pageSize: defaultPageSize,

        columnOrder: [],
        columnSizing: {},
        columnVisibility: {},

        setHydrated: (value) => set({ hydrated: value }),

        setSearch: (value) =>
            set({
                search: value,
                page: 1,
            }),

        setSorting: (value) =>
            set({
                sorting: value,
                page: 1,
            }),

        setPage: (value) =>
            set({
                page: Math.max(1, value),
            }),

        setPageSize: (value) =>
            set({
                pageSize: Math.max(1, value),
                page: 1,
            }),

        setColumnOrder: (value) =>
            set({
                columnOrder: value,
            }),

        setColumnSizing: (value) =>
            set({
                columnSizing: value,
            }),

        setColumnWidth: (columnId, width) =>
            set({
                columnSizing: {
                    ...get().columnSizing,
                    [columnId]: width,
                },
            }),

        setColumnVisibility: (value) =>
            set({
                columnVisibility: value,
            }),

        setColumnVisible: (columnId, visible) =>
            set({
                columnVisibility: {
                    ...get().columnVisibility,
                    [columnId]: visible,
                },
            }),

        toggleColumnVisibility: (columnId) =>
            set({
                columnVisibility: {
                    ...get().columnVisibility,
                    [columnId]: !(get().columnVisibility[columnId] ?? true),
                },
            }),

        resetLayout: () =>
            set({
                columnOrder: [],
                columnSizing: {},
                columnVisibility: {},
            }),

        resetFilters: () =>
            set({
                search: '',
                sorting: [],
                page: 1,
            }),

        resetPagination: () =>
            set({
                page: 1,
                pageSize: defaultPageSize,
            }),

        resetTableState: () =>
            set({
                search: '',
                sorting: [],

                page: 1,
                pageSize: defaultPageSize,

                columnOrder: [],
                columnSizing: {},
                columnVisibility: {},
            }),
    })

    const store = persistEnabled
        ? create<TableStoreState>()(
            persist(initializer, {
                name: storageKey,
                storage:
                    typeof window !== 'undefined'
                        ? createJSONStorage(() => localStorage)
                        : undefined,
                partialize: (state) => ({
                    search: state.search,
                    sorting: state.sorting,
                    page: state.page,
                    pageSize: state.pageSize,
                    columnOrder: state.columnOrder,
                    columnSizing: state.columnSizing,
                    columnVisibility: state.columnVisibility,
                }),
                onRehydrateStorage: () => (state) => {
                    state?.setHydrated(true)
                },
            })
        )
        : create<TableStoreState>()((set, get) => ({
            ...initializer(set, get),
            hydrated: true,
        }))

    storeRegistry.set(storageKey, store)

    return store
}
