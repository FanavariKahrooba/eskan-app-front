"use client";

import { useEffect, useMemo } from "react";

import type {
    DataGridPlugin,
    DataGridPluginContext,
    DataGridPluginSetupResult,
    DataGridTableInstance,
    DataGridState,
    DataGridAction,
    DataGridApi,
} from "../core/types";

function normalizeSetupResult(
    result: void | (() => void),
): DataGridPluginSetupResult {
    if (typeof result === "function") {
        return {
            cleanup: result,
        };
    }

    return {};
}

export function useDataGridPlugins<TRow = unknown>(
    instance: DataGridTableInstance,
    plugins?: readonly DataGridPlugin<TRow>[],
): DataGridPluginSetupResult {
    const activePlugins = useMemo(
        () =>
            (plugins?.length ? [...plugins] : [...instance.plugins])
                .filter((plugin) => plugin.enabled !== false)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) as DataGridPlugin<TRow>[],
        [instance.plugins, plugins],
    );

    const context = useMemo<DataGridPluginContext<TRow>>(() => {
        const store = instance.store as unknown as {
            getState: () => DataGridState;
            setState?: (state: Partial<DataGridState>) => void;
        };

        return {
            api: (instance as unknown as { api: DataGridApi<TRow> }).api,

            getState: () => {
                return store.getState();
            },

            setState: (state: Partial<DataGridState>) => {
                if (typeof store.setState === "function") {
                    store.setState(state);
                    return;
                }

                const currentState = store.getState() as unknown as {
                    setState?: (state: Partial<DataGridState>) => void;
                };

                currentState.setState?.(state);
            },

            dispatch: (action: DataGridAction) => {
                const currentState = store.getState() as unknown as {
                    dispatch?: (action: DataGridAction) => void;
                };

                currentState.dispatch?.(action);
            },

            rows: (() => {
                const state = store.getState() as unknown as {
                    rows?: TRow[];
                    data?: TRow[];
                };

                return state.rows ?? state.data ?? [];
            })(),

            meta: {},
        };
    }, [instance]);

    const setupResults = useMemo(
        () =>
            activePlugins.map((plugin) => {
                const result = plugin.setup?.(context);

                return {
                    plugin,
                    result: normalizeSetupResult(result),
                };
            }),
        [activePlugins, context],
    );

    useEffect(() => {
        for (const plugin of activePlugins) {
            plugin.onInit?.(context);
        }

        const cleanups = setupResults
            .map((item) => item.result.cleanup)
            .filter((cleanup): cleanup is () => void => typeof cleanup === "function");

        return () => {
            for (const cleanup of cleanups) {
                cleanup();
            }

            for (const plugin of [...activePlugins].reverse()) {
                plugin.onDestroy?.(context);
            }
        };
    }, [activePlugins, context, setupResults]);

    return useMemo<DataGridPluginSetupResult>(() => {
        return {
            meta: context.meta,
            cleanup: () => {
                for (const item of setupResults) {
                    item.result.cleanup?.();
                }
            },
        };
    }, [context.meta, setupResults]);
}
