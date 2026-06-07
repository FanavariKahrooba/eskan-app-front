// src/features/data-grid/ui/table/draggable-header-cell.tsx

"use client";

import { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { ColumnDef, SortState } from "../../core/types";
import { cn } from "../../core/utils/cn";
import { tableTheme } from "../../core/theme/tokens";
import { ResizeHandle } from "./resize-handle";

type DraggableHeaderCellProps<TData> = {
  column: ColumnDef<TData>;
  sorting?: SortState[];
  onSort?: (columnId: string) => void;
  onResize?: (columnId: string, width: number) => void;
  enableReorder?: boolean;
  enableResize?: boolean;
};

export function DraggableHeaderCell<TData>({
  column,
  sorting,
  onSort,
  onResize,
  enableReorder,
  enableResize,
}: DraggableHeaderCellProps<TData>) {
  const sortable = column.sortable !== false && !!onSort;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: !enableReorder || column.reorderable === false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
  };

  const sortDirection = sorting?.find(
    (item) => item.field === column.id,
  )?.direction;

  const content = useMemo(() => {
    return column.renderHeader
      ? column.renderHeader({ column })
      : column.header;
  }, [column]);

  function handleResizeStart(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const th = (event.currentTarget.parentElement as HTMLElement) || null;
    if (!th) return;

    const startX = event.clientX;
    const startWidth = th.getBoundingClientRect().width;

    function handleMouseMove(moveEvent: MouseEvent) {
      const delta = moveEvent.clientX - startX;
      const nextWidth = Math.max(column.minWidth ?? 80, startWidth + delta);
      const boundedWidth = Math.min(column.maxWidth ?? 1000, nextWidth);
      onResize?.(column.id, boundedWidth);
    }

    function handleMouseUp() {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  return (
    <motion.th
      ref={setNodeRef}
      layout
      style={style}
      className={cn(
        "relative border-b px-3 py-2 text-left text-sm font-semibold",
        tableTheme.headerCell,
        isDragging && "z-10 opacity-70 shadow-lg",
        column.headerClassName,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {enableReorder && column.reorderable !== false ? (
          <button
            type="button"
            className="inline-flex cursor-grab items-center gap-2 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <span>{content}</span>
            {sortable && (
              <span className="text-xs opacity-60">
                {sortDirection === "asc"
                  ? "▲"
                  : sortDirection === "desc"
                    ? "▼"
                    : "↕"}
              </span>
            )}
          </button>
        ) : sortable ? (
          <button
            type="button"
            onClick={() => onSort?.(column.id)}
            className="inline-flex items-center gap-2"
          >
            <span>{content}</span>
            <span className="text-xs opacity-60">
              {sortDirection === "asc"
                ? "▲"
                : sortDirection === "desc"
                  ? "▼"
                  : "↕"}
            </span>
          </button>
        ) : (
          <span>{content}</span>
        )}
      </div>

      {enableResize && column.resizable !== false && (
        <ResizeHandle onMouseDown={handleResizeStart} />
      )}
    </motion.th>
  );
}
