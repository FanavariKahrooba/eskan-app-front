
export type ColumnVisibilityMap = Record<string, boolean>;


export interface ColumnVisibilityChangeParams {
    next: ColumnVisibilityState;
    previous: ColumnVisibilityState;
    columnId?: string;
}


export interface ColumnVisibilityState {
    /**
     * key: columnId
     * value: visible or hidden
     */
    visibility: ColumnVisibilityMap;
}


export const DEFAULT_COLUMN_VISIBILITY_STATE: ColumnVisibilityState = {
    visibility: {},
};