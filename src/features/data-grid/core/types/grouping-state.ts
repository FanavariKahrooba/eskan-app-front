export interface GroupingStateMap {
    columnIds: string[];
    expanded?: Record<string, boolean>;
}

export interface GroupingChangeParams {
    next: GroupingStateMap;
    previous: GroupingStateMap;
}

export interface GroupingState {
    /**
     * Ordered list of column ids used for grouping.
     */
    columnIds: string[];
}

export const DEFAULT_GROUPING_STATE: GroupingState = {
    columnIds: [],
};