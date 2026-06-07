import type {
    RowExpansionSlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createRowExpansionSlice(
    api: StoreApi<TableStoreState & Partial<RowExpansionSlice>>,
    defaults: TableStoreState,
): RowExpansionSlice {
    return {
        setExpandedRows(expandedRowIds) {
            api.setState({
                rowExpansion: {
                    expandedRowIds: {
                        ...expandedRowIds,
                    },
                },
            });
        },

        toggleExpandedRow(rowId) {
            api.setState((prev) => ({
                rowExpansion: {
                    expandedRowIds: {
                        ...prev.rowExpansion.expandedRowIds,
                        [rowId]: !prev.rowExpansion.expandedRowIds[rowId],
                    },
                },
            }));
        },

        expandRow(rowId) {
            api.setState((prev) => ({
                rowExpansion: {
                    expandedRowIds: {
                        ...prev.rowExpansion.expandedRowIds,
                        [rowId]: true,
                    },
                },
            }));
        },

        collapseRow(rowId) {
            api.setState((prev) => ({
                rowExpansion: {
                    expandedRowIds: {
                        ...prev.rowExpansion.expandedRowIds,
                        [rowId]: false,
                    },
                },
            }));
        },

        collapseAllRows() {
            api.setState({
                rowExpansion: {
                    expandedRowIds: {},
                },
            });
        },

        resetRowExpansion() {
            api.setState({
                rowExpansion: {
                    expandedRowIds: {
                        ...defaults.rowExpansion.expandedRowIds,
                    },
                },
            });
        },
    };
}
