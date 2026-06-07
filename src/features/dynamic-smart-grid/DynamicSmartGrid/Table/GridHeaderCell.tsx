import { useMemo, useRef, useState } from "react";
import type { DragEvent, MouseEvent as ReactMouseEvent } from "react";
// import type { DynamicGridColumn } from "../DynamicSmartGrid.types";
import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

type GridHeaderCellProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  column: any;
};

export function GridHeaderCell<
  TData extends Record<string, unknown> = Record<string, unknown>,
>({ column }: GridHeaderCellProps<TData>) {
  const grid = useDynamicSmartGridContext<TData>();

  const {
    props,
    sorting,
    toggleSort,
    columnFilters,
    setColumnFilters,
    columnWidths,
    setColumnWidths,
    reorderColumn,
    columnPinning,
    getPinnedStyle,
  }: any = grid;

  const resizeStartRef = useRef<{
    startX: number;
    startWidth: number;
  } | null>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const activeSort = useMemo(() => {
    return sorting.find((sort: any) => sort.columnId === column.id);
  }, [sorting, column.id]);

  const canSort = props.enableSorting && column.enableSorting !== false;
  const canFilter =
    props.enableColumnFilters && column.enableFiltering !== false;
  const canResize =
    props.enableColumnResizing && column.enableResizing !== false;
  const canReorder =
    props.enableColumnReorder && column.enableReorder !== false;

  const width = columnWidths[column.id] ?? column.width ?? 160;
  const pinned = columnPinning[column.id] ?? column.pinned ?? false;

  const thStyle = {
    width,
    minWidth: column.minWidth ?? 80,
    maxWidth: column.maxWidth,
    ...getPinnedStyle(column.id, "header"),
  } as React.CSSProperties;

  const handleResizeMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    resizeStartRef.current = {
      startX: event.clientX,
      startWidth: width,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const delta = moveEvent.clientX - resizeStartRef.current.startX;
      const nextWidth = Math.max(
        column.minWidth ?? 80,
        Math.min(
          column.maxWidth ?? 800,
          resizeStartRef.current.startWidth + delta,
        ),
      );

      setColumnWidths((prev: any) => ({
        ...prev,
        [column.id]: nextWidth,
      }));
    };

    const handleMouseUp = () => {
      resizeStartRef.current = null;

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleDragStart = (event: DragEvent<HTMLTableCellElement>) => {
    if (!canReorder) return;

    event.dataTransfer.setData("text/plain", column.id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: DragEvent<HTMLTableCellElement>) => {
    if (!canReorder) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLTableCellElement>) => {
    if (!canReorder) return;

    event.preventDefault();
    setIsDraggingOver(false);

    const fromColumnId = event.dataTransfer.getData("text/plain");
    const toColumnId = column.id;

    if (!fromColumnId || fromColumnId === toColumnId) return;

    reorderColumn(fromColumnId, toColumnId);
  };

  const sortLabel = activeSort
    ? activeSort.direction === "asc"
      ? "↑"
      : "↓"
    : "↕";

  return (
    <th
      className={[
        "dsg-th",
        pinned ? `dsg-pinned dsg-pinned-${pinned}` : "",
        isDraggingOver ? "dsg-th-drag-over" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={thStyle}
      draggable={canReorder}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-column-id={column.id}
    >
      <div className="dsg-th-inner">
        <button
          type="button"
          className={canSort ? "dsg-th-title dsg-sortable" : "dsg-th-title"}
          onClick={() => {
            if (canSort) {
              toggleSort(column.id);
            }
          }}
        >
          <span className="dsg-th-label">{column.header}</span>

          {canSort && (
            <span
              className={
                activeSort ? "dsg-sort-indicator active" : "dsg-sort-indicator"
              }
            >
              {sortLabel}
            </span>
          )}
        </button>

        {column.description && (
          <span className="dsg-th-description">{column.description}</span>
        )}
      </div>

      {canFilter && (
        <div className="dsg-column-filter">
          <input
            value={columnFilters[column.id] ?? ""}
            onChange={(event) => {
              setColumnFilters((prev: any) => ({
                ...prev,
                [column.id]: event.target.value,
              }));
            }}
            placeholder="فیلتر..."
            className="dsg-input dsg-column-filter-input"
          />
        </div>
      )}

      {canResize && (
        <div
          className="dsg-column-resizer"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </th>
  );
}
