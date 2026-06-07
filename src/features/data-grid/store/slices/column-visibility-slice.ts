import type {
    ColumnVisibilitySlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createColumnVisibilitySlice(
    api: StoreApi<TableStoreState & Partial<ColumnVisibilitySlice>>,
    defaults: TableStoreState,
): ColumnVisibilitySlice {
    return {
        setColumnVisibility(columnId, visible) {
            api.setState((prev) => ({
                columnVisibility: {
                    visibility: {
                        ...prev.columnVisibility.visibility,
                        [columnId]: visible,
                    },
                },
            }));
        },

        setManyColumnVisibility(visibility) {
            api.setState((prev) => ({
                columnVisibility: {
                    visibility: {
                        ...prev.columnVisibility.visibility,
                        ...visibility,
                    },
                },
            }));
        },

        showAllColumns() {
            const current = api.getState().columnVisibility.visibility;
            const next: Record<string, boolean> = {};

            for (const key of Object.keys(current)) {
                next[key] = true;
            }

            api.setState({
                columnVisibility: {
                    visibility: next,
                },
            });
        },

        hideAllColumns() {
            const current = api.getState().columnVisibility.visibility;
            const next: Record<string, boolean> = {};

            for (const key of Object.keys(current)) {
                next[key] = false;
            }

            api.setState({
                columnVisibility: {
                    visibility: next,
                },
            });
        },

        resetColumnVisibility() {
            api.setState({
                columnVisibility: {
                    visibility: {
                        ...defaults.columnVisibility.visibility,
                    },
                },
            });
        },
    };
}
