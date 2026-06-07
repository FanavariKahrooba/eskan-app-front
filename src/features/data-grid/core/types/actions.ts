import type { ColumnOrderState } from './column-order-state';
import type { ColumnPinningState } from './column-pinning-state';
import type { ColumnSizingState } from './column-sizing-state';
import type { ColumnVisibilityState } from './column-visibility-state';
import type { FilterState } from './filter-state';
import type { GroupingState } from './grouping-state';
import type { PaginationState } from './pagination-state';
import type { RowDndState } from './row-dnd-state';
import type { RowEditingState } from './row-editing-state';
import type { RowSelectionState } from './row-selection-state';
import type { SortState } from './sort-state';

export type DataGridAction =
    | {
        type: 'grid/reset';
    }
    | {
        type: 'grid/set-loading';
        payload: boolean;
    }
    | {
        type: 'grid/set-error';
        payload: unknown;
    }
    | {
        type: 'grid/set-density';
        payload: 'compact' | 'standard' | 'comfortable';
    }
    | {
        type: 'sorting/set';
        payload: SortState;
    }
    | {
        type: 'sorting/clear';
    }
    | {
        type: 'filtering/set';
        payload: FilterState;
    }
    | {
        type: 'filtering/clear';
        payload?: {
            columnId?: string;
        };
    }
    | {
        type: 'search/set';
        payload: any;
    }
    | {
        type: 'pagination/set';
        payload: PaginationState;
    }
    | {
        type: 'pagination/set-page-index';
        payload: number;
    }
    | {
        type: 'pagination/set-page-size';
        payload: number;
    }
    | {
        type: 'columns/order/set';
        payload: ColumnOrderState;
    }
    | {
        type: 'columns/visibility/set';
        payload: ColumnVisibilityState;
    }
    | {
        type: 'columns/pinning/set';
        payload: ColumnPinningState;
    }
    | {
        type: 'columns/sizing/set';
        payload: ColumnSizingState;
    }
    | {
        type: 'selection/set';
        payload: RowSelectionState;
    }
    | {
        type: 'selection/clear';
    }
    | {
        type: 'editing/set';
        payload: RowEditingState;
    }
    | {
        type: 'editing/reset';
    }
    | {
        type: 'row-dnd/set';
        payload: RowDndState;
    }
    | {
        type: 'row-dnd/reset';
    }
    | {
        type: 'grouping/set';
        payload: GroupingState;
    }
    | {
        type: 'state/patch';
        payload: Record<string, unknown>;
    };
