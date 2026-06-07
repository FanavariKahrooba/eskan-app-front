import type {
    RowSelectionSlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createRowSelectionSlice(
    api: StoreApi<TableStoreState & Partial<RowSelectionSlice>>,
    defaults: TableStoreState,
): RowSelectionSlice {
    return {
        setSelectedRows(selectedRowIds) {
            api.setState({
                rowSelection: {
                    selectedRowIds: {
                        ...selectedRowIds,
                    },
                },
            });
        },

        toggleRowSelection(rowId) {
            api.setState((prev) => ({
                rowSelection: {
                    selectedRowIds: {
                        ...prev.rowSelection.selectedRowIds,
                        [rowId]: !prev.rowSelection.selectedRowIds[rowId],
                    },
                },
            }));
        },

        selectRow(rowId) {
            api.setState((prev) => ({
                rowSelection: {
                    selectedRowIds: {
                        ...prev.rowSelection.selectedRowIds,
                        [rowId]: true,
                    },
                },
            }));
        },

        deselectRow(rowId) {
            api.setState((prev) => ({
                rowSelection: {
                    selectedRowIds: {
                        ...prev.rowSelection.selectedRowIds,
                        [rowId]: false,
                    },
                },
            }));
        },

        clearRowSelection() {
            api.setState({
                rowSelection: {
                    selectedRowIds: {},
                },
            });
        },

        resetRowSelection() {
            api.setState({
                rowSelection: {
                    selectedRowIds: {
                        ...defaults.rowSelection.selectedRowIds,
                    },
                },
            });
        },
    };
}
