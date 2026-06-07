"use client"

import { useEffect } from 'react';

import type {
    DataGridEventMap,
    DataGridTableInstance,
    TableStoreState,
} from '../core/types';

type MaybeHandler<TArgs extends unknown[]> = ((...args: TArgs) => void) | undefined;

function call<TArgs extends unknown[]>(
    handler: MaybeHandler<TArgs>,
    ...args: TArgs
): void {
    if (handler) {
        handler(...args);
    }
}

function shallowChanged<T>(a: T, b: T): boolean {
    return a !== b;
}

export function useDataGridEvents(
    instance: DataGridTableInstance,
    handlers?: Partial<DataGridEventMap>,
): void {
    useEffect(() => {
        if (!handlers) {
            return;
        }

        let prev = instance.store.getState() as TableStoreState;

        const unsubscribe = instance.store.subscribe((nextState) => {
            if (shallowChanged(prev.search.query, nextState.search.query)) {
                call(
                    handlers.onSearchChange,
                    nextState.search.query,
                    nextState,
                );
            }

            if (shallowChanged(prev.sorting.sortModel, nextState.sorting.sortModel)) {
                call(
                    handlers.onSortingChange,
                    nextState.sorting.sortModel,
                    nextState,
                );
            }

            if (shallowChanged(prev.filters.items, nextState.filters.items)) {
                call(
                    handlers.onFiltersChange,
                    nextState.filters,
                    nextState,
                );
            }

            if (
                shallowChanged(prev.pagination.pageIndex, nextState.pagination.pageIndex) ||
                shallowChanged(prev.pagination.pageSize, nextState.pagination.pageSize)
            ) {
                call(
                    handlers.onPaginationChange,
                    nextState.pagination,
                    nextState,
                );
            }

            if (
                shallowChanged(
                    prev.columnVisibility.visibility,
                    nextState.columnVisibility.visibility,
                )
            ) {
                call(
                    handlers.onColumnVisibilityChange,
                    nextState.columnVisibility,
                    nextState,
                );
            }

            if (
                shallowChanged(
                    prev.rowSelection.selectedRowIds,
                    nextState.rowSelection.selectedRowIds,
                )
            ) {
                call(
                    handlers.onRowSelectionChange,
                    nextState.rowSelection,
                    nextState,
                );
            }

            if (
                shallowChanged(
                    prev.rowExpansion.expandedRowIds,
                    nextState.rowExpansion.expandedRowIds,
                )
            ) {
                call(
                    handlers.onRowExpansionChange,
                    nextState.rowExpansion,
                    nextState,
                );
            }

            if (
                shallowChanged(
                    prev.toolbar.density,
                    nextState.toolbar.density,
                ) ||
                shallowChanged(
                    prev.toolbar.isFullscreen,
                    nextState.toolbar.isFullscreen,
                ) ||
                shallowChanged(
                    prev.toolbar.isColumnManagerOpen,
                    nextState.toolbar.isColumnManagerOpen,
                )
            ) {
                call(
                    handlers.onToolbarChange,
                    nextState.toolbar,
                    nextState,
                );
            }

            prev = nextState;
        });

        return unsubscribe;
    }, [handlers, instance]);
}
