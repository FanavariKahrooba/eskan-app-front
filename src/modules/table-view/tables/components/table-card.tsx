"use client";

import { motion } from "framer-motion";
import { Table } from "../store/use-table-store";

const colors = {
  free: "bg-emerald-500",
  seated: "bg-blue-500",
  ordering: "bg-yellow-500",
  served: "bg-orange-500",
  payment: "bg-red-500",
};

export default function TableCard({ table }: { table: Table }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="
      absolute
      cursor-pointer
      rounded-2xl
      border border-white/10
      backdrop-blur-xl
      bg-white/10
      p-4
      w-28
      text-center
      shadow-xl
      "
      style={{
        left: table.x,
        top: table.y,
      }}
    >
      <div
        className={`mx-auto mb-2 h-3 w-3 rounded-full ${colors[table.status]}`}
      />

      <div className="text-sm font-semibold text-white">{table.name}</div>

      <div className="text-xs text-neutral-400">{table.capacity} نفر</div>

      {table.total && (
        <div className="mt-1 text-xs text-emerald-400">
          {table.total.toLocaleString()}
        </div>
      )}
    </motion.div>
  );
}
