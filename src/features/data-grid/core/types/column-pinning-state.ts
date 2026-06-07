export interface ColumnPinningState {
    left: string[];
    right: string[];
}

export interface ColumnPinningChangeParams {
    next: ColumnPinningState;
    previous: ColumnPinningState;
}


export const DEFAULT_COLUMN_PINNING_STATE: ColumnPinningState = {
    left: [],
    right: [],
};