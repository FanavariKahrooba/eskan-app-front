import type {
    TableStore,
    TableStorePersistenceOptions,
    TableStoreState,
} from './table-store.types';
import type { StoreApi } from './create-table-store';

const DEFAULT_STORAGE_KEY = 'data-grid.table-store';

function getDefaultStorage():
    | Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
    | undefined {
    if (typeof globalThis === 'undefined') {
        return undefined;
    }

    const maybeWindow = globalThis as typeof globalThis & {
        localStorage?: Storage;
    };

    return maybeWindow.localStorage;
}

export function defaultPartializeTableState(
    state: TableStoreState,
): Partial<TableStoreState> {
    return {
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnSizing: state.columnSizing,
        columnVisibility: state.columnVisibility,
        filters: state.filters,
        pagination: state.pagination,
        rowExpansion: state.rowExpansion,
        rowSelection: state.rowSelection,
        search: state.search,
        sorting: state.sorting,
        toolbar: state.toolbar,
        viewPresets: state.viewPresets,
        activeViewPresetId: state.activeViewPresetId,
    };
}

export function loadPersistedTableState(
    options: TableStorePersistenceOptions = {},
): Partial<TableStoreState> | undefined {
    const {
        enabled = false,
        storageKey = DEFAULT_STORAGE_KEY,
        storage = getDefaultStorage(),
    } = options;

    if (!enabled || !storage) {
        return undefined;
    }

    try {
        const raw = storage.getItem(storageKey);

        if (!raw) {
            return undefined;
        }

        return JSON.parse(raw) as Partial<TableStoreState>;
    } catch {
        return undefined;
    }
}

export function persistTableState(
    state: TableStoreState,
    options: TableStorePersistenceOptions = {},
): void {
    const {
        enabled = false,
        storageKey = DEFAULT_STORAGE_KEY,
        storage = getDefaultStorage(),
        partialize = defaultPartializeTableState,
    } = options;

    if (!enabled || !storage) {
        return;
    }

    try {
        const partialState = partialize(state);
        storage.setItem(storageKey, JSON.stringify(partialState));
    } catch {
        // persistence should never break table runtime
    }
}

export function clearPersistedTableState(
    options: TableStorePersistenceOptions = {},
): void {
    const {
        enabled = false,
        storageKey = DEFAULT_STORAGE_KEY,
        storage = getDefaultStorage(),
    } = options;

    if (!enabled || !storage) {
        return;
    }

    try {
        storage.removeItem(storageKey);
    } catch {
        // ignore storage failures
    }
}

export function attachTableStorePersistence(
    api: StoreApi<TableStore>,
    options: TableStorePersistenceOptions = {},
): () => void {
    const { enabled = false } = options;

    if (!enabled) {
        return () => undefined;
    }

    return api.subscribe((state) => {
        persistTableState(state, options);
    });
}
