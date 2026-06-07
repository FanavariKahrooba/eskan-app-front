"use client"
import { useEffect } from 'react';

import {
    clearPersistedTableState,
    persistTableState,
} from '../store';

import type {
    DataGridTableInstance,
    TableStorePersistenceOptions,
} from '../core/types';

export interface UseTablePersistenceResult {
    clearPersistence: () => void;
    persistNow: () => void;
}

export function useTablePersistence(
    instance: DataGridTableInstance,
    options?: TableStorePersistenceOptions,
): UseTablePersistenceResult {
    useEffect(() => {
        if (!options?.enabled) {
            return;
        }

        const unsubscribe = instance.store.subscribe((state) => {
            persistTableState(state, options);
        });

        return unsubscribe;
    }, [instance, options]);

    return {
        clearPersistence() {
            clearPersistedTableState(options);
        },

        persistNow() {
            persistTableState(instance.store.getState(), options);
        },
    };
}
