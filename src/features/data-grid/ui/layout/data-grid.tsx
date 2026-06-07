"use client"
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { DataGridStatus } from "../overlays";

export interface DataGridProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  statusMessage?: string;
  statusType?: "info" | "success" | "warning" | "error";
  className?: string;
  dir?: "rtl" | "ltr";
}

export function DataGrid({
  children,
  title,
  description,
  statusMessage,
  statusType = "info",
  className = "",
  dir = "rtl",
}: DataGridProps) {
  return (
    <motion.section
      dir={dir}
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className={[
        "relative overflow-hidden rounded-[2rem]",
        "border border-white/60 bg-white/80 shadow-2xl shadow-slate-900/10",
        "backdrop-blur-2xl",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>

      {(title || description) && (
        <div className="relative border-b border-slate-200/70 px-5 py-5">
          {title ? (
            <h2 className="bg-gradient-to-r from-slate-950 via-indigo-900 to-fuchsia-900 bg-clip-text text-xl font-black text-transparent">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
      )}

      <DataGridStatus
        visible={Boolean(statusMessage)}
        message={statusMessage}
        type={statusType}
      />

      <div className="relative">{children}</div>
    </motion.section>
  );
}
