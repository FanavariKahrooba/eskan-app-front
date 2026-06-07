import type { SortState } from './sort-state';
import type { FilterState } from './filter-state';
import type { PaginationState } from './pagination-state';
import type { ColumnOrderState } from './column-order-state';
import type { ColumnVisibilityState } from './column-visibility-state';
import type { ColumnPinningState } from './column-pinning-state';
import type { ColumnSizingInfo, ColumnSizingState } from './column-sizing-state';
import type { RowSelectionState } from './row-selection-state';
import type { RowEditingState } from './row-editing-state';
import type { RowDndState } from './row-dnd-state';
import type { RowDetailsState } from './row-details';
import type { GroupingState } from './grouping-state';
import type { AggregationState } from './aggregation-state';

import { DEFAULT_SORT_STATE } from './sort-state';
import { DEFAULT_FILTER_STATE } from './filter-state';
import { DEFAULT_PAGINATION_STATE } from './pagination-state';
import { DEFAULT_COLUMN_ORDER_STATE } from './column-order-state';
import { DEFAULT_COLUMN_VISIBILITY_STATE } from './column-visibility-state';
import { DEFAULT_COLUMN_PINNING_STATE } from './column-pinning-state';
import { DEFAULT_ROW_SELECTION_STATE } from './row-selection-state';
import { DEFAULT_ROW_DETAILS_STATE } from './row-details';
import { DEFAULT_GROUPING_STATE } from './grouping-state';
import { DEFAULT_AGGREGATION_STATE } from './aggregation-state';
import { DataGridDensity } from './data-grid-mode';

export interface DataGridState {
    loading: boolean;
    error?: unknown;

    density: DataGridDensity;

    sort: SortState;
    filter: FilterState;
    search?: unknown;

    pagination: PaginationState;

    columnOrder: ColumnOrderState;
    columnVisibility: ColumnVisibilityState;
    columnPinning: ColumnPinningState;
    columnSizing: ColumnSizingState;
    columnSizingInfo?: ColumnSizingInfo;

    rowSelection: RowSelectionState;
    rowEditing: RowEditingState;
    rowDnd: RowDndState;
    rowDetails: RowDetailsState;

    grouping: GroupingState;
    aggregation: AggregationState;

    expandedRows: Record<string, boolean>;

    meta?: Record<string, unknown>;
}

export type DataGridStateKey = keyof DataGridState;

export type DataGridStateSlice<TKey extends DataGridStateKey> =
    DataGridState[TKey];

export type DataGridPartialState = Partial<DataGridState>;

export interface DataGridInitialState extends DataGridPartialState { }

export const DEFAULT_DATA_GRID_STATE: DataGridState = {
    loading: false,
    error: undefined,

    density: 'standard',

    sort: DEFAULT_SORT_STATE,
    filter: DEFAULT_FILTER_STATE,
    search: undefined,

    pagination: DEFAULT_PAGINATION_STATE,

    columnOrder: DEFAULT_COLUMN_ORDER_STATE,
    columnVisibility: DEFAULT_COLUMN_VISIBILITY_STATE,
    columnPinning: DEFAULT_COLUMN_PINNING_STATE,
    columnSizing: {
        sizes: {},
    },
    columnSizingInfo: undefined,

    rowSelection: DEFAULT_ROW_SELECTION_STATE,

    rowEditing: {
        editingRowIds: [],
        mode: 'view',
        drafts: {},
    },

    rowDnd: {},

    rowDetails: DEFAULT_ROW_DETAILS_STATE,

    grouping: DEFAULT_GROUPING_STATE,
    aggregation: DEFAULT_AGGREGATION_STATE,

    expandedRows: {},

    meta: undefined,
};
