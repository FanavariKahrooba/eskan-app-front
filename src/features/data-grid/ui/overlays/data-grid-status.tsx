"use client"
import { AnimatePresence, motion } from "framer-motion";

export type DataGridStatusType = "info" | "success" | "warning" | "error";

export interface DataGridStatusProps {
  visible?: boolean;
  type?: DataGridStatusType;
  message?: string;
}

const typeClass: Record<DataGridStatusType, string> = {
  info: "border-indigo-200 bg-indigo-50 text-indigo-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
};

export function DataGridStatus({
  visible = false,
  type = "info",
  message,
}: DataGridStatusProps) {
  return (
    <AnimatePresence>
      {visible && message ? (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          className={[
            "overflow-hidden border-b px-4 py-2 text-xs font-medium",
            typeClass[type],
          ].join(" ")}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
