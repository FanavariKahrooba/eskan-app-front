"use client";
import type { HTMLAttributes, ReactNode } from "react";
import { type HTMLMotionProps, motion } from "framer-motion";

export interface DataGridHeaderRowProps extends HTMLMotionProps<"tr"> {
  children?: ReactNode;
}

export function DataGridHeaderRow({
  children,
  className = "",
  ...props
}: DataGridHeaderRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={className}
      {...props}
    >
      {children}
    </motion.tr>
  );
}
