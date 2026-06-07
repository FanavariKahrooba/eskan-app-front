"use client";
import type { HTMLAttributes, ReactNode } from "react";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";

export interface DataGridBodyProps extends HTMLMotionProps<"tbody"> {
  children: ReactNode;
  className?: string;
}

export function DataGridBody({
  children,
  className = "",
  ...props
}: DataGridBodyProps) {
  return (
    <motion.tbody
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.04 }}
      className={className}
      {...props}
    >
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </motion.tbody>
  );
}
