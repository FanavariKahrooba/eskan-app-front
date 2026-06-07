import type {
    TableStoreState,
    ToolbarSlice,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createToolbarSlice(
    api: StoreApi<TableStoreState & Partial<ToolbarSlice>>,
    defaults: TableStoreState,
): ToolbarSlice {
    return {
        setToolbarState(toolbar) {
            api.setState((prev) => ({
                toolbar: {
                    ...prev.toolbar,
                    ...toolbar,
                },
            }));
        },

        setDensity(density) {
            api.setState((prev) => ({
                toolbar: {
                    ...prev.toolbar,
                    density,
                },
            }));
        },

        setFullscreen(fullscreen) {
            api.setState((prev) => ({
                toolbar: {
                    ...prev.toolbar,
                    isFullscreen: fullscreen,
                },
            }));
        },

        setColumnManagerOpen(open) {
            api.setState((prev) => ({
                toolbar: {
                    ...prev.toolbar,
                    isColumnManagerOpen: open,
                },
            }));
        },

        resetToolbar() {
            api.setState({
                toolbar: {
                    ...defaults.toolbar,
                },
            });
        },
    };
}
