"use client"
import { useEffect, useMemo } from 'react';

import type {
    DataGridPlugin,
    DataGridPluginSetupResult,
    DataGridTableInstance,
} from '../core/types';

function normalizeResult(
    result?: DataGridPluginSetupResult | void,
): DataGridPluginSetupResult {
    return result ?? {};
}

export function useDataGridPlugins(
    instance: DataGridTableInstance,
    plugins?: readonly DataGridPlugin[],
): DataGridPluginSetupResult {
    const activePlugins = useMemo(
        () => (plugins?.length ? [...plugins] : [...instance.plugins]),
        [instance.plugins, plugins],
    );

    const setupResults = useMemo(
        () =>
            activePlugins.map((plugin) => ({
                plugin,
                result: normalizeResult(plugin.setup?.(instance)),
            })),
        [activePlugins, instance],
    );

    useEffect(() => {
        const cleanups = setupResults
            .map((item) => item.result.cleanup)
            .filter((cleanup): cleanup is () => void => typeof cleanup === 'function');

        return () => {
            for (const cleanup of cleanups) {
                cleanup();
            }
        };
    }, [setupResults]);

    return useMemo<DataGridPluginSetupResult>(() => {
        return setupResults.reduce<DataGridPluginSetupResult>(
            (acc, item) => {
                if (item.result.api) {
                    acc.api = {
                        ...(acc.api ?? {}),
                        ...item.result.api,
                    };
                }

                if (item.result.meta) {
                    acc.meta = {
                        ...(acc.meta ?? {}),
                        ...item.result.meta,
                    };
                }

                return acc;
            },
            {},
        );
    }, [setupResults]);
}
