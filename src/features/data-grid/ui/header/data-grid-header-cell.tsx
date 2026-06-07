"use client";

import type { ReactNode, ThHTMLAttributes, MouseEventHandler } from "react";
import { motion } from "framer-motion";
import { DataGridIcon } from "../shared";

export type DataGridSortDirection = "asc" | "desc" | false;

export interface DataGridHeaderCellProps extends Omit<
  ThHTMLAttributes<HTMLTableCellElement>,
  "children"
> {
  id?: string;
  label?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  width?: number | string;
  minWidth?: number | string;
  align?: "start" | "center" | "end";
  sortable?: boolean;
  sortDirection?: DataGridSortDirection;
  resizable?: boolean;
  pinned?: "left" | "right" | false;
  selected?: boolean;
  onSort?: () => void;
  onResizeStart?: MouseEventHandler<HTMLDivElement>;
}

const alignClass = {
  start: "text-start justify-start",
  center: "text-center justify-center",
  end: "text-end justify-end",
};

export function DataGridHeaderCell({
  label,
  children,
  description,
  width,
  minWidth,
  align = "start",
  sortable,
  sortDirection = false,
  resizable,
  pinned = false,
  selected,
  className = "",
  onSort,
  onResizeStart,
  ...props
}: DataGridHeaderCellProps) {
  const content = label ?? children;

  const contentNode = sortable ? (
    <button
      type="button"
      onClick={onSort}
      className={[
        "flex min-w-0 items-center gap-2 rounded-xl outline-none",
        alignClass[align],
        "hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500/20",
      ].join(" ")}
    >
      <span className="min-w-0">
        <span className="block truncate">{content}</span>
        {description ? (
          <span className="mt-0.5 block truncate text-[10px] font-medium text-slate-400">
            {description}
          </span>
        ) : null}
      </span>

      <motion.span
        animate={{
          opacity: sortDirection ? 1 : 0.35,
          rotate: sortDirection === "desc" ? 180 : 0,
        }}
        className="shrink-0 text-slate-400"
      >
        <DataGridIcon
          name={sortDirection === "desc" ? "sortDesc" : "sortAsc"}
          size={15}
        />
      </motion.span>
    </button>
  ) : (
    <div
      className={["flex min-w-0 items-center gap-2", alignClass[align]].join(
        " ",
      )}
    >
      <span className="min-w-0">
        <span className="block truncate">{content}</span>
        {description ? (
          <span className="mt-0.5 block truncate text-[10px] font-medium text-slate-400">
            {description}
          </span>
        ) : null}
      </span>
    </div>
  );

  return (
    <th
      {...props}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
        ...props.style,
      }}
      className={[
        "group sticky top-0 z-20 border-b border-slate-200/80",
        "bg-white/85 px-4 py-3 text-xs font-bold text-slate-600",
        "backdrop-blur-xl transition-colors",
        pinned === "left"
          ? "left-0 z-30 shadow-[8px_0_18px_-18px_rgba(15,23,42,0.55)]"
          : "",
        pinned === "right"
          ? "right-0 z-30 shadow-[-8px_0_18px_-18px_-18px_rgba(15,23,42,0.55)]"
          : "",
        selected ? "bg-indigo-50/90 text-indigo-700" : "",
        className,
      ].join(" ")}
    >
      <div className="relative flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">{contentNode}</div>

        {resizable ? (
          <div
            onMouseDown={onResizeStart}
            className={[
              "absolute -end-4 top-1/2 h-7 w-2 -translate-y-1/2 cursor-col-resize",
              "rounded-full transition",
              "hover:bg-indigo-500/30 group-hover:bg-slate-300/60",
            ].join(" ")}
          />
        ) : null}
      </div>
    </th>
  );
}
