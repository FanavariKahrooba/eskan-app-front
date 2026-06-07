// src/features/data-grid/ui/pagination/table-pagination.tsx

"use client";

import { cn } from "../../core/utils/cn";
import { tableTheme } from "../../core/theme/tokens";

type TablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-3 py-3 text-sm",
        tableTheme.pagination,
      )}
    >
      <div>
        صفحه {page} از {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            "rounded-md px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50",
            tableTheme.button,
          )}
        >
          قبلی
        </button>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            "rounded-md px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50",
            tableTheme.button,
          )}
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
