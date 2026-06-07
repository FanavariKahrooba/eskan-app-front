import { TableStoreState } from '../../store';
import type { ColumnOrderChangeParams } from './column-order-state';
import type { ColumnPinningChangeParams } from './column-pinning-state';
import type { ColumnSizingChangeParams } from './column-sizing-state';
import type { ColumnVisibilityChangeParams } from './column-visibility-state';
// import type { FilterChangeParams } from './filter-state';
import type {
    GroupingChangeParams,
} from './grouping-state';
import type { PaginationChangeParams } from './pagination-state';
import type { RowDndChangeParams } from './row-dnd-state';
import type { RowEditingChangeParams } from './row-editing-state';
import type { RowSelectionChangeParams } from './row-selection-state';
// import type { SortChangeParams } from './sort-state';

export interface DataGridRowEventContext<TRow = unknown> {
    row: TRow;
    rowId: string;
    rowIndex: number;
    event?: unknown;
}

export interface DataGridCellEventContext<TRow = unknown, TValue = unknown>
    extends DataGridRowEventContext<TRow> {
    columnId: string;
    value: TValue;
}

export interface DataGridColumnEventContext {
    columnId: string;
    event?: unknown;
}

export interface DataGridEvents<TRow = unknown> {
    onReady?: () => void;

    onStateChange?: (state: unknown) => void;

    // onSortChange?: (params: SortChangeParams) => void;
    // onFilterChange?: (params: FilterChangeParams) => void;
    onPaginationChange?: (params: PaginationChangeParams) => void;

    onColumnOrderChange?: (params: ColumnOrderChangeParams) => void;
    onColumnVisibilityChange?: (params: ColumnVisibilityChangeParams) => void;
    onColumnPinningChange?: (params: ColumnPinningChangeParams) => void;
    onColumnSizingChange?: (params: ColumnSizingChangeParams) => void;

    onRowSelectionChange?: (params: RowSelectionChangeParams) => void;
    onRowEditingChange?: (params: RowEditingChangeParams) => void;
    onRowDndChange?: (params: RowDndChangeParams) => void;

    onGroupingChange?: (params: GroupingChangeParams) => void;
    onAggregationChange?: any;

    onRowClick?: (context: DataGridRowEventContext<TRow>) => void;
    onRowDoubleClick?: (context: DataGridRowEventContext<TRow>) => void;
    onRowContextMenu?: (context: DataGridRowEventContext<TRow>) => void;

    onCellClick?: <TValue = unknown>(
        context: DataGridCellEventContext<TRow, TValue>,
    ) => void;

    onCellDoubleClick?: <TValue = unknown>(
        context: DataGridCellEventContext<TRow, TValue>,
    ) => void;

    onColumnHeaderClick?: (context: DataGridColumnEventContext) => void;

    onError?: (error: unknown) => void;
}


export interface DataGridEventMap {
    onSearchChange: (
        query: string,
        state: TableStoreState,
    ) => void;
    onSortingChange: (
        sortModel: TableStoreState['sorting']['sortModel'],
        state: TableStoreState,
    ) => void;
    onFiltersChange: (
        filters: TableStoreState['filters'],
        state: TableStoreState,
    ) => void;
    onPaginationChange: (
        pagination: TableStoreState['pagination'],
        state: TableStoreState,
    ) => void;
    onColumnVisibilityChange: (
        visibility: TableStoreState['columnVisibility'],
        state: TableStoreState,
    ) => void;
    onRowSelectionChange: (
        rowSelection: TableStoreState['rowSelection'],
        state: TableStoreState,
    ) => void;
    onRowExpansionChange: (
        rowExpansion: TableStoreState['rowExpansion'],
        state: TableStoreState,
    ) => void;
    onToolbarChange: (
        toolbar: TableStoreState['toolbar'],
        state: TableStoreState,
    ) => void;
}


export interface DataGridServerQuery {
    search: string;
    sorting: TableStoreState['sorting']['sortModel'];
    filters: TableStoreState['filters'];
    pagination: TableStoreState['pagination'];
}

export interface DataGridServerResult<TRow = unknown> {
    rows: TRow[];
    total: number;
}

export interface DataGridServerAdapter<TRow = unknown> {
    fetchRows: (
        query: DataGridServerQuery,
        instance: any,
    ) => Promise<DataGridServerResult<TRow>>;
}