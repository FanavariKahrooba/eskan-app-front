'use client';
import { motion } from "framer-motion";
import { DataGridIcon } from "../shared";

export interface DataGridExpandCellProps {
  expanded?: boolean;
  disabled?: boolean;
  pinned?: "left" | "right" | false;
  onToggle?: () => void;
}

export function DataGridExpandCell({
  expanded = false,
  disabled,
  pinned = "left",
  onToggle,
}: DataGridExpandCellProps) {
  return (
    <td
      className={[
        "w-12 border-b border-slate-100 px-3 py-3",
        pinned ? "sticky z-20 bg-inherit backdrop-blur-xl" : "",
        pinned === "left"
          ? "left-0 shadow-[8px_0_18px_-18px_rgba(15,23,42,0.55)]"
          : "",
        pinned === "right"
          ? "right-0 shadow-[-8px_0_18px_-18px_rgba(15,23,42,0.55)]"
          : "",
      ].join(" ")}
    >
      <motion.button
        type="button"
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.08 } : undefined}
        whileTap={!disabled ? { scale: 0.9 } : undefined}
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.();
        }}
        className={[
          "grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition",
          "hover:bg-indigo-50 hover:text-indigo-700",
          "disabled:pointer-events-none disabled:opacity-40",
        ].join(" ")}
      >
        <motion.span animate={{ rotate: expanded ? 90 : 0 }}>
          <DataGridIcon name="chevronRight" size={16} />
        </motion.span>
      </motion.button>
    </td>
  );
}
