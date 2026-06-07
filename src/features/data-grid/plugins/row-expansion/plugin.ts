import type { RowDetailsState } from "../../core/types";

export interface RowExpansionPluginOptions {
    enabled?: boolean;
    accordion?: boolean;
    onRowExpansionChange?: (state: RowDetailsState) => void;
}

export interface RowExpansionPlugin {
    key: 'row-expansion';
    enabled: boolean;
    accordion: boolean;

    toggleRow: (state: RowDetailsState, rowId: string) => RowDetailsState;
    expandRow: (state: RowDetailsState, rowId: string) => RowDetailsState;
    collapseRow: (state: RowDetailsState, rowId: string) => RowDetailsState;
    collapseAll: (state: RowDetailsState) => RowDetailsState;
}

export function createRowExpansionPlugin(
    options: RowExpansionPluginOptions = {},
): RowExpansionPlugin {
    const {
        enabled = true,
        accordion = false,
        onRowExpansionChange,
    } = options;

    return {
        key: 'row-expansion',
        enabled,
        accordion,

        toggleRow(state, rowId) {
            if (!enabled) return state;

            const current = !!state?.expandedRowIds?.[rowId];

            let expandedRowIds: Record<string, boolean>;

            if (current) {
                expandedRowIds = {
                    ...(state?.expandedRowIds ?? {}),
                    [rowId]: false,
                };
            } else if (accordion) {
                expandedRowIds = {
                    [rowId]: true,
                };
            } else {
                expandedRowIds = {
                    ...(state?.expandedRowIds ?? {}),
                    [rowId]: true,
                };
            }

            const result: RowDetailsState = {
                ...state,
                expandedRowIds,
            };

            onRowExpansionChange?.(result);
            return result;
        },

        expandRow(state, rowId) {
            if (!enabled) return state;

            const expandedRowIds = accordion
                ? {
                    [rowId]: true,
                }
                : {
                    ...(state?.expandedRowIds ?? {}),
                    [rowId]: true,
                };

            const result: RowDetailsState = {
                ...state,
                expandedRowIds,
            };

            onRowExpansionChange?.(result);
            return result;
        },

        collapseRow(state, rowId) {
            if (!enabled) return state;

            const result: RowDetailsState = {
                ...state,
                expandedRowIds: {
                    ...(state?.expandedRowIds ?? {}),
                    [rowId]: false,
                },
            };

            onRowExpansionChange?.(result);
            return result;
        },

        collapseAll(state) {
            if (!enabled) return state;

            const result: RowDetailsState = {
                ...state,
                expandedRowIds: {},
            };

            onRowExpansionChange?.(result);
            return result;
        },
    };
}
