"use client";

import { useTableStore } from "../store/use-table-store";
import TableCard from "./table-card";

export default function FloorMap() {
  const tables = useTableStore((s) => s.tables);

  return (
    <div
      className="
      relative
      h-full
      w-full
      rounded-3xl
      border border-white/10
      bg-neutral-900
      "
    >
      {tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  );
}
