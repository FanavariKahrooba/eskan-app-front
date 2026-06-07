// src/features/data-grid/ui/table/table-header.tsx

"use client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { ColumnDef, SortState } from "../../core/types";
import { cn } from "../../core/utils/cn";
import { tableTheme } from "../../core/theme/tokens";
import { DraggableHeaderCell } from "./draggable-header-cell";

type TableHeaderProps<TData> = {
  columns: ColumnDef<TData>[];
  className?: string;
  sorting?: SortState[];
  onSort?: (columnId: string) => void;
  onColumnOrderChange?: (order: string[]) => void;
  onColumnResize?: (columnId: string, width: number) => void;
  enableReorder?: boolean;
  enableResize?: boolean;
};

export function TableHeader<TData>({
  columns,
  className,
  sorting,
  onSort,
  onColumnOrderChange,
  onColumnResize,
  enableReorder,
  enableResize,
}: TableHeaderProps<TData>) {
  const sensors = useSensors(useSensor(PointerSensor));
  const ids = columns.map((column) => column.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const next = arrayMove(ids, oldIndex, newIndex);
    onColumnOrderChange?.(next);
  }

  const row = (
    <tr>
      {columns.map((column) => (
        <DraggableHeaderCell
          key={column.id}
          column={column}
          sorting={sorting}
          onSort={onSort}
          onResize={onColumnResize}
          enableReorder={enableReorder}
          enableResize={enableResize}
        />
      ))}
    </tr>
  );

  if (!enableReorder) {
    return <thead className={cn(tableTheme.header, className)}>{row}</thead>;
  }

  return (
    <thead className={cn(tableTheme.header, className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
          {row}
        </SortableContext>
      </DndContext>
    </thead>
  );
}
