import type {
    TableStoreState,
    ViewPreset,
    ViewPresetSlice,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

function applyPresetToState(
    prev: TableStoreState,
    preset: ViewPreset,
): Partial<TableStoreState> {
    return {
        columnOrder: preset.columnOrder ?? prev.columnOrder,
        columnPinning: preset.columnPinning ?? prev.columnPinning,
        columnSizing: preset.columnSizing ?? prev.columnSizing,
        columnVisibility: preset.columnVisibility ?? prev.columnVisibility,
        filters: preset.filters ?? prev.filters,
        pagination: preset.pagination ?? prev.pagination,
        rowExpansion: preset.rowExpansion ?? prev.rowExpansion,
        rowSelection: preset.rowSelection ?? prev.rowSelection,
        search: preset.search ?? prev.search,
        sorting: preset.sorting ?? prev.sorting,
        toolbar: preset.toolbar ?? prev.toolbar,
        activeViewPresetId: preset.id,
    };
}

export function createViewPresetSlice(
    api: StoreApi<TableStoreState & Partial<ViewPresetSlice>>,
    defaults: TableStoreState,
): ViewPresetSlice {
    return {
        setViewPresets(presets) {
            api.setState({
                viewPresets: [...presets],
            });
        },

        addViewPreset(preset) {
            api.setState((prev) => {
                const exists = prev.viewPresets.some((item) => item.id === preset.id);

                return {
                    viewPresets: exists
                        ? prev.viewPresets.map((item) =>
                            item.id === preset.id ? preset : item,
                        )
                        : [...prev.viewPresets, preset],
                };
            });
        },

        updateViewPreset(presetId, patch) {
            api.setState((prev) => ({
                viewPresets: prev.viewPresets.map((preset) =>
                    preset.id === presetId
                        ? {
                            ...preset,
                            ...patch,
                            id: preset.id,
                        }
                        : preset,
                ),
            }));
        },

        removeViewPreset(presetId) {
            api.setState((prev) => {
                const nextPresets = prev.viewPresets.filter(
                    (preset) => preset.id !== presetId,
                );

                return {
                    viewPresets: nextPresets,
                    activeViewPresetId:
                        prev.activeViewPresetId === presetId
                            ? null
                            : prev.activeViewPresetId,
                };
            });
        },

        setActiveViewPreset(presetId) {
            api.setState({
                activeViewPresetId: presetId,
            });
        },

        applyViewPreset(presetId) {
            api.setState((prev) => {
                const preset = prev.viewPresets.find((item) => item.id === presetId);

                if (!preset) {
                    return {};
                }

                return applyPresetToState(prev, preset);
            });
        },

        resetViewPresets() {
            api.setState({
                viewPresets: [...defaults.viewPresets],
                activeViewPresetId: defaults.activeViewPresetId,
            });
        },
    };
}
