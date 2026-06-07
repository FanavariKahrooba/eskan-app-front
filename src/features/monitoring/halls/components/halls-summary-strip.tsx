"use client";

import { motion } from "framer-motion";

function formatDateTime(value?: string) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function HallsSummaryStrip({
  generatedAt,
  wallboard = false,
}: {
  generatedAt?: string;
  wallboard?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={
        wallboard
          ? "rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-slate-300"
          : "rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm"
      }
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm font-semibold">
          نمای تجمیعی سراهای محله بر اساس اطلاعات پایه، امکانات، کیفیت داده و
          وضعیت اسکان
        </div>
        <div className="text-xs opacity-80">
          آخرین بروزرسانی: {formatDateTime(generatedAt)}
        </div>
      </div>
    </motion.div>
  );
}
