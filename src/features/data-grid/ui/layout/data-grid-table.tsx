"use client"
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface DataGridTableProps {
  children: ReactNode;
  minWidth?: number | string;
  className?: string;
  containerClassName?: string;
}

export function DataGridTable({
  children,
  minWidth = 900,
  className = "",
  containerClassName = "",
}: DataGridTableProps) {
  return (
    <div
      className={[
        "relative overflow-auto bg-white/30",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300",
        containerClassName,
      ].join(" ")}
    >
      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.06 }}
        style={{
          minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
        }}
        className={[
          "w-full border-separate border-spacing-0 text-sm",
          className,
        ].join(" ")}
      >
        {children}
      </motion.table>
    </div>
  );
}
