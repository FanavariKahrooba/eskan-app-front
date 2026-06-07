import type { ColumnDef, NormalizedColumnDef } from './column-def';
import type { ColumnPinningState } from './column-pinning-state';
import type { ColumnSizingState } from './column-sizing-state';
import type { ColumnVisibilityState } from './column-visibility-state';
import type { FilterState } from './filter-state';
import type { DataGridState } from './data-grid-state';
import type { PaginationState } from './pagination-state';
import type { RowEditingState } from './row-editing-state';
import type { RowSelectionState } from './row-selection-state';
import type { SortState } from './sort-state';
import { TableStoreState } from '../../store';

export interface DataGridApi<TRow = unknown> {
    getState: () => DataGridState;
    setState: (state: Partial<DataGridState>) => void;
    resetState: () => void;

    getRows: () => TRow[];
    getVisibleRows: () => TRow[];
    getSelectedRows: () => TRow[];

    getRowId: (row: TRow, index: number) => string;
    getRowById: (rowId: string) => TRow | undefined;

    getColumns: () => Array<NormalizedColumnDef<TRow>>;
    getLeafColumns: () => Array<NormalizedColumnDef<TRow>>;
    getColumn: (columnId: string) => NormalizedColumnDef<TRow> | undefined;
    setColumns: (columns: Array<ColumnDef<TRow>>) => void;

    setSorting: (sorting: SortState) => void;
    clearSorting: () => void;

    setFilters: (filters: FilterState) => void;
    clearFilters: (columnId?: string) => void;

    setSearch: any;

    setPagination: (pagination: PaginationState) => void;
    setPageIndex: (pageIndex: number) => void;
    setPageSize: (pageSize: number) => void;

    setColumnVisibility: (visibility: ColumnVisibilityState) => void;
    showColumn: (columnId: string) => void;
    hideColumn: (columnId: string) => void;
    toggleColumnVisibility: (columnId: string) => void;

    setColumnPinning: (pinning: ColumnPinningState) => void;
    pinColumn: (columnId: string, position: 'left' | 'right') => void;
    unpinColumn: (columnId: string) => void;

    setColumnSizing: (sizing: ColumnSizingState) => void;
    setColumnSize: (columnId: string, size: number) => void;
    resetColumnSize: (columnId?: string) => void;

    setRowSelection: (selection: RowSelectionState) => void;
    selectRow: (rowId: string) => void;
    deselectRow: (rowId: string) => void;
    toggleRowSelection: (rowId: string) => void;
    clearRowSelection: () => void;

    setRowEditing: (editing: RowEditingState) => void;
    startRowEdit: (rowId: string) => void;
    stopRowEdit: (rowId: string) => void;
    startCellEdit: (rowId: string, columnId: string) => void;
    stopCellEdit: () => void;

    expandRow: (rowId: string) => void;
    collapseRow: (rowId: string) => void;
    toggleRowExpanded: (rowId: string) => void;

    refresh: () => void | Promise<void>;
    exportData?: (format?: string) => void | Promise<void>;

    setSearchQuery: (query: string) => void;
    clearSearch: () => void;
    toggleSort: (columnId: string) => void;

    addFilter: (filter: TableStoreState['filters']['items'][number]) => void;
    removeFilter: (filterId: string) => void;
  
    setPage: (pageIndex: number) => void;

    setColumnOrder: (columnIds: string[]) => void;

    toggleRowExpansion: (rowId: string) => void;
    clearRowExpansion: () => void;
    beginEditCell: (
        rowId: string,
        columnId: string,
        initialValue?: unknown,
    ) => void;
    setEditingValue: (
        rowId: string,
        columnId: string,
        value: unknown,
    ) => void;
    commitEditingCell: () => void;
    cancelEditingCell: () => void;
    setDensity: (density: 'sm' | 'md' | 'lg') => void;
    setFullscreen: (fullscreen: boolean) => void;
    setColumnManagerOpen: (open: boolean) => void;
    applyViewPreset: (presetId: string) => void;
    setActiveViewPreset: (presetId: string | null) => void;
    resetAll: () => void;
}
