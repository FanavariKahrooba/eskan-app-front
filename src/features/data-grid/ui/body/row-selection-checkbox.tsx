"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { MouseEventHandler } from "react";

export interface RowSelectionCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
  onClick?: MouseEventHandler<HTMLLabelElement>;
}

export function RowSelectionCheckbox({
  checked = false,
  indeterminate = false,
  disabled,
  label = "انتخاب ردیف",
  className = "",
  onChange,
  onClick,
}: RowSelectionCheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      className={[
        "inline-grid cursor-pointer place-items-center",
        disabled ? "cursor-not-allowed opacity-50" : "",
        className,
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />

      <motion.span
        whileHover={!disabled ? { scale: 1.08 } : undefined}
        whileTap={!disabled ? { scale: 0.88 } : undefined}
        animate={{
          scale: checked || indeterminate ? 1 : 0.96,
        }}
        className={[
          "grid h-5 w-5 place-items-center rounded-md border transition",
          checked || indeterminate
            ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
            : "border-slate-300 bg-white text-transparent hover:border-indigo-300",
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
  );
}
