import { ColumnOrderState } from "../../core/types";
import type { ColumnDndPlugin } from './plugin';

export interface UseColumnDndResult {
    isDragging: boolean;
    draggedColumnId: string | null;
    targetColumnId: string | null;
    startDrag: (columnId: string) => void;
    enterTarget: (columnId: string) => void;
    endDrag: (state: ColumnOrderState) => ColumnOrderState;
    cancelDrag: () => void;
}

export function useColumnDnd(plugin: ColumnDndPlugin): UseColumnDndResult {
    let draggedColumnId: string | null = null;
    let targetColumnId: string | null = null;
    let isDragging = false;

    return {
        get isDragging() {
            return isDragging;
        },

        get draggedColumnId() {
            return draggedColumnId;
        },

        get targetColumnId() {
            return targetColumnId;
        },

        startDrag(columnId: string) {
            if (!plugin.enabled) return;
            draggedColumnId = columnId;
            targetColumnId = null;
            isDragging = true;
        },

        enterTarget(columnId: string) {
            if (!plugin.enabled || !isDragging) return;
            targetColumnId = columnId;
        },

        endDrag(state: ColumnOrderState) {
            if (!plugin.enabled || !draggedColumnId || !targetColumnId) {
                draggedColumnId = null;
                targetColumnId = null;
                isDragging = false;
                return state;
            }

            const next = plugin.moveColumn(state, draggedColumnId, targetColumnId);

            draggedColumnId = null;
            targetColumnId = null;
            isDragging = false;

            return next;
        },

        cancelDrag() {
            draggedColumnId = null;
            targetColumnId = null;
            isDragging = false;
        },
    };
}
