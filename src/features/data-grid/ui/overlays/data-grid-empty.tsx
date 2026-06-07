"use client"
import { motion } from "framer-motion";
import { DataGridIcon } from "../shared";
import type { ReactNode } from "react";

export interface DataGridEmptyProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function DataGridEmpty({
  title = "داده‌ای برای نمایش وجود ندارد",
  description = "می‌توانید فیلترها را تغییر دهید یا داده جدید اضافه کنید.",
  action,
}: DataGridEmptyProps) {
  return (
    <div className="grid min-h-72 place-items-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="max-w-md text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 shadow-inner"
        >
          <DataGridIcon name="empty" size={36} />
        </motion.div>

        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

        {action ? <div className="mt-5">{action}</div> : null}
      </motion.div>
    </div>
  );
}
