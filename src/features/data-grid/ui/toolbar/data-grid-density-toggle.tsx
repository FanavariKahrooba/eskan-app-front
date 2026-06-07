"use client"
import { motion } from "framer-motion";
import { DataGridDensity } from "./data-grid-density.types";


export interface DataGridDensityToggleProps {
  value?: DataGridDensity;
  disabled?: boolean;
  className?: string;
  onChange?: (density: DataGridDensity) => void;
}

const densityItems: Array<{
  value: DataGridDensity;
  label: string;
}> = [
  { value: "compact", label: "فشرده" },
  { value: "comfortable", label: "معمولی" },
  { value: "spacious", label: "باز" },
];

export function DataGridDensityToggle({
  value = "comfortable",
  disabled,
  className = "",
  onChange,
}: DataGridDensityToggleProps) {
  return (
    <div
      className={[
        "flex rounded-2xl border border-slate-200 bg-white/70 p-1 shadow-sm backdrop-blur-xl",
        disabled ? "pointer-events-none opacity-50" : "",
        className,
      ].join(" ")}
    >
      {densityItems.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(item.value)}
            className={[
              "relative h-8 rounded-xl px-3 text-xs font-bold transition",
              active ? "text-white" : "text-slate-500 hover:text-slate-800",
            ].join(" ")}
          >
            {active ? (
              <motion.span
                layoutId="data-grid-density-toggle-active"
                className="absolute inset-0 rounded-xl bg-slate-900 shadow-lg shadow-slate-900/10"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}

            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
