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

import type { ApplyAggregationResult } from '../pipeline/apply-aggregation';
import type { ApplyGroupingResult } from '../pipeline/apply-grouping';

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
    groupedRows?: ApplyGroupingResult<TRow>;
    aggregatedRows?: ApplyAggregationResult<TRow>;
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
        filterState: filter,
    });

    const filteredRows = applyFilters({
        rows: searchedRows,
        columns,
        filterState: filter,
    });

    const sortedRows = applySorting({
        rows: filteredRows,
        columns,
        sortState: sort,
    });

    const rowSelectionResult = applyRowSelection({
        rows: sortedRows,
        rowSelectionState: rowSelection,
        getRowId,
    });

    const selectedRows = rowSelectionResult.selectedRows;

    const rowExpansionResult = applyRowExpansion({
        rows: selectedRows,
        rowDetailsState: rowDetails,
        getRowId,
    });

    const expandedRows = rowExpansionResult.rows.map((item) => item.row);

    let groupedRows: ApplyGroupingResult<TRow> | undefined;
    let aggregatedRows: ApplyAggregationResult<TRow> | undefined;

    if (grouping?.columnIds?.length) {
        groupedRows = applyGrouping({
            rows: expandedRows,
            columns,
            groupingState: grouping,
        });

        if (aggregation?.items?.length) {
            aggregatedRows = applyAggregation({
                groupedRows: groupedRows.rows,
                columns,
                aggregations: aggregation.items,
            });
        }
    }

    const paginationResult = applyPagination({
        rows: expandedRows,
        paginationState: pagination ?? {
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
        totalPages: paginationResult.pageCount,
        groupedRows,
        aggregatedRows,
    };
}
