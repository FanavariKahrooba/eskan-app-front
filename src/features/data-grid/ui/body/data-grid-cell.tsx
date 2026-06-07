'use client';
import type { ReactNode, TdHTMLAttributes } from "react";

export interface DataGridCellProps extends Omit<
  TdHTMLAttributes<HTMLTableCellElement>,
  "children"
> {
  children?: ReactNode;
  align?: "start" | "center" | "end";
  width?: number | string;
  minWidth?: number | string;
  pinned?: "left" | "right" | false;
  muted?: boolean;
}
const alignClass = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

export function DataGridCell({
  children,
  align = "start",
  width,
  minWidth,
  pinned = false,
  muted,
  className = "",
  title,
}: DataGridCellProps) {
  return (
    <td
      title={title}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
      }}
      className={[
        "border-b border-slate-100 px-4 py-3 text-sm",
        "text-slate-700 transition-colors",
        "group-hover:border-slate-200",
        alignClass[align],
        muted ? "text-slate-400" : "",
        pinned ? "sticky z-10 bg-inherit backdrop-blur-xl" : "",
        pinned === "left"
          ? "left-0 shadow-[8px_0_18px_-18px_rgba(15,23,42,0.55)]"
          : "",
        pinned === "right"
          ? "right-0 shadow-[-8px_0_18px_-18px_rgba(15,23,42,0.55)]"
          : "",
        className,
      ].join(" ")}
    >
      <div className="min-w-0 truncate">{children}</div>
    </td>
  );
}
