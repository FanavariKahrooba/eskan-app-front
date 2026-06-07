// src/features/data-grid/ui/table/table-empty.tsx

"use client";

import { tableTheme } from "../../core/theme/tokens";
import { cn } from "../../core/utils/cn";

type TableEmptyProps = {
  colSpan: number;
  message?: string;
};

export function TableEmpty({
  colSpan,
  message = "داده‌ای برای نمایش وجود ندارد",
}: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn("px-3 py-10 text-center text-sm", tableTheme.empty)}
      >
        {message}
      </td>
    </tr>
  );
}
