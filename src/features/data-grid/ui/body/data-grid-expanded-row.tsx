'use client';
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface DataGridExpandedRowProps {
  children: ReactNode;
  colSpan: number;
  className?: string;
}

export function DataGridExpandedRow({
  children,
  colSpan,
  className = "",
}: DataGridExpandedRowProps) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={className}
    >
      <td
        colSpan={colSpan}
        className="border-b border-slate-100 bg-violet-50/30 p-0"
      >
        <motion.div
          initial={{ height: 0, opacity: 0, y: -8 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="overflow-hidden"
        >
          <div className="p-5">{children}</div>
        </motion.div>
      </td>
    </motion.tr>
  );
}
