import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  DynamicGridColumnFiltersState,
  DynamicGridColumnPinningPosition,
  DynamicGridDensity,
  DynamicGridEditingCell,
  DynamicGridPaginationState,
  DynamicGridRowId,
  DynamicGridSortingState,
  DynamicSmartGridColumn,
  DynamicSmartGridContextValue,
  DynamicSmartGridProps,
} from "./DynamicSmartGrid.types";

interface DynamicSmartGridProviderProps<TData> {
  children: React.ReactNode;
  props: DynamicSmartGridProps<TData>;
}

const DynamicSmartGridContext =
  createContext<DynamicSmartGridContextValue<any> | null>(null);

export function DynamicSmartGridProvider<TData>({
  children,
  props,
}: DynamicSmartGridProviderProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const safeRows = useMemo<TData[]>(() => {
    return Array.isArray(props.data) ? props.data : [];
  }, [props.data]);

  const safeColumns = useMemo<DynamicSmartGridColumn<TData>[]>(() => {
    return Array.isArray(props.columns) ? props.columns : [];
  }, [props.columns]);

  const defaultGetRowId = useCallback(
    (row: TData, index: number): DynamicGridRowId => {
      const possibleRow = row as any;

      if (possibleRow?.id !== undefined && possibleRow?.id !== null) {
        return possibleRow.id;
      }

      if (possibleRow?._id !== undefined && possibleRow?._id !== null) {
        return possibleRow._id;
      }

      return index;
    },
    [],
  );

  const getRowId = props.getRowId ?? defaultGetRowId;

  const [rows, setRows] = useState<TData[]>(safeRows);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRows(safeRows);
  }, [safeRows]);

  const [density, setDensity] = useState<DynamicGridDensity>(
    props.density ?? "comfortable",
  );

  const [editingCell, setEditingCell] = useState<DynamicGridEditingCell | null>(
    null,
  );

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  /**
   * Columns state
   */
  const initialOrderedColumnIds = useMemo(() => {
    return safeColumns.map((column) => column.id);
  }, [safeColumns]);

  const [orderedColumnIds, setOrderedColumnIds] = useState<string[]>(
    initialOrderedColumnIds,
  );

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedColumnIds((prev) => {
      if (prev.length > 0) return prev;
      return initialOrderedColumnIds;
    });
  }, [initialOrderedColumnIds]);

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    () => {
      const result: Record<string, number> = {};

      for (const column of safeColumns) {
        if (typeof column.width === "number") {
          result[column.id] = column.width;
        }
      }

      return result;
    },
  );

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const [columnPinning, setColumnPinning] = useState<
    Record<string, DynamicGridColumnPinningPosition>
  >({});

  const columns = useMemo<DynamicSmartGridColumn<TData>[]>(() => {
    const columnMap = new Map(safeColumns.map((column) => [column.id, column]));

    const orderedColumns = orderedColumnIds
      .map((id) => columnMap.get(id))
      .filter(Boolean) as DynamicSmartGridColumn<TData>[];

    const missingColumns = safeColumns.filter(
      (column) => !orderedColumnIds.includes(column.id),
    );

    return [...orderedColumns, ...missingColumns];
  }, [safeColumns, orderedColumnIds]);

  const visibleColumns = useMemo<DynamicSmartGridColumn<TData>[]>(() => {
    return columns.filter((column) => columnVisibility[column.id] !== false);
  }, [columns, columnVisibility]);

  const reorderColumn = useCallback(
    (sourceColumnId: string, targetColumnId: string) => {
      setOrderedColumnIds((prev) => {
        const current =
          prev.length > 0 ? [...prev] : safeColumns.map((column) => column.id);

        const sourceIndex = current.indexOf(sourceColumnId);
        const targetIndex = current.indexOf(targetColumnId);

        if (sourceIndex === -1 || targetIndex === -1) return current;

        const [removed] = current.splice(sourceIndex, 1);
        current.splice(targetIndex, 0, removed);

        return current;
      });
    },
    [safeColumns],
  );

  const resizeColumn = useCallback((columnId: string, width: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [columnId]: width,
    }));
  }, []);

  const getPinnedStyle = useCallback(
    (columnId: string): React.CSSProperties => {
      const pinning = columnPinning[columnId];

      if (!pinning) return {};

      const widthMap = columnWidths ?? {};
      const currentVisibleColumns = visibleColumns ?? [];

      if (pinning === "left") {
        let left = 0;

        for (const column of currentVisibleColumns) {
          if (column.id === columnId) break;

          if (columnPinning[column.id] === "left") {
            left += widthMap[column.id] ?? column.width ?? 160;
          }
        }

        return {
          position: "sticky",
          left,
          zIndex: 20,
          background: "inherit",
        };
      }

      if (pinning === "right") {
        let right = 0;

        for (
          let index = currentVisibleColumns.length - 1;
          index >= 0;
          index--
        ) {
          const column = currentVisibleColumns[index];

          if (column.id === columnId) break;

          if (columnPinning[column.id] === "right") {
            right += widthMap[column.id] ?? column.width ?? 160;
          }
        }

        return {
          position: "sticky",
          right,
          zIndex: 20,
          background: "inherit",
        };
      }

      return {};
    },
    [columnPinning, columnWidths, visibleColumns],
  );

  /**
   * Filtering state
   */
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] =
    useState<DynamicGridColumnFiltersState>({});

  const getCellValue = useCallback(
    (row: TData, column: DynamicSmartGridColumn<TData>): unknown => {
      if (column.accessorFn) {
        return column.accessorFn(row);
      }

      if (column.accessorKey) {
        return (row as any)?.[column.accessorKey];
      }

      return (row as any)?.[column.id];
    },
    [],
  );

  const filteredRows = useMemo<TData[]>(() => {
    const currentRows = Array.isArray(rows) ? rows : [];
    const currentColumns = Array.isArray(safeColumns) ? safeColumns : [];

    const normalizedGlobalFilter = globalFilter.trim().toLowerCase();

    return currentRows.filter((row) => {
      if (normalizedGlobalFilter) {
        const hasGlobalMatch = currentColumns.some((column) => {
          const value = getCellValue(row, column);

          return String(value ?? "")
            .toLowerCase()
            .includes(normalizedGlobalFilter);
        });

        if (!hasGlobalMatch) return false;
      }

      for (const [columnId, filterValue] of Object.entries(columnFilters)) {
        const normalizedFilterValue = String(filterValue ?? "")
          .trim()
          .toLowerCase();

        if (!normalizedFilterValue) continue;

        const column = currentColumns.find((item) => item.id === columnId);

        if (!column) continue;

        const value = getCellValue(row, column);

        const normalizedValue = String(value ?? "").toLowerCase();

        if (!normalizedValue.includes(normalizedFilterValue)) {
          return false;
        }
      }

      return true;
    });
  }, [rows, safeColumns, globalFilter, columnFilters, getCellValue]);

  /**
   * Sorting state
   */
  const [sorting, setSorting]: any = useState<DynamicGridSortingState[]>([]);

  const toggleSort = useCallback((columnId: string) => {
    setSorting((prev: any) => {
      const current = prev[0];

      if (!current || current.id !== columnId) {
        return [{ id: columnId, desc: false }];
      }

      if (current.desc === false) {
        return [{ id: columnId, desc: true }];
      }

      return [];
    });
  }, []);

  const sortedRows = useMemo<TData[]>(() => {
    const currentRows = Array.isArray(filteredRows) ? filteredRows : [];
    const currentSorting = Array.isArray(sorting) ? sorting : [];

    if (currentSorting.length === 0) {
      return currentRows;
    }

    const sortItem = currentSorting[0];

    if (!sortItem) return currentRows;

    const column = safeColumns.find((item) => item.id === sortItem.id);

    if (!column) return currentRows;

    return [...currentRows].sort((a, b) => {
      const aValue = getCellValue(a, column);
      const bValue = getCellValue(b, column);

      if (aValue === bValue) return 0;

      if (aValue === null || aValue === undefined) {
        return sortItem.desc ? 1 : -1;
      }

      if (bValue === null || bValue === undefined) {
        return sortItem.desc ? -1 : 1;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortItem.desc ? bValue - aValue : aValue - bValue;
      }

      const result = String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,
        sensitivity: "base",
      });

      return sortItem.desc ? -result : result;
    });
  }, [filteredRows, sorting, safeColumns, getCellValue]);

  /**
   * Pagination state
   */
  const [pagination, setPagination] = useState<DynamicGridPaginationState>({
    pageIndex: 0,
    pageSize: props.initialPageSize ?? 10,
  });

  const pageCount = useMemo(() => {
    const total = sortedRows.length;
    const pageSize = pagination.pageSize || 10;

    return Math.max(1, Math.ceil(total / pageSize));
  }, [sortedRows.length, pagination.pageSize]);

  const paginatedRows = useMemo<TData[]>(() => {
    const currentRows = Array.isArray(sortedRows) ? sortedRows : [];

    if (props.enablePagination === false) {
      return currentRows;
    }

    const pageIndex = pagination.pageIndex;
    const pageSize = pagination.pageSize;

    const start = pageIndex * pageSize;
    const end = start + pageSize;

    return currentRows.slice(start, end);
  }, [sortedRows, pagination, props.enablePagination]);

  /**
   * Selection state
   */
  const [selectedIds, setSelectedIds] = useState<Set<DynamicGridRowId>>(
    () => new Set(),
  );

  const isRowSelected = useCallback(
    (rowId: DynamicGridRowId) => {
      return selectedIds.has(rowId);
    },
    [selectedIds],
  );

  const toggleRowSelection = useCallback((rowId: DynamicGridRowId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }

      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const visibleRowIds = useMemo(() => {
    return paginatedRows.map((row, index) => getRowId(row, index));
  }, [paginatedRows, getRowId]);

  const isAllVisibleRowsSelected = useMemo(() => {
    if (visibleRowIds.length === 0) return false;

    return visibleRowIds.every((id) => selectedIds.has(id));
  }, [visibleRowIds, selectedIds]);

  const isSomeVisibleRowsSelected = useMemo(() => {
    if (visibleRowIds.length === 0) return false;

    const someSelected = visibleRowIds.some((id) => selectedIds.has(id));

    return someSelected && !isAllVisibleRowsSelected;
  }, [visibleRowIds, selectedIds, isAllVisibleRowsSelected]);

  const toggleAllVisibleRowsSelection = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      const allSelected =
        visibleRowIds.length > 0 && visibleRowIds.every((id) => next.has(id));

      if (allSelected) {
        for (const id of visibleRowIds) {
          next.delete(id);
        }
      } else {
        for (const id of visibleRowIds) {
          next.add(id);
        }
      }

      return next;
    });
  }, [visibleRowIds]);

  const isAllPageRowsSelected = isAllVisibleRowsSelected;
  const isSomePageRowsSelected = isSomeVisibleRowsSelected;
  const toggleSelectAllPageRows = toggleAllVisibleRowsSelection;

  React.useEffect(() => {
    props.onSelectionChange?.(selectedIds);
  }, [selectedIds, props]);

  /**
   * Expansion state
   */
  const [expandedIds, setExpandedIds] = useState<Set<DynamicGridRowId>>(
    () => new Set(),
  );

  const isRowExpanded = useCallback(
    (rowId: DynamicGridRowId) => {
      return expandedIds.has(rowId);
    },
    [expandedIds],
  );

  const toggleRowExpansion = useCallback((rowId: DynamicGridRowId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);

      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }

      return next;
    });
  }, []);

  /**
   * Update cell
   */
  const updateCellValue = useCallback(
    (rowId: DynamicGridRowId, columnId: string, value: unknown) => {
      setRows((prevRows) => {
        const nextRows = prevRows.map((row, index) => {
          const currentRowId = getRowId(row, index);

          if (currentRowId !== rowId) return row;

          return {
            ...(row as any),
            [columnId]: value,
          };
        });

        props.onDataChange?.(nextRows);

        return nextRows;
      });
    },
    [getRowId, props],
  );

  /**
   * Reset layout
   */
  const resetLayout = useCallback(() => {
    setOrderedColumnIds(safeColumns.map((column) => column.id));

    const initialWidths: Record<string, number> = {};

    for (const column of safeColumns) {
      if (typeof column.width === "number") {
        initialWidths[column.id] = column.width;
      }
    }

    setColumnWidths(initialWidths);
    setColumnVisibility({});
    setColumnPinning({});
    setGlobalFilter("");
    setColumnFilters({});
    setSorting([]);
    setSelectedIds(new Set());
    setExpandedIds(new Set());
    setPagination({
      pageIndex: 0,
      pageSize: props.initialPageSize ?? 10,
    });
  }, [safeColumns, props.initialPageSize]);

  /**
   * Export helpers
   */
  const exportJson = useCallback(() => {
    const dataStr = JSON.stringify(sortedRows, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "dynamic-smart-grid-data.json";
    link.click();

    URL.revokeObjectURL(url);
  }, [sortedRows]);

  const exportCsv = useCallback(() => {
    const currentColumns = visibleColumns;
    const currentRows = sortedRows;

    const headers = currentColumns.map((column) =>
      String(column.header ?? column.id),
    );

    const csvRows = currentRows.map((row) => {
      return currentColumns
        .map((column) => {
          const value = getCellValue(row, column);
          const stringValue = String(value ?? "");

          return `"${stringValue.replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    const csv = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "dynamic-smart-grid-data.csv";
    link.click();

    URL.revokeObjectURL(url);
  }, [visibleColumns, sortedRows, getCellValue]);

  const value = useMemo<DynamicSmartGridContextValue<TData>>(
    () => ({
      props,

      tableContainerRef,

      rows: rows ?? [],
      setRows,

      rawColumns: safeColumns,

      columns: columns ?? [],
      visibleColumns: visibleColumns ?? [],

      orderedColumnIds,
      setOrderedColumnIds,

      columnWidths,
      setColumnWidths,

      columnVisibility,
      setColumnVisibility,

      columnPinning,
      setColumnPinning,

      getPinnedStyle,

      globalFilter,
      setGlobalFilter,

      columnFilters,
      setColumnFilters,

      sorting,
      setSorting,
      toggleSort,

      selectedIds,
      setSelectedIds,

      isRowSelected,
      toggleRowSelection,
      toggleAllVisibleRowsSelection,
      clearSelection,

      isAllVisibleRowsSelected,
      isSomeVisibleRowsSelected,

      isAllPageRowsSelected,
      isSomePageRowsSelected,
      toggleSelectAllPageRows,

      expandedIds,
      isRowExpanded,
      toggleRowExpansion,

      pagination,
      setPagination,

      density,
      setDensity,

      isFullscreen,
      toggleFullscreen,

      editingCell,
      setEditingCell,

      filteredRows: filteredRows ?? [],
      sortedRows: sortedRows ?? [],
      paginatedRows: paginatedRows ?? [],

      totalRows: (rows ?? []).length,
      totalFilteredRows: (filteredRows ?? []).length,
      pageCount,

      getRowId,
      getCellValue,

      updateCellValue,

      reorderColumn,
      resizeColumn,

      resetLayout,
      exportCsv,
      exportJson,
    }),
    [
      props,
      tableContainerRef,
      rows,
      safeColumns,
      columns,
      visibleColumns,
      orderedColumnIds,
      columnWidths,
      columnVisibility,
      columnPinning,
      getPinnedStyle,
      globalFilter,
      columnFilters,
      sorting,
      toggleSort,
      selectedIds,
      isRowSelected,
      toggleRowSelection,
      toggleAllVisibleRowsSelection,
      clearSelection,
      isAllVisibleRowsSelected,
      isSomeVisibleRowsSelected,
      isAllPageRowsSelected,
      isSomePageRowsSelected,
      toggleSelectAllPageRows,
      expandedIds,
      isRowExpanded,
      toggleRowExpansion,
      pagination,
      density,
      isFullscreen,
      toggleFullscreen,
      editingCell,
      filteredRows,
      sortedRows,
      paginatedRows,
      pageCount,
      getRowId,
      getCellValue,
      updateCellValue,
      reorderColumn,
      resizeColumn,
      resetLayout,
      exportCsv,
      exportJson,
    ],
  );

  return (
    <DynamicSmartGridContext.Provider value={value}>
      {children}
    </DynamicSmartGridContext.Provider>
  );
}

export function useDynamicSmartGrid<TData = any>() {
  const context = useContext(DynamicSmartGridContext);

  if (!context) {
    throw new Error(
      "useDynamicSmartGrid must be used inside DynamicSmartGridProvider",
    );
  }

  return context as DynamicSmartGridContextValue<TData>;
}

export const useDynamicSmartGridContext = useDynamicSmartGrid;
