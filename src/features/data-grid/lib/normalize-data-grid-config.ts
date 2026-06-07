import { DataGridConfig } from '@/components/dynamic-table/features';
import {
    DEFAULT_DATA_GRID_CONFIG,
    mergeFeatureFlags,
} from '../constants';
import { createDefaultTableState } from './create-default-table-state';
import { normalizeColumns } from './normalize-columns';
import { normalizePlugins } from './normalize-plugins';

export function normalizeDataGridConfig<TRow>(
    config: DataGridConfig<TRow>,
): DataGridConfig<TRow> {
    const cfg = config as any;

    const normalized = {
        ...DEFAULT_DATA_GRID_CONFIG,
        ...cfg,

        id: cfg.id ?? DEFAULT_DATA_GRID_CONFIG.id,

        columns: normalizeColumns(cfg.columns ?? [], {
            defaultWidth: cfg?.sizing?.columnWidth,
            defaultMinWidth: cfg?.sizing?.minColumnWidth,
            defaultMaxWidth: cfg?.sizing?.maxColumnWidth,
        }),

        data: cfg.data ?? [],

        features: mergeFeatureFlags(cfg.features),

        initialState: createDefaultTableState({
            initialState: cfg.initialState,
        }),

        pagination: {
            ...DEFAULT_DATA_GRID_CONFIG.pagination,
            ...(cfg.pagination ?? {}),
        },

        sizing: {
            ...DEFAULT_DATA_GRID_CONFIG.sizing,
            ...(cfg.sizing ?? {}),
        },

        virtualization: {
            ...DEFAULT_DATA_GRID_CONFIG.virtualization,
            ...(cfg.virtualization ?? {}),
        },

        search: {
            ...DEFAULT_DATA_GRID_CONFIG.search,
            ...(cfg.search ?? {}),
        },

        server: {
            ...DEFAULT_DATA_GRID_CONFIG.server,
            ...(cfg.server ?? {}),
        },

        messages: {
            ...DEFAULT_DATA_GRID_CONFIG.messages,
            ...(cfg.messages ?? {}),
        },

        plugins: normalizePlugins(cfg.plugins ?? []),
    };

    return normalized as DataGridConfig<TRow>;
}
