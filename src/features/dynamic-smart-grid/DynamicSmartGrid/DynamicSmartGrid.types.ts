import type React from "react";

export type DynamicGridRowId = string | number;

export type DynamicGridDensity = "compact" | "comfortable" | "spacious";

export type DynamicGridSortDirection = "asc" | "desc";

export type DynamicGridColumnPinningPosition = "left" | "right" | false;

export type DynamicGridColumnFiltersState = Record<string, string>;

export interface DynamicGridSortingState {
    id?: string;
    columnId: string;
    desc?: boolean;
    direction?: string
}

export interface DynamicGridPaginationState {
    pageIndex: number;
    pageSize: number;
}

export interface DynamicGridEditingCell {
    rowId: DynamicGridRowId;
    columnId: string;
}

export interface DynamicSmartGridColumn<TData = any> {
    id: string;
    header?: React.ReactNode;
    accessorKey?: keyof TData & string;
    accessorFn?: (row: TData) => unknown;
    cell?: (params: {
        row: TData;
        value: unknown;
        rowId: DynamicGridRowId;
        column: DynamicSmartGridColumn<TData>;
    }) => React.ReactNode;

    width?: number;
    minWidth?: number;
    maxWidth?: number;

    enableSorting?: boolean;
    enableFiltering?: boolean;
    enableResizing?: boolean;
    enableHiding?: boolean;
    enablePinning?: boolean;

    meta?: Record<string, unknown>;
}

export interface DynamicSmartGridProps<TData = any> {
    enableColumnFilters: boolean;
    onCellEdit(onCellEdit: any): unknown;
    enableInlineEdit: boolean;
    onRowDoubleClick<TData extends Record<string, unknown>>(row: TData, rowIndex: number): unknown;
    loading: any;
    enableColumnPanel: any;
    maxHeight: any;
    height: any;
    variant: string;
    enableExport: import("react/jsx-runtime").JSX.Element;
    subtitle: import("react/jsx-runtime").JSX.Element;
    title: import("react/jsx-runtime").JSX.Element;
    enableDensity: import("react/jsx-runtime").JSX.Element;
    enableSearch: import("react/jsx-runtime").JSX.Element;
    data?: TData[];
    columns?: DynamicSmartGridColumn<TData>[];

    getRowId?: (row: TData, index: number) => DynamicGridRowId;

    initialPageSize?: number;
    pageSizeOptions?: number[];

    enableSelection?: boolean;
    enableExpansion?: boolean;
    enableFiltering?: boolean;
    enableSorting?: boolean;
    enablePagination?: boolean;
    enableColumnResizing?: boolean;
    enableColumnPinning?: boolean;
    enableColumnVisibility?: boolean;
    enableFullscreen?: boolean;
    enableEditing?: boolean;

    density?: DynamicGridDensity;

    onDataChange?: (data: TData[]) => void;
    onRowClick?: (row: TData, rowId: DynamicGridRowId) => void;
    onSelectionChange?: (selectedIds: Set<DynamicGridRowId>) => void;

    className?: string;
    style?: React.CSSProperties;
}

export interface DynamicSmartGridContextValue<TData = any> {
    props: DynamicSmartGridProps<TData>;

    tableContainerRef: React.RefObject<HTMLDivElement | null>;

    rows: TData[];
    setRows: React.Dispatch<React.SetStateAction<TData[]>>;

    rawColumns: DynamicSmartGridColumn<TData>[];

    columns: DynamicSmartGridColumn<TData>[];
    visibleColumns: DynamicSmartGridColumn<TData>[];

    orderedColumnIds: string[];
    setOrderedColumnIds: React.Dispatch<React.SetStateAction<string[]>>;

    columnWidths: Record<string, number>;
    setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number>>>;

    columnVisibility: Record<string, boolean>;
    setColumnVisibility: React.Dispatch<
        React.SetStateAction<Record<string, boolean>>
    >;

    columnPinning: Record<string, DynamicGridColumnPinningPosition>;
    setColumnPinning: React.Dispatch<
        React.SetStateAction<Record<string, DynamicGridColumnPinningPosition>>
    >;

    getPinnedStyle: (columnId: string) => React.CSSProperties;

    globalFilter: string;
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;

    columnFilters: DynamicGridColumnFiltersState;
    setColumnFilters: React.Dispatch<
        React.SetStateAction<DynamicGridColumnFiltersState>
    >;

    sorting: DynamicGridSortingState[];
    setSorting: React.Dispatch<React.SetStateAction<DynamicGridSortingState[]>>;
    toggleSort: (columnId: string) => void;

    selectedIds: Set<DynamicGridRowId>;
    setSelectedIds: React.Dispatch<React.SetStateAction<Set<DynamicGridRowId>>>;

    isRowSelected: (rowId: DynamicGridRowId) => boolean;
    toggleRowSelection: (rowId: DynamicGridRowId) => void;
    toggleAllVisibleRowsSelection: () => void;
    clearSelection: () => void;

    isAllVisibleRowsSelected: boolean;
    isSomeVisibleRowsSelected: boolean;

    isAllPageRowsSelected: boolean;
    isSomePageRowsSelected: boolean;
    toggleSelectAllPageRows: () => void;

    expandedIds: Set<DynamicGridRowId>;
    isRowExpanded: (rowId: DynamicGridRowId) => boolean;
    toggleRowExpansion: (rowId: DynamicGridRowId) => void;

    pagination: DynamicGridPaginationState;
    setPagination: React.Dispatch<
        React.SetStateAction<DynamicGridPaginationState>
    >;

    density: DynamicGridDensity;
    setDensity: React.Dispatch<React.SetStateAction<DynamicGridDensity>>;

    isFullscreen: boolean;
    toggleFullscreen: () => void;

    editingCell: DynamicGridEditingCell | null;
    setEditingCell: React.Dispatch<
        React.SetStateAction<DynamicGridEditingCell | null>
    >;

    filteredRows: TData[];
    sortedRows: TData[];
    paginatedRows: TData[];

    totalRows: number;
    totalFilteredRows: number;
    pageCount: number;

    getRowId: (row: TData, index: number) => DynamicGridRowId;
    getCellValue: (
        row: TData,
        column: DynamicSmartGridColumn<TData>,
    ) => unknown;

    updateCellValue: (
        rowId: DynamicGridRowId,
        columnId: string,
        value: unknown,
    ) => void;

    reorderColumn: (sourceColumnId: string, targetColumnId: string) => void;
    resizeColumn: (columnId: string, width: number) => void;

    resetLayout: () => void;
    exportCsv: () => void;
    exportJson: () => void;
}
