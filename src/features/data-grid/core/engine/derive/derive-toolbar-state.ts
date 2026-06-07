import type {
    ColumnDef,
    ColumnVisibilityState,
    FilterState,
    GroupingState,
    RowSelectionState,
    SortState,
} from '../../types';

import { getColumnId } from '../../utils';

export interface DerivedToolbarState {
    hasSearch: boolean;
    searchValue: string;

    hasFilters: boolean;
    activeFilterCount: number;

    hasSorting: boolean;
    activeSortCount: number;

    hasHiddenColumns: boolean;
    hiddenColumnCount: number;

    hasGrouping: boolean;
    groupedColumnCount: number;

    hasSelection: boolean;
    selectedRowCount: number;

    canClearSearch: boolean;
    canClearFilters: boolean;
    canClearSorting: boolean;
    canResetColumns: boolean;
    canClearSelection: boolean;
    canClearGrouping: boolean;

    canResetToolbar: boolean;
}

export interface DeriveToolbarStateOptions<TRow = unknown> {
    columns: Array<ColumnDef<TRow>>;
    filter?: FilterState;
    sort?: SortState;
    columnVisibility?: ColumnVisibilityState;
    rowSelection?: RowSelectionState;
    grouping?: GroupingState;
}

export function deriveToolbarState<TRow = unknown>(
    options: DeriveToolbarStateOptions<TRow>,
): DerivedToolbarState {
    const {
        columns,
        filter,
        sort,
        columnVisibility,
        rowSelection,
        grouping,
    } = options;

    const searchValue = filter?.search ?? '';
    const activeFilterCount = filter?.items?.length ?? 0;
    const activeSortCount = sort?.items?.length ?? 0;

    let hiddenColumnCount = 0;

    for (const column of columns) {
        const columnId = getColumnId(column);

        const hiddenByColumn = column.visible === false;
        const hiddenByState = columnVisibility?.visibility?.[columnId] === false;

        if (hiddenByColumn || hiddenByState) {
            hiddenColumnCount += 1;
        }
    }

    const groupedColumnCount = grouping?.columnIds?.length ?? 0;

    const selectedRowCount = Object.values(
        rowSelection?.selectedRowIds ?? {},
    ).filter(Boolean).length;

    const hasSearch = searchValue.trim().length > 0;
    const hasFilters = activeFilterCount > 0;
    const hasSorting = activeSortCount > 0;
    const hasHiddenColumns = hiddenColumnCount > 0;
    const hasGrouping = groupedColumnCount > 0;
    const hasSelection = selectedRowCount > 0;

    const canClearSearch = hasSearch;
    const canClearFilters = hasFilters;
    const canClearSorting = hasSorting;
    const canResetColumns = hasHiddenColumns;
    const canClearSelection = hasSelection;
    const canClearGrouping = hasGrouping;

    return {
        hasSearch,
        searchValue,

        hasFilters,
        activeFilterCount,

        hasSorting,
        activeSortCount,

        hasHiddenColumns,
        hiddenColumnCount,

        hasGrouping,
        groupedColumnCount,

        hasSelection,
        selectedRowCount,

        canClearSearch,
        canClearFilters,
        canClearSorting,
        canResetColumns,
        canClearSelection,
        canClearGrouping,

        canResetToolbar:
            canClearSearch ||
            canClearFilters ||
            canClearSorting ||
            canResetColumns ||
            canClearSelection ||
            canClearGrouping,
    };
}
