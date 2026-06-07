import type { ColumnSizingState } from "../../core/types";
import type { ColumnResizePlugin } from './plugin';

export interface UseColumnResizeResult {
    activeColumnId: string | null;
    startX: number | null;
    startWidth: number | null;
    beginResize: (columnId: string, clientX: number, currentWidth: number) => void;
    updateResize: (state: ColumnSizingState, clientX: number) => ColumnSizingState;
    endResize: () => void;
    cancelResize: () => void;
}

export function useColumnResize(
    plugin: ColumnResizePlugin,
): UseColumnResizeResult {
    let activeColumnId: string | null = null;
    let startX: number | null = null;
    let startWidth: number | null = null;

    return {
        get activeColumnId() {
            return activeColumnId;
        },

        get startX() {
            return startX;
        },

        get startWidth() {
            return startWidth;
        },

        beginResize(columnId: string, clientX: number, currentWidth: number) {
            if (!plugin.enabled) return;
            activeColumnId = columnId;
            startX = clientX;
            startWidth = currentWidth;
        },

        updateResize(state: ColumnSizingState, clientX: number) {
            if (
                !plugin.enabled ||
                !activeColumnId ||
                startX == null ||
                startWidth == null
            ) {
                return state;
            }

            const delta = clientX - startX;
            const nextWidth = startWidth + delta;

            return plugin.resizeColumn(state, {
                columnId: activeColumnId,
                width: nextWidth,
            });
        },

        endResize() {
            activeColumnId = null;
            startX = null;
            startWidth = null;
        },

        cancelResize() {
            activeColumnId = null;
            startX = null;
            startWidth = null;
        },
    };
}
