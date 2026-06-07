import type {
    RowEditingSlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

function getCellKey(rowId: string, columnId: string): string {
    return `${rowId}::${columnId}`;
}

export function createRowEditingSlice(
    api: StoreApi<TableStoreState & Partial<RowEditingSlice>>,
    defaults: TableStoreState,
): RowEditingSlice {
    return {
        beginEditCell(rowId, columnId, initialValue) {
            const cellKey = getCellKey(rowId, columnId);

            api.setState((prev) => ({
                rowEditing: {
                    activeCell: {
                        rowId,
                        columnId,
                    },
                    draftValues: {
                        ...prev.rowEditing.draftValues,
                        [cellKey]: initialValue,
                    },
                },
            }));
        },

        setEditingValue(rowId, columnId, value) {
            const cellKey = getCellKey(rowId, columnId);

            api.setState((prev) => ({
                rowEditing: {
                    activeCell:
                        prev.rowEditing.activeCell ?? {
                            rowId,
                            columnId,
                        },
                    draftValues: {
                        ...prev.rowEditing.draftValues,
                        [cellKey]: value,
                    },
                },
            }));
        },

        commitEditingCell() {
            api.setState((prev) => {
                const activeCell = prev.rowEditing.activeCell;

                if (!activeCell) {
                    return {
                        rowEditing: {
                            ...prev.rowEditing,
                        },
                    };
                }

                const cellKey = getCellKey(activeCell.rowId, activeCell.columnId);
                const draftValues = { ...prev.rowEditing.draftValues };

                delete draftValues[cellKey];

                return {
                    rowEditing: {
                        activeCell: null,
                        draftValues,
                    },
                };
            });
        },

        cancelEditingCell() {
            api.setState((prev) => {
                const activeCell = prev.rowEditing.activeCell;

                if (!activeCell) {
                    return {
                        rowEditing: {
                            ...prev.rowEditing,
                        },
                    };
                }

                const cellKey = getCellKey(activeCell.rowId, activeCell.columnId);
                const draftValues = { ...prev.rowEditing.draftValues };

                delete draftValues[cellKey];

                return {
                    rowEditing: {
                        activeCell: null,
                        draftValues,
                    },
                };
            });
        },

        clearEditingDrafts() {
            api.setState({
                rowEditing: {
                    activeCell: null,
                    draftValues: {
                        ...defaults.rowEditing.draftValues,
                    },
                },
            });
        },
    };
}
