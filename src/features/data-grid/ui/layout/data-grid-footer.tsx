"use client"
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { DataGridButton, DataGridIcon } from "../shared";

export interface DataGridFooterProps {
  pageIndex?: number;
  pageSize?: number;
  totalRows?: number;
  pageCount?: number;
  selectedCount?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function DataGridFooter({
  pageIndex = 0,
  pageSize = 10,
  totalRows = 0,
  pageCount = 1,
  selectedCount = 0,
  onPreviousPage,
  onNextPage,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  left,
  right,
  className = "",
}: DataGridFooterProps) {
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className={[
        "flex flex-col gap-3 border-t border-slate-200/70 bg-white/55 p-4 backdrop-blur-xl",
        "lg:flex-row lg:items-center lg:justify-between",
        className,
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {left ?? (
          <>
            <span>
              نمایش <strong className="font-bold text-slate-700">{from}</strong>{" "}
              تا <strong className="font-bold text-slate-700">{to}</strong> از{" "}
              <strong className="font-bold text-slate-700">
                {totalRows.toLocaleString("fa-IR")}
              </strong>
            </span>

            {selectedCount > 0 ? (
              <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-700">
                {selectedCount.toLocaleString("fa-IR")} انتخاب‌شده
              </span>
            ) : null}
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {right ?? (
          <>
            <label className="flex items-center gap-2 text-xs text-slate-500">
              تعداد:
              <select
                value={pageSize}
                onChange={(event) =>
                  onPageSizeChange?.(Number(event.target.value))
                }
                className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
              >
                {pageSizeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <div className="mx-1 text-xs font-medium text-slate-500">
              صفحه {Number(pageIndex + 1).toLocaleString("fa-IR")} از{" "}
              {Number(pageCount).toLocaleString("fa-IR")}
            </div>

            <DataGridButton
              size="icon"
              variant="ghost"
              disabled={pageIndex <= 0}
              onClick={onPreviousPage}
              title="صفحه قبل"
            >
              <DataGridIcon name="chevronRight" />
            </DataGridButton>

            <DataGridButton
              size="icon"
              variant="ghost"
              disabled={pageIndex >= pageCount - 1}
              onClick={onNextPage}
              title="صفحه بعد"
            >
              <span className="rotate-180">
                <DataGridIcon name="chevronRight" />
              </span>
            </DataGridButton>
          </>
        )}
      </div>
    </motion.div>
  );
}
