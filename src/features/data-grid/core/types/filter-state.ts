export type FilterOperator =
    | 'eq'
    | 'neq'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'between'
    | 'isEmpty'
    | 'isNotEmpty';

export interface FilterItem {
    id: string;
    columnId: string;
    operator: string;
    value: unknown;
}

export interface FilterState {
    /**
     * Global search text.
     */
    search: string;

    /**
     * Column filters.
     */
    items: FilterItem[];
}


export interface FilterState {
    items: FilterItem[];
    logicOperator: 'and' | 'or';
}
export const DEFAULT_FILTER_STATE: FilterState = {
    search: '',
    items: [],
    logicOperator: "and"
};
