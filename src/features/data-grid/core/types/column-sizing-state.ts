export type ColumnSizingStateMap = Record<string, number>;
export interface ColumnSizingState {
    sizes: Record<string, number>;
}
export interface ColumnSizingInfo {
    columnId: string;
    deltaOffset: number;
    startOffset: number;
    startSize: number;
    isResizingColumn: boolean;
}

export interface ColumnSizingChangeParams {
    next: ColumnSizingStateMap;
    previous: ColumnSizingStateMap;
    columnId?: string;
}
