export type SortDirection = 'asc' | 'desc';

export interface SortItem {
    columnId: string;
    direction: SortDirection;
}

export interface SortState {
    items: SortItem[];
}

export const DEFAULT_SORT_STATE: SortState = {
    items: [],
};
