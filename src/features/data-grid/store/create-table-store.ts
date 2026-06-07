import { createDefaultTableStoreState } from './table-store.defaults';
import {
    attachTableStorePersistence,
    loadPersistedTableState,
} from './table-store.persistence';
import type {
    CreateTableStoreOptions,
    TableStore,
    TableStoreState,
} from './table-store.types';

import { createColumnOrderSlice } from './slices/column-order-slice';
import { createColumnPinningSlice } from './slices/column-pinning-slice';
import { createColumnSizingSlice } from './slices/column-sizing-slice';
import { createColumnVisibilitySlice } from './slices/column-visibility-slice';
import { createFilterSlice } from './slices/filter-slice';
import { createPaginationSlice } from './slices/pagination-slice';
import { createRowEditingSlice } from './slices/row-editing-slice';
import { createRowExpansionSlice } from './slices/row-expansion-slice';
import { createRowSelectionSlice } from './slices/row-selection-slice';
import { createSearchSlice } from './slices/search-slice';
import { createSortingSlice } from './slices/sorting-slice';
import { createToolbarSlice } from './slices/toolbar-slice';
import { createViewPresetSlice } from './slices/view-preset-slice';

export interface StoreApi<TState> {
    getState: () => TState;
    setState: (
        updater:
            | Partial<TState>
            | ((prev: TState) => Partial<TState> | TState),
    ) => void;
    subscribe: (listener: (state: TState) => void) => () => void;
}

function mergeState<T extends object>(base: T, patch?: Partial<T>): T {
    if (!patch) return base;

    return {
        ...base,
        ...patch,
    };
}

function createInitialTableStoreState(
    options: CreateTableStoreOptions,
): TableStoreState {
    const defaults = createDefaultTableStoreState();
    const persisted = loadPersistedTableState(options.persistence);

    const provided = options.initialState ?? {};

    const mergedTopLevel: Partial<TableStoreState> = {
        ...persisted,
        ...provided,
    };

    return {
        ...defaults,
        ...persisted,
        ...provided,

        columnOrder: mergeState(
            defaults.columnOrder,
            mergedTopLevel.columnOrder,
        ),

        columnPinning: mergeState(
            defaults.columnPinning,
            mergedTopLevel.columnPinning,
        ),

        columnSizing: mergeState(
            defaults.columnSizing,
            mergedTopLevel.columnSizing,
        ),

        columnVisibility: mergeState(
            defaults.columnVisibility,
            mergedTopLevel.columnVisibility,
        ),

        filters: mergeState(
            defaults.filters,
            mergedTopLevel.filters,
        ),

        pagination: mergeState(
            defaults.pagination,
            mergedTopLevel.pagination,
        ),

        rowEditing: mergeState(
            defaults.rowEditing,
            mergedTopLevel.rowEditing,
        ),

        rowExpansion: mergeState(
            defaults.rowExpansion,
            mergedTopLevel.rowExpansion,
        ),

        rowSelection: mergeState(
            defaults.rowSelection,
            mergedTopLevel.rowSelection,
        ),

        search: mergeState(
            defaults.search,
            mergedTopLevel.search,
        ),

        sorting: mergeState(
            defaults.sorting,
            mergedTopLevel.sorting,
        ),

        toolbar: mergeState(
            defaults.toolbar,
            mergedTopLevel.toolbar,
        ),

        viewPresets:
            mergedTopLevel.viewPresets ?? defaults.viewPresets,

        activeViewPresetId:
            mergedTopLevel.activeViewPresetId ?? defaults.activeViewPresetId,
    };
}

export function createStoreApi<TState extends object>(
    initialState: TState,
): StoreApi<TState> {
    let state = initialState;
    const listeners = new Set<(state: TState) => void>();

    return {
        getState() {
            return state;
        },

        setState(updater) {
            const next =
                typeof updater === 'function'
                    ? updater(state)
                    : updater;

            state = {
                ...state,
                ...next,
            };

            listeners.forEach((listener) => listener(state));
        },

        subscribe(listener) {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        },
    };
}

export function createTableStore(
    options: CreateTableStoreOptions = {},
): StoreApi<TableStore> {
    const defaults = createDefaultTableStoreState();
    const initialState = createInitialTableStoreState(options);

    const api = createStoreApi<TableStore>({
        ...initialState,
    } as TableStore);

    const slices = {
        ...createColumnOrderSlice(api, defaults),
        ...createColumnPinningSlice(api, defaults),
        ...createColumnSizingSlice(api, defaults),
        ...createColumnVisibilitySlice(api, defaults),
        ...createFilterSlice(api, defaults),
        ...createPaginationSlice(api, defaults),
        ...createRowEditingSlice(api, defaults),
        ...createRowExpansionSlice(api, defaults),
        ...createRowSelectionSlice(api, defaults),
        ...createSearchSlice(api, defaults),
        ...createSortingSlice(api, defaults),
        ...createToolbarSlice(api, defaults),
        ...createViewPresetSlice(api, defaults),
    };

    api.setState(() => ({
        ...api.getState(),
        ...slices,
    }));

    attachTableStorePersistence(api, options.persistence);

    return api;
}
