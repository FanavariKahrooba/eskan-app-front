'use client';
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface DataGridRowProps {
  children: ReactNode;
  selected?: boolean;
  clickable?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  index?: number;
  className?: string;
  onClick?: () => void;
}

export function DataGridRow({
  children,
  selected,
  clickable,
  expanded,
  disabled,
  index = 0,
  className = "",
  onClick,
}: DataGridRowProps) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{
        opacity: disabled ? 0.55 : 1,
        y: 0,
        scale: selected ? 1.002 : 1,
      }}
      exit={{ opacity: 0, y: -6, scale: 0.99 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 28,
        delay: Math.min(index * 0.015, 0.18),
      }}
      onClick={disabled ? undefined : onClick}
      className={[
        "group border-b border-slate-100 transition-colors",
        selected
          ? "bg-indigo-50/70 hover:bg-indigo-50"
          : "bg-white/40 hover:bg-slate-50/90",
        expanded ? "bg-violet-50/50" : "",
        clickable && !disabled ? "cursor-pointer" : "",
        disabled ? "pointer-events-none" : "",
        className,
      ].join(" ")}
    >
      {children}
    </motion.tr>
  );
}
