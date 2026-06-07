'use client';
import { motion } from "framer-motion";
import type { MouseEventHandler } from "react";

export interface DataGridSelectCellProps {
  checked?: boolean;
  disabled?: boolean;
  pinned?: "left" | "right" | false;
  onChange?: (checked: boolean) => void;
  onClick?: MouseEventHandler<HTMLTableCellElement>;
}

export function DataGridSelectCell({
  checked = false,
  disabled,
  pinned = "left",
  onChange,
  onClick,
}: DataGridSelectCellProps) {
  return (
    <td
      onClick={onClick}
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
      <label
        className="grid cursor-pointer place-items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
        />

        <motion.span
          whileHover={!disabled ? { scale: 1.08 } : undefined}
          whileTap={!disabled ? { scale: 0.88 } : undefined}
          className={[
            "grid h-5 w-5 place-items-center rounded-md border transition",
            checked
              ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              : "border-slate-300 bg-white text-transparent group-hover:border-indigo-300",
            disabled ? "cursor-not-allowed opacity-50" : "",
          ].join(" ")}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m20 6-11 11-5-5" />
          </svg>
        </motion.span>
      </label>
    </td>
  );
}
