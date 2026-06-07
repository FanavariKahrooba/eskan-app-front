import type {
    AggregationState,
    ColumnDef,
    FilterState,
    GroupingState,
    PaginationState,
    RowDetailsState,
    RowSelectionState,
    SortState,
} from '../../types';

import {
    applyAggregation,
    applyFilters,
    applyGrouping,
    applyPagination,
    applyRowExpansion,
    applyRowSelection,
    applySearch,
    applySorting,
} from '../pipeline';

import {
    deriveRowModel,
    type DerivedRow,
    type DerivedRowModel,
} from './derive-row-model';

export interface VisibleRowsModel<TRow = unknown> {
    rows: TRow[];
    searchedRows: TRow[];
    filteredRows: TRow[];
    sortedRows: TRow[];
    selectedRows: TRow[];
    expandedRows: TRow[];
    paginatedRows: TRow[];
    rowModel: DerivedRowModel<TRow>;
    derivedRows: Array<DerivedRow<TRow>>;
    totalRows: number;
    totalPages: number;
    groupedRows?: unknown[];
    aggregatedRows?: unknown[];
}

export interface DeriveVisibleRowsOptions<TRow = unknown> {
    rows: TRow[];
    columns: Array<ColumnDef<TRow>>;
    filter?: FilterState;
    sort?: SortState;
    pagination?: PaginationState;
    rowSelection?: RowSelectionState;
    rowDetails?: RowDetailsState;
    grouping?: GroupingState;
    aggregation?: AggregationState;
    getRowId?: (row: TRow, index: number) => string;
    isRowDisabled?: (row: TRow, index: number) => boolean;
}

export function deriveVisibleRows<TRow = unknown>(
    options: DeriveVisibleRowsOptions<TRow>,
): VisibleRowsModel<TRow> {
    const {
        rows,
        columns,
        filter,
        sort,
        pagination,
        rowSelection,
        rowDetails,
        grouping,
        aggregation,
        getRowId,
        isRowDisabled,
    } = options;

    const searchedRows = applySearch({
        rows,
        columns,
        search: filter?.search ?? '',
    });

    const filteredRows = applyFilters({
        rows: searchedRows,
        columns,
        filters: filter?.items ?? [],
    });

    const sortedRows = applySorting({
        rows: filteredRows,
        columns,
        sorting: sort?.items ?? [],
    });

    const rowSelectionResult = applyRowSelection({
        rows: sortedRows,
        selectedRowIds: rowSelection?.selectedRowIds ?? {},
        getRowId,
    });

    const selectedRows = rowSelectionResult.rows;

    const rowExpansionResult = applyRowExpansion({
        rows: selectedRows,
        expandedRowIds: rowDetails?.expandedRowIds ?? {},
        getRowId,
    });

    const expandedRows = rowExpansionResult.rows;

    let groupedRows: unknown[] | undefined;
    let aggregatedRows: unknown[] | undefined;

    if (grouping?.columnIds?.length) {
        groupedRows = applyGrouping({
            rows: expandedRows,
            columns,
            grouping,
        });

        if (aggregation?.items?.length) {
            aggregatedRows = applyAggregation({
                groupedRows,
                columns,
                aggregations: aggregation.items,
            });
        }
    }

    const paginationResult = applyPagination({
        rows: expandedRows,
        pagination: pagination ?? {
            page: 1,
            pageSize: expandedRows.length || 1,
        },
    });

    const paginatedRows = paginationResult.rows;

    const rowModel = deriveRowModel({
        rows: paginatedRows,
        columns,
        getRowId,
        rowSelection,
        isRowDisabled,
    });

    return {
        rows: paginatedRows,
        searchedRows,
        filteredRows,
        sortedRows,
        selectedRows,
        expandedRows,
        paginatedRows,
        rowModel,
        derivedRows: rowModel.rows,
        totalRows: expandedRows.length,
        totalPages: paginationResult.totalPages,
        groupedRows,
        aggregatedRows,
    };
}
