export type RowSelectionMap = Record<string, boolean>;

export interface RowSelectionChangeParams {
    next: RowSelectionMap;
    previous: RowSelectionMap;
    rowId?: string;
}


export interface RowSelectionState {
    /**
     * key: rowId
     * value: selected or not
     */
    selectedRowIds: RowSelectionMap;
}


export const DEFAULT_ROW_SELECTION_STATE: RowSelectionState = {
    selectedRowIds: {},
};