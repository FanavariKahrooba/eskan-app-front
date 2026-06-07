// src/features/data-grid/ui/table/table-row.tsx

"use client";

import type { ColumnDef, RowKey } from "../../core/types";
import { getRowId } from "../../core/utils/get-row-id";
import { cn } from "../../core/utils/cn";
import { TableCell } from "./table-cell";

type TableRowProps<TData> = {
  row: TData;
  rowIndex: number;
  columns: ColumnDef<TData>[];
  rowKey: RowKey<TData>;
  className?: string;
  onClick?: (row: TData) => void;
};

export function TableRow<TData>({
  row,
  rowIndex,
  columns,
  rowKey,
  className,
  onClick,
}: TableRowProps<TData>) {
  const rowId = getRowId(row, rowKey, rowIndex);

  return (
    <tr
      className={cn(
        "bg-white transition-colors hover:bg-gray-50",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={() => onClick?.(row)}
    >
      {columns.map((column) => (
        <TableCell
          key={column.id}
          row={row}
          rowId={rowId}
          rowIndex={rowIndex}
          column={column}
        />
      ))}
    </tr>
  );
}
