"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { EyeOff, Expand, GripVertical, Shrink } from "lucide-react";
import type { ShellItemSize } from "./page-shell-types";

interface PageShellCardProps {
  title: string;
  description?: string;
  size: ShellItemSize;
  children: React.ReactNode;
  dragging?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  hideable?: boolean;
  onHide?: () => void;
  onResizeUp?: () => void;
  onResizeDown?: () => void;
  dragHandleProps?: Record<string, any>;
  headerActions?: React.ReactNode;
}

export const PageShellCard = memo(function PageShellCard({
  title,
  description,
  size,
  children,
  dragging = false,
  draggable = true,
  resizable = true,
  hideable = true,
  onHide,
  onResizeUp,
  onResizeDown,
  dragHandleProps,
  headerActions,
}: PageShellCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={[
        "relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border",
        "border-zinc-200 bg-white shadow-sm transition-all duration-200",
        "dark:border-zinc-800 dark:bg-zinc-950",
        dragging
          ? "z-50 rotate-[1deg] shadow-2xl ring-2 ring-blue-500/25"
          : "hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          {headerActions}

          {resizable && onResizeDown ? (
            <button
              type="button"
              onClick={onResizeDown}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label={`کوچک کردن ${title}`}
              title="کوچک‌تر"
            >
              <Shrink className="h-4 w-4" />
            </button>
          ) : null}

          {resizable && onResizeUp ? (
            <button
              type="button"
              onClick={onResizeUp}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label={`بزرگ کردن ${title}`}
              title="بزرگ‌تر"
            >
              <Expand className="h-4 w-4" />
            </button>
          ) : null}

          {hideable && onHide ? (
            <button
              type="button"
              onClick={onHide}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              aria-label={`مخفی کردن ${title}`}
              title="مخفی کردن"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          ) : null}

          {draggable ? (
            <button
              type="button"
              className="inline-flex h-8 w-8 cursor-grab items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 active:cursor-grabbing dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label={`جابجایی ${title}`}
              title="جابجایی"
              {...dragHandleProps}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div
        className={[
          "flex-1 p-4",
          size === "sm" ? "min-h-[140px]" : "",
          size === "md" ? "min-h-[180px]" : "",
          size === "lg" ? "min-h-[220px]" : "",
          size === "xl" ? "min-h-[260px]" : "",
          size === "full" ? "min-h-[300px]" : "",
        ].join(" ")}
      >
        {children}
      </div>
    </motion.div>
  );
});
