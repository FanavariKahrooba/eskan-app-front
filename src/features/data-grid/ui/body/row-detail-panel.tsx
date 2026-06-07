'use client';
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface RowDetailPanelProps {
  children: ReactNode;
  colSpan: number;
  open?: boolean;
  className?: string;
  contentClassName?: string;
}

export function RowDetailPanel({
  children,
  colSpan,
  open = true,
  className = "",
  contentClassName = "",
}: RowDetailPanelProps) {
  if (!open) return null;

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
          <div
            className={[
              "m-3 rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-xl",
              contentClassName,
            ].join(" ")}
          >
            {children}
          </div>
        </motion.div>
      </td>
    </motion.tr>
  );
}
