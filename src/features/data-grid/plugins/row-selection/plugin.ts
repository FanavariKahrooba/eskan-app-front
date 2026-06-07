import type { RowSelectionState } from "../../core/types";

export interface RowSelectionPluginOptions {
    enabled?: boolean;
    multi?: boolean;
    onRowSelectionChange?: (state: RowSelectionState) => void;
}

export interface RowSelectionPlugin {
    key: 'row-selection';
    enabled: boolean;
    multi: boolean;
    toggleRow: (state: RowSelectionState, rowId: string) => RowSelectionState;
    selectRow: (state: RowSelectionState, rowId: string) => RowSelectionState;
    unselectRow: (state: RowSelectionState, rowId: string) => RowSelectionState;
    clearSelection: (state: RowSelectionState) => RowSelectionState;
}

export function createRowSelectionPlugin(
    options: RowSelectionPluginOptions = {},
): RowSelectionPlugin {
    const { enabled = true, multi = true, onRowSelectionChange } = options;

    return {
        key: 'row-selection',
        enabled,
        multi,

        toggleRow(state, rowId) {
            const current = !!state?.selectedRowIds?.[rowId];

            let selectedRowIds: Record<string, boolean>;

            if (current) {
                selectedRowIds = {
                    ...(state?.selectedRowIds ?? {}),
                    [rowId]: false,
                };
            } else if (multi) {
                selectedRowIds = {
                    ...(state?.selectedRowIds ?? {}),
                    [rowId]: true,
                };
            } else {
                selectedRowIds = {
                    [rowId]: true,
                };
            }

            const result: RowSelectionState = { selectedRowIds };
            onRowSelectionChange?.(result);
            return result;
        },

        selectRow(state, rowId) {
            const selectedRowIds = multi
                ? {
                    ...(state?.selectedRowIds ?? {}),
                    [rowId]: true,
                }
                : { [rowId]: true };

            const result: RowSelectionState = { selectedRowIds };
            onRowSelectionChange?.(result);
            return result;
        },

        unselectRow(state, rowId) {
            const selectedRowIds = {
                ...(state?.selectedRowIds ?? {}),
                [rowId]: false,
            };

            const result: RowSelectionState = { selectedRowIds };
            onRowSelectionChange?.(result);
            return result;
        },

        clearSelection() {
            const result: RowSelectionState = { selectedRowIds: {} };
            onRowSelectionChange?.(result);
            return result;
        },
    };
}
