// src/features/data-grid/core/engine/pipeline.ts

import type { ColumnDef, SortState } from '../types'
import { applyPagination } from './apply-pagination'
import { applySearch } from './apply-search'
import { applySorting } from './apply-sorting'

type BuildPipelineParams<TData> = {
    rows: TData[]
    columns: ColumnDef<TData>[]
    search?: string
    sorting?: SortState[]
    page: number
    pageSize: number
    enableSearch?: boolean
    enableSorting?: boolean
    enablePagination?: boolean
}

export function buildPipeline<TData>({
    rows,
    columns,
    search,
    sorting,
    page,
    pageSize,
    enableSearch = true,
    enableSorting = true,
    enablePagination = true,
}: BuildPipelineParams<TData>) {
    const searchedRows = enableSearch
        ? applySearch(rows, columns, search)
        : rows

    const sortedRows = enableSorting
        ? applySorting(searchedRows, columns, sorting)
        : searchedRows

    const paginatedRows = enablePagination
        ? applyPagination(sortedRows, page, pageSize)
        : sortedRows

    return {
        searchedRows,
        sortedRows,
        paginatedRows,
        total: sortedRows.length,
    }
}
