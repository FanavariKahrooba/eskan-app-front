'use client'
import { useEffect } from "react";
import {
    DynamicGridDensity,
} from "../DynamicSmartGrid";

import {
    readGridStorage,
    removeGridStorage,
    writeGridStorage,
} from "../utils/dynamic-grid-storage";

export interface DynamicGridPersistedState {
    orderedColumnIds?: string[];
    columnWidths?: Record<string, number>;
    columnVisibility?: Record<string, boolean>;
    columnPinning?: Record<string, any>;
    density?: DynamicGridDensity;
    sorting?: any[];
}

export function getDynamicGridPersistedState(key?: string) {
    if (!key) return null;

    return readGridStorage<DynamicGridPersistedState | null>(key, null);
}

export function useDynamicGridPersistence(params: {
    enabled?: boolean;
    persistenceKey?: string;

    state: DynamicGridPersistedState;
}) {
    const { enabled, persistenceKey, state } = params;

    useEffect(() => {
        if (!enabled || !persistenceKey) return;

        writeGridStorage(persistenceKey, state);
    }, [
        enabled,
        persistenceKey,
        state.orderedColumnIds,
        state.columnWidths,
        state.columnVisibility,
        state.columnPinning,
        state.density,
        state.sorting,
    ]);
}

export function resetDynamicGridPersistence(key?: string) {
    if (!key) return;
    removeGridStorage(key);
}
