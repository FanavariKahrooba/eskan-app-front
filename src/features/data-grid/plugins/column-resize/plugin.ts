import type { ColumnSizingState } from "../../core/types";

export interface ColumnResizePluginOptions {
    enabled?: boolean;
    minWidth?: number;
    maxWidth?: number;
    onColumnSizingChange?: (state: ColumnSizingState) => void;
}

export interface ResizeColumnOptions {
    columnId: string;
    width: number;
}

export interface ColumnResizePlugin {
    key: 'column-resize';
    enabled: boolean;
    minWidth: number;
    maxWidth: number;
    resizeColumn: (
        state: ColumnSizingState,
        options: ResizeColumnOptions,
    ) => ColumnSizingState;
}

export function createColumnResizePlugin(
    options: ColumnResizePluginOptions = {},
): ColumnResizePlugin {
    const {
        enabled = true,
        minWidth = 60,
        maxWidth = 1000,
        onColumnSizingChange,
    } = options;

    return {
        key: 'column-resize',
        enabled,
        minWidth,
        maxWidth,

        resizeColumn(state, { columnId, width }) {
            const safeWidth = Math.max(minWidth, Math.min(maxWidth, width));

            const result: ColumnSizingState = {
                ...state,
                sizes: {
                    ...(state?.sizes ?? {}),
                    [columnId]: safeWidth,
                },
            };

            onColumnSizingChange?.(result);
            return result;
        },
    };
}
