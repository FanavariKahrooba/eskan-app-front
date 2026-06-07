"use client"
import { motion } from "framer-motion";
import { DataGridIcon } from "../shared";

export interface DataGridSearchProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

export function DataGridSearch({
  value = "",
  placeholder = "جستجو...",
  disabled,
  className = "",
  onChange,
  onClear,
}: DataGridSearchProps) {
  return (
    <motion.div
      whileFocus={{ scale: 1.01 }}
      className={[
        "relative flex h-11 min-w-64 items-center rounded-2xl",
        "border border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl",
        "transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10",
        className,
      ].join(" ")}
    >
      <span className="pointer-events-none absolute start-3 text-slate-400">
        <DataGridIcon name="search" size={18} />
      </span>

      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className={[
          "h-full w-full rounded-2xl bg-transparent px-10 text-sm text-slate-700 outline-none",
          "placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
        ].join(" ")}
      />

      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange?.("");
            onClear?.();
          }}
          className="absolute end-2 grid h-7 w-7 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <DataGridIcon name="x" size={15} />
        </button>
      ) : null}
    </motion.div>
  );
}
