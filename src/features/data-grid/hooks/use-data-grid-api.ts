"use client";

import { useCallback, useMemo } from "react";

import type {
    DataGridApi,
    DataGridTableInstance,
} from "../core/types";
import type {
    ColumnDef,
    ColumnPinningState,
    ColumnSizingState,
    ColumnVisibilityState,
    DataGridState,
    FilterState,
    PaginationState,
    RowEditingState,
    RowSelectionState,
} from "../core/types";

export function useDataGridApi(
    instance: DataGridTableInstance,
): DataGridApi {
    const store = instance.store;

    const getState = useCallback<DataGridApi["getState"]>(
        () => store.getState() as unknown as DataGridState,
        [store],
    );

    const api = useMemo<DataGridApi>(
        () => ({
            getState,

            setState(partialState) {
                const state = store.getState() as any;
                if (typeof state.setState === "function") {
                    state.setState(partialState);
                }
            },

            resetState() {
                const state = store.getState() as any;
                if (typeof state.resetState === "function") {
                    state.resetState();
                    return;
                }

                state.resetColumnOrder?.();
                state.resetColumnPinning?.();
                state.resetColumnSizing?.();
                state.resetColumnVisibility?.();
                state.resetFilters?.();
                state.resetPagination?.();
                state.clearEditingDrafts?.();
                state.resetRowExpansion?.();
                state.resetRowSelection?.();
                state.resetSearch?.();
                state.resetSorting?.();
                state.resetToolbar?.();
                state.resetViewPresets?.();
            },

            getRows() {
                const state = store.getState() as any;
                return state.rows ?? state.data ?? [];
            },

            getVisibleRows() {
                const state = store.getState() as any;
                return state.visibleRows ?? state.rows ?? state.data ?? [];
            },

            getSelectedRows() {
                const state = store.getState() as any;
                const rows = state.rows ?? state.data ?? [];
                const selection = state.rowSelection ?? {};

                return rows.filter((row: any, index: number) => {
                    const rowId = this.getRowId(row, index);
                    return !!selection[rowId];
                });
            },

            getRowId(row, index) {
                const anyInstance = instance as any;

                if (typeof anyInstance.getRowId === "function") {
                    return anyInstance.getRowId(row, index);
                }

                if (typeof row === "object" && row !== null && "id" in (row as any)) {
                    return String((row as any).id);
                }

                return String(index);
            },

            getRowById(rowId) {
                const rows = this.getRows();
                return rows.find((row, index) => this.getRowId(row, index) === rowId);
            },

            getColumns() {
                const state = store.getState() as any;
                return state.columns ?? [];
            },

            getLeafColumns() {
                const state = store.getState() as any;
                return state.leafColumns ?? state.columns ?? [];
            },

            getColumn(columnId) {
                return this.getLeafColumns().find((col: any) => col.id === columnId);
            },

            setColumns(columns: Array<ColumnDef<any>>) {
                const state = store.getState() as any;
                state.setColumns?.(columns);
            },

            setSorting(sorting) {
                store.getState().setSorting(sorting);
            },

            clearSorting() {
                store.getState().clearSorting();
            },

            setFilters(filters: FilterState) {
                const state = store.getState() as any;
                state.setFilters(filters.items);
            },

            clearFilters(columnId?: string) {
                const state = store.getState() as any;

                if (columnId) {
                    state.removeFilter?.(columnId);
                    return;
                }

                state.clearFilters();
            },

            setSearch(query: string) {
                store.getState().setSearchQuery(query);
            },

            setPagination(pagination: PaginationState) {
                const state = store.getState() as any;
                state.setPage?.(pagination.pageIndex);
                state.setPageSize?.(pagination.pageSize);
            },

            setPageIndex(pageIndex: number) {
                store.getState().setPage(pageIndex);
            },

            setPageSize(pageSize: number) {
                store.getState().setPageSize(pageSize);
            },

            setColumnVisibility(visibility: ColumnVisibilityState) {
                const state = store.getState() as any;

                Object.entries(visibility).forEach(([columnId, visible]) => {
                    state.setColumnVisibility(columnId, visible);
                });
            },

            showColumn(columnId: string) {
                const state = store.getState() as any;
                state.setColumnVisibility(columnId, true);
            },

            hideColumn(columnId: string) {
                const state = store.getState() as any;
                state.setColumnVisibility(columnId, false);
            },

            toggleColumnVisibility(columnId: string) {
                const state = store.getState() as any;
                const current = state.columnVisibility?.[columnId] ?? true;
                state.setColumnVisibility(columnId, !current);
            },

            setColumnPinning(pinning: ColumnPinningState) {
                const state = store.getState() as any;
                state.setColumnPinning?.(pinning);
            },

            pinColumn(columnId: string, position: "left" | "right") {
                const state = store.getState() as any;
                const current = state.columnPinning ?? { left: [], right: [] };

                const left = (current.left ?? []).filter((id: string) => id !== columnId);
                const right = (current.right ?? []).filter((id: string) => id !== columnId);

                if (position === "left") {
                    state.setColumnPinning?.({
                        left: [...left, columnId],
                        right,
                    });
                    return;
                }

                state.setColumnPinning?.({
                    left,
                    right: [...right, columnId],
                });
            },

            unpinColumn(columnId: string) {
                const state = store.getState() as any;

                if (typeof state.unpinColumn === "function") {
                    state.unpinColumn(columnId);
                    return;
                }

                const current = state.columnPinning ?? { left: [], right: [] };

                state.setColumnPinning?.({
                    left: (current.left ?? []).filter((id: string) => id !== columnId),
                    right: (current.right ?? []).filter((id: string) => id !== columnId),
                });
            },

            setColumnSizing(sizing: ColumnSizingState) {
                const state = store.getState() as any;

                Object.entries(sizing).forEach(([columnId, size]) => {
                    state.setColumnSize?.(columnId, size);
                });
            },

            setColumnSize(columnId: string, size: number) {
                store.getState().setColumnSize(columnId, size);
            },

            resetColumnSize(columnId?: string) {
                const state = store.getState() as any;

                if (typeof state.resetColumnSize === "function") {
                    state.resetColumnSize(columnId);
                    return;
                }

                if (typeof state.resetColumnSizing === "function") {
                    state.resetColumnSizing();
                }
            },

            setRowSelection(selection: RowSelectionState) {
                const state = store.getState() as any;
                state.setRowSelection?.(selection);
            },

            selectRow(rowId: string) {
                store.getState().selectRow(rowId);
            },

            deselectRow(rowId: string) {
                store.getState().deselectRow(rowId);
            },

            toggleRowSelection(rowId: string) {
                store.getState().toggleRowSelection(rowId);
            },

            clearRowSelection() {
                store.getState().clearRowSelection();
            },

            setRowEditing(editing: RowEditingState) {
                const state = store.getState() as any;
                state.setRowEditing?.(editing);
            },

            startRowEdit(rowId: string) {
                const state = store.getState() as any;
                state.startRowEdit?.(rowId);
            },

            stopRowEdit(rowId: string) {
                const state = store.getState() as any;
                state.stopRowEdit?.(rowId);
            },

            startCellEdit(rowId: string, columnId: string) {
                const state = store.getState() as any;
                state.beginEditCell(rowId, columnId);
            },

            stopCellEdit() {
                const state = store.getState() as any;
                state.commitEditingCell?.();
            },

            expandRow(rowId: string) {
                store.getState().expandRow(rowId);
            },

            collapseRow(rowId: string) {
                store.getState().collapseRow(rowId);
            },

            toggleRowExpanded(rowId: string) {
                const state = store.getState() as any;
                const expanded = !!state.rowExpansion?.[rowId];

                if (expanded) {
                    state.collapseRow(rowId);
                } else {
                    state.expandRow(rowId);
                }
            },

            refresh() {
                const state = store.getState() as any;
                return state.refresh?.();
            },

            setSearchQuery(query: string) {
                store.getState().setSearchQuery(query);
            },

            clearSearch() {
                store.getState().clearSearch();
            },

            toggleSort(columnId: string) {
                store.getState().toggleSort(columnId);
            },

            addFilter(filter) {
                store.getState().addFilter(filter);
            },

            removeFilter(filterId: string) {
                store.getState().removeFilter(filterId);
            },

            setPage(pageIndex: number) {
                store.getState().setPage(pageIndex);
            },

            setColumnOrder(columnIds: string[]) {
                store.getState().setColumnOrder(columnIds);
            },

            toggleRowExpansion(rowId: string) {
                const state = store.getState() as any;
                const expanded = !!state.rowExpansion?.[rowId];

                if (expanded) {
                    state.collapseRow(rowId);
                } else {
                    state.expandRow(rowId);
                }
            },

            clearRowExpansion() {
                const state = store.getState() as any;
                state.resetRowExpansion?.();
            },

            beginEditCell(rowId: string, columnId: string, initialValue?: unknown) {
                store.getState().beginEditCell(rowId, columnId, initialValue);
            },

            setEditingValue(rowId: string, columnId: string, value: unknown) {
                store.getState().setEditingValue(rowId, columnId, value);
            },

            commitEditingCell() {
                store.getState().commitEditingCell();
            },

            cancelEditingCell() {
                store.getState().cancelEditingCell();
            },

            setDensity(density: "sm" | "md" | "lg") {
                store.getState().setDensity(density);
            },

            setFullscreen(fullscreen: boolean) {
                store.getState().setFullscreen(fullscreen);
            },

            setColumnManagerOpen(open: boolean) {
                store.getState().setColumnManagerOpen(open);
            },

            applyViewPreset(presetId: string) {
                store.getState().applyViewPreset(presetId);
            },

            setActiveViewPreset(presetId: string | null) {
                store.getState().setActiveViewPreset(presetId);
            },

            resetAll() {
                const state = store.getState() as any;

                state.resetColumnOrder?.();
                state.resetColumnPinning?.();
                state.resetColumnSizing?.();
                state.resetColumnVisibility?.();
                state.resetFilters?.();
                state.resetPagination?.();
                state.clearEditingDrafts?.();
                state.resetRowExpansion?.();
                state.resetRowSelection?.();
                state.resetSearch?.();
                state.resetSorting?.();
                state.resetToolbar?.();
                state.resetViewPresets?.();
            },
        }),
        [getState, instance, store],
    );

    return api;
}
