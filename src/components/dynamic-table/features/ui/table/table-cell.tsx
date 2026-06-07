// src/features/data-grid/ui/table/table-cell.tsx

"use client";

import type { ColumnDef } from "../../core/types";
import { getCellValue } from "../../core/utils/get-cell-value";
import { cn } from "../../core/utils/cn";

type TableCellProps<TData> = {
  row: TData;
  rowId: string;
  rowIndex: number;
  column: ColumnDef<TData>;
  className?: string;
};

export function TableCell<TData>({
  row,
  rowId,
  rowIndex,
  column,
  className,
}: TableCellProps<TData>) {
  const value = getCellValue(row, column);

  const content = column.renderCell
    ? column.renderCell({
        row: {
          id: rowId,
          original: row,
          index: rowIndex,
        },
        value,
        column,
      })
    : String(value ?? "");

  return (
    <td
      className={cn(
        "border-b border-gray-200 px-3 py-2 text-sm text-gray-800",
        column.cellClassName,
        className,
      )}
      style={{
        width: column.width,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
      }}
    >
      {content}
    </td>
  );
}
