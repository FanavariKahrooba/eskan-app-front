"use client"
import { useCallback, useMemo } from 'react';

import type {
    DataGridApi,
    DataGridTableInstance,
} from '../core/types';

export function useDataGridApi(
    instance: DataGridTableInstance,
): DataGridApi {
    const store = instance.store;

    const getState = useCallback(() => store.getState(), [store]);

    const api = useMemo<DataGridApi>(
        () => ({
            getState,

            setSearchQuery(query) {
                store.getState().setSearchQuery(query);
            },

            clearSearch() {
                store.getState().clearSearch();
            },

            setSorting(sortModel) {
                store.getState().setSorting(sortModel);
            },

            toggleSort(columnId) {
                store.getState().toggleSort(columnId);
            },

            clearSorting() {
                store.getState().clearSorting();
            },

            setFilters(filters) {
                store.getState().setFilters(filters);
            },

            addFilter(filter) {
                store.getState().addFilter(filter);
            },

            removeFilter(filterId) {
                store.getState().removeFilter(filterId);
            },

            clearFilters() {
                store.getState().clearFilters();
            },

            setPage(pageIndex) {
                store.getState().setPage(pageIndex);
            },

            setPageSize(pageSize) {
                store.getState().setPageSize(pageSize);
            },

            setColumnVisibility(columnId, visible) {
                store.getState().setColumnVisibility(columnId, visible);
            },

            toggleColumnVisibility(columnId) {
                store.getState().toggleColumnVisibility(columnId);
            },

            setColumnOrder(columnIds) {
                store.getState().setColumnOrder(columnIds);
            },

            pinColumn(columnId, side) {
                store.getState().pinColumn(columnId, side);
            },

            unpinColumn(columnId) {
                store.getState().unpinColumn(columnId);
            },

            setColumnSize(columnId, size) {
                store.getState().setColumnSize(columnId, size);
            },

            selectRow(rowId) {
                store.getState().selectRow(rowId);
            },

            deselectRow(rowId) {
                store.getState().deselectRow(rowId);
            },

            toggleRowSelection(rowId) {
                store.getState().toggleRowSelection(rowId);
            },

            clearRowSelection() {
                store.getState().clearRowSelection();
            },

            expandRow(rowId) {
                store.getState().expandRow(rowId);
            },

            collapseRow(rowId) {
                store.getState().collapseRow(rowId);
            },

            toggleRowExpansion(rowId) {
                store.getState().toggleRowExpansion(rowId);
            },

            clearRowExpansion() {
                store.getState().clearRowExpansion();
            },

            beginEditCell(rowId, columnId, initialValue) {
                store.getState().beginEditCell(rowId, columnId, initialValue);
            },

            setEditingValue(rowId, columnId, value) {
                store.getState().setEditingValue(rowId, columnId, value);
            },

            commitEditingCell() {
                store.getState().commitEditingCell();
            },

            cancelEditingCell() {
                store.getState().cancelEditingCell();
            },

            setDensity(density) {
                store.getState().setDensity(density);
            },

            setFullscreen(fullscreen) {
                store.getState().setFullscreen(fullscreen);
            },

            setColumnManagerOpen(open) {
                store.getState().setColumnManagerOpen(open);
            },

            applyViewPreset(presetId) {
                store.getState().applyViewPreset(presetId);
            },

            setActiveViewPreset(presetId) {
                store.getState().setActiveViewPreset(presetId);
            },

            resetAll() {
                const state = store.getState();

                state.resetColumnOrder();
                state.resetColumnPinning();
                state.resetColumnSizing();
                state.resetColumnVisibility();
                state.resetFilters();
                state.resetPagination();
                state.clearEditingDrafts();
                state.resetRowExpansion();
                state.resetRowSelection();
                state.resetSearch();
                state.resetSorting();
                state.resetToolbar();
                state.resetViewPresets();
            },
        }),
        [getState, store],
    );

    return api;
}
