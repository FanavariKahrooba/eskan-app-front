// src/features/data-grid/ui/table/table-body.tsx

"use client";

import type { ColumnDef, RowKey } from "../../core/types";
import { getRowId } from "../../core/utils/get-row-id";
import { TableRow } from "./table-row";

type TableBodyProps<TData> = {
  rows: TData[];
  columns: ColumnDef<TData>[];
  rowKey: RowKey<TData>;
  onRowClick?: (row: TData) => void;
};

export function TableBody<TData>({
  rows,
  columns,
  rowKey,
  onRowClick,
}: TableBodyProps<TData>) {
  return (
    <tbody>
      {rows.map((row, index) => (
        <TableRow
          key={getRowId(row, rowKey, index)}
          row={row}
          rowIndex={index}
          columns={columns}
          rowKey={rowKey}
          onClick={onRowClick}
        />
      ))}
    </tbody>
  );
}
