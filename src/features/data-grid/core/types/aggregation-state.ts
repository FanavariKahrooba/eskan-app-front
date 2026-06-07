export type AggregationType =
    | 'count'
    | 'sum'
    | 'avg'
    | 'min'
    | 'max'
    | 'first'
    | 'last';

export interface AggregationDefinition {
    /**
     * Column id that should be aggregated.
     */
    columnId: string;

    /**
     * Aggregation function.
     */
    type: AggregationType;

    /**
     * Optional custom output key.
     *
     * If not provided, engine can use:
     * `${columnId}.${type}`
     */
    id?: string;
}

export interface AggregationState {
    items: AggregationDefinition[];
}

export const DEFAULT_AGGREGATION_STATE: AggregationState = {
    items: [],
};
