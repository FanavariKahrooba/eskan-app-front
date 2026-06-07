"use client"
import { motion } from "framer-motion";

export interface DataGridSelectHeaderCellProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  pinned?: "left" | "right" | false;
  onChange?: (checked: boolean) => void;
}

export function DataGridSelectHeaderCell({
  checked = false,
  indeterminate = false,
  disabled,
  pinned = "left",
  onChange,
}: DataGridSelectHeaderCellProps) {
  return (
    <th
      className={[
        "sticky top-0 z-30 w-12 border-b border-slate-200/80 bg-white/85 px-3 py-3 backdrop-blur-xl",
        pinned === "left"
          ? "left-0 shadow-[8px_0_18px_-18px_rgba(15,23,42,0.55)]"
          : "",
        pinned === "right"
          ? "right-0 shadow-[-8px_0_18px_-18px_rgba(15,23,42,0.55)]"
          : "",
      ].join(" ")}
    >
      <label className="grid cursor-pointer place-items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
        />

        <motion.span
          whileTap={!disabled ? { scale: 0.88 } : undefined}
          animate={{
            scale: checked || indeterminate ? 1 : 0.96,
          }}
          className={[
            "grid h-5 w-5 place-items-center rounded-md border transition",
            checked || indeterminate
              ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              : "border-slate-300 bg-white text-transparent",
            disabled ? "cursor-not-allowed opacity-50" : "",
          ].join(" ")}
        >
          {indeterminate ? (
            <span className="h-0.5 w-2.5 rounded-full bg-current" />
          ) : (
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
          )}
        </motion.span>
      </label>
    </th>
  );
}
