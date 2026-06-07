
export interface ColumnOrderChangeParams {
    next: ColumnOrderState;
    previous: ColumnOrderState;
}

export interface ColumnOrderState {
    orderedColumnIds: string[];
}

export const DEFAULT_COLUMN_ORDER_STATE: ColumnOrderState = {
    orderedColumnIds: [],
};