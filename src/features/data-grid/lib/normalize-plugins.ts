import type { DataGridPlugin } from '../core/types';

export interface NormalizePluginsOptions {
    enabledPluginIds?: string[];
    disabledPluginIds?: string[];
}

function getPluginId(plugin: DataGridPlugin): string {
    return String((plugin as any).id ?? (plugin as any).name);
}

function getPluginPriority(plugin: DataGridPlugin): number {
    return Number((plugin as any).priority ?? 0);
}

function isPluginEnabled(
    plugin: DataGridPlugin,
    options: NormalizePluginsOptions,
): boolean {
    const id = getPluginId(plugin);
    const pluginEnabled = (plugin as any).enabled;

    if (options.disabledPluginIds?.includes(id)) return false;

    if (
        options.enabledPluginIds &&
        options.enabledPluginIds.length > 0 &&
        !options.enabledPluginIds.includes(id)
    ) {
        return false;
    }

    if (typeof pluginEnabled === 'boolean') {
        return pluginEnabled;
    }

    return true;
}

export function normalizePlugins(
    plugins: DataGridPlugin[] = [],
    options: NormalizePluginsOptions = {},
): DataGridPlugin[] {
    const seen = new Set<string>();

    return plugins
        .filter((plugin) => {
            const id = getPluginId(plugin);

            if (!id) return false;
            if (seen.has(id)) return false;

            seen.add(id);

            return isPluginEnabled(plugin, options);
        })
        .sort((a, b) => getPluginPriority(a) - getPluginPriority(b));
}
