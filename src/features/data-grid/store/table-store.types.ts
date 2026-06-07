import type {
    ColumnOrderState,
    ColumnPinningState,
    ColumnSizingState,
    ColumnVisibilityState,
    FilterItem,
    FilterState,
    PaginationState,
    RowDetailsState,
    RowSelectionState,
} from '../core/types';
import type { InlineEditingState } from '../plugins/inline-editing';

export interface ViewPreset {
    id: string;
    name: string;

    columnOrder?: ColumnOrderState;
    columnPinning?: ColumnPinningState;
    columnSizing?: ColumnSizingState;
    columnVisibility?: ColumnVisibilityState;
    filters?: FilterState;
    pagination?: PaginationState;
    rowExpansion?: RowDetailsState;
    rowSelection?: RowSelectionState;
    search?: any;
    sorting?: any;
    toolbar?: any;
}

export interface TableStoreState {
    columnOrder: ColumnOrderState;
    columnPinning: ColumnPinningState;
    columnSizing: ColumnSizingState;
    columnVisibility: ColumnVisibilityState;
    filters: FilterState;
    pagination: PaginationState;
    rowEditing: InlineEditingState;
    rowExpansion: RowDetailsState;
    rowSelection: RowSelectionState;
    search: any;
    sorting: any;
    toolbar: any;
    viewPresets: ViewPreset[];
    activeViewPresetId: string | null;
}

export interface ColumnOrderSlice {
    setColumnOrder: (orderedColumnIds: string[]) => void;
    resetColumnOrder: () => void;
}

export interface ColumnPinningSlice {
    setPinnedLeft: (columnIds: string[]) => void;
    setPinnedRight: (columnIds: string[]) => void;
    pinColumnLeft: (columnId: string) => void;
    pinColumnRight: (columnId: string) => void;
    unpinColumn: (columnId: string) => void;
    resetColumnPinning: () => void;
}

export interface ColumnSizingSlice {
    setColumnSize: (columnId: string, width: number) => void;
    setColumnSizes: (sizes: Record<string, number>) => void;
    resetColumnSizing: () => void;
}

export interface ColumnVisibilitySlice {
    setColumnVisibility: (columnId: string, visible: boolean) => void;
    setManyColumnVisibility: (visibility: Record<string, boolean>) => void;
    showAllColumns: () => void;
    hideAllColumns: () => void;
    resetColumnVisibility: () => void;
}

export interface FilterSlice {
    setFilters: (filters: FilterState['items']) => void;
    upsertFilter: (filter: FilterState['items'][number]) => void;
    removeFilter: (filterId: string) => void;
    clearFilters: () => void;
    setFilterLogic: (logic: FilterState['logicOperator']) => void;
    resetFilters: () => void;
}

export interface PaginationSlice {
    setPagination: (pagination: PaginationState) => void;
    setPage: (pageIndex: number) => void;
    setPageSize: (pageSize: number) => void;
    resetPagination: () => void;
}

export interface RowEditingSlice {
    beginEditCell: (rowId: string, columnId: string, initialValue?: unknown) => void;
    setEditingValue: (rowId: string, columnId: string, value: unknown) => void;
    commitEditingCell: () => void;
    cancelEditingCell: () => void;
    clearEditingDrafts: () => void;
}

export interface RowExpansionSlice {
    setExpandedRows: (expandedRowIds: Record<string, boolean>) => void;
    toggleExpandedRow: (rowId: string) => void;
    expandRow: (rowId: string) => void;
    collapseRow: (rowId: string) => void;
    collapseAllRows: () => void;
    resetRowExpansion: () => void;
}

export interface RowSelectionSlice {
    setSelectedRows: (selectedRowIds: Record<string, boolean>) => void;
    toggleRowSelection: (rowId: string) => void;
    selectRow: (rowId: string) => void;
    deselectRow: (rowId: string) => void;
    clearRowSelection: () => void;
    resetRowSelection: () => void;
}

export interface SearchSlice {
    setSearchQuery: (query: string) => void;
    clearSearch: () => void;
    resetSearch: () => void;
}

export interface SortingSlice {
    setSorting: (sorting: any) => void;
    toggleSort: (columnId: string) => void;
    clearSorting: () => void;
    resetSorting: () => void;
}

export interface ToolbarSlice {
    setToolbarState: (toolbar: any) => void;
    setDensity: (density: any) => void;
    setFullscreen: (fullscreen: boolean) => void;
    setColumnManagerOpen: (open: boolean) => void;
    resetToolbar: () => void;
}

export interface ViewPresetSlice {
    setViewPresets: (presets: ViewPreset[]) => void;
    addViewPreset: (preset: ViewPreset) => void;
    updateViewPreset: (presetId: string, patch: Partial<ViewPreset>) => void;
    removeViewPreset: (presetId: string) => void;
    setActiveViewPreset: (presetId: string | null) => void;
    applyViewPreset: (presetId: string) => void;
    resetViewPresets: () => void;
}

export interface TableStoreActions
    extends ColumnOrderSlice,
    ColumnPinningSlice,
    ColumnSizingSlice,
    ColumnVisibilitySlice,
    FilterSlice,
    PaginationSlice,
    RowEditingSlice,
    RowExpansionSlice,
    RowSelectionSlice,
    SearchSlice,
    SortingSlice,
    ToolbarSlice,
    ViewPresetSlice { }

export interface TableStore extends TableStoreState, TableStoreActions {
    addFilter(filter: FilterItem): unknown;
}

export interface TableStoreInitialState extends Partial<TableStoreState> { }

export interface TableStorePersistenceOptions {
    enabled?: boolean;
    storageKey?: string;
    storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
    partialize?: (state: TableStoreState) => Partial<TableStoreState>;
}

export interface CreateTableStoreOptions {
    initialState?: TableStoreInitialState;
    persistence?: TableStorePersistenceOptions;
}
