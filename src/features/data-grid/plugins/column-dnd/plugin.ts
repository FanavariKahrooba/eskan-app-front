import { ColumnOrderState } from "../../core/types";

export interface ColumnDndPluginOptions {
    enabled?: boolean;
    onColumnOrderChange?: (state: ColumnOrderState) => void;
}

export interface ColumnDndPlugin {
    key: 'column-dnd';
    enabled: boolean;
    moveColumn: (
        state: ColumnOrderState,
        fromColumnId: string,
        toColumnId: string,
    ) => ColumnOrderState;
}

export function createColumnDndPlugin(
    options: ColumnDndPluginOptions = {},
): ColumnDndPlugin {
    const { enabled = true, onColumnOrderChange } = options;

    return {
        key: 'column-dnd',
        enabled,

        moveColumn(state, fromColumnId, toColumnId) {
            const current = state?.orderedColumnIds ?? [];

            if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) {
                return state;
            }

            const fromIndex = current.indexOf(fromColumnId);
            const toIndex = current.indexOf(toColumnId);

            if (fromIndex === -1 || toIndex === -1) {
                return state;
            }

            const next = [...current];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);

            const result: ColumnOrderState = {
                ...state,
                orderedColumnIds: next,
            };

            onColumnOrderChange?.(result);
            return result;
        },
    };
}
