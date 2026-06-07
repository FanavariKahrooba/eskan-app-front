"use client"
import { useMemo, useRef } from 'react';

import type {
    DataGridPlugin,
    DataGridSchema,
    DataGridTableInstance,
} from '../core/types';

import { createTableStore } from '../store';

function createPluginMap(
    plugins?: readonly DataGridPlugin[],
): Record<string, DataGridPlugin> {
    if (!plugins?.length) {
        return {};
    }

    return plugins.reduce<Record<string, DataGridPlugin>>((acc, plugin) => {
        acc[plugin.name || 0] = plugin;
        return acc;
    }, {});
}

export function useTableInstance(
    options: any,
): DataGridTableInstance {
    const {
        tableId,
        schema,
        initialState,
        persistence,
        plugins = [],
        api,
        events,
        virtualization,
        server,
        meta,
    } = options;

    const storeRef: any = useRef<ReturnType<typeof createTableStore> | null>(null);

    if (!storeRef?.current) {
        storeRef.current = createTableStore({
            initialState,
            persistence,
        });
    }

    const pluginMap = useMemo(
        () => createPluginMap(plugins),
        [plugins],
    );

    const instance = useMemo<DataGridTableInstance>(
        () => ({
            tableId,
            schema: schema as DataGridSchema,
            store: storeRef?.current!,
            plugins: [...plugins],
            pluginMap,
            api,
            events,
            virtualization,
            server,
            meta,
        }),
        [
            api,
            events,
            meta,
            pluginMap,
            plugins,
            schema,
            server,
            tableId,
            virtualization,
        ],
    );

    return instance;
}
