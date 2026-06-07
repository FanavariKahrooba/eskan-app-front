"use client";

import { motion } from "framer-motion";

export function MonitoringProgressBar({
  value,
  color = "#22c55e",
  showLabel = false,
  trackClassName = "bg-slate-100",
}: {
  value: number;
  color?: string;
  showLabel?: boolean;
  trackClassName?: string;
}) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div>
      {showLabel ? (
        <div className="mb-1 flex items-center justify-between text-xs font-bold">
          <span>نرخ مصرف</span>
          <span>{normalized}%</span>
        </div>
      ) : null}

      <div className={`h-2.5 overflow-hidden rounded-full ${trackClassName}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalized}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
