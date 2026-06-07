"use client";

import { motion } from "framer-motion";
import { HallMonitoringSeverity } from "../types/halls-overview.types";

interface AlertItem {
  type: string;
  severity: HallMonitoringSeverity;
  title: string;
  message: string;
  value?: number | null;
}

const severityClasses = {
  info: {
    normal: "border-sky-200 bg-sky-50 text-sky-800",
    wallboard: "border-sky-500/40 bg-sky-500/10 text-sky-100",
    badge: "bg-sky-500",
  },
  warning: {
    normal: "border-amber-200 bg-amber-50 text-amber-800",
    wallboard: "border-amber-500/40 bg-amber-500/10 text-amber-100",
    badge: "bg-amber-500",
  },
  critical: {
    normal: "border-rose-200 bg-rose-50 text-rose-800",
    wallboard: "border-rose-500/40 bg-rose-500/10 text-rose-100",
    badge: "bg-rose-500",
  },
};

export function HallsAlertsPanel({
  items,
  wallboard = false,
}: {
  items: AlertItem[];
  wallboard?: boolean;
}) {
  return (
    <div
      className={
        wallboard
          ? "rounded-3xl border border-slate-800 bg-slate-900 p-5"
          : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3
            className={
              wallboard
                ? "text-lg font-black text-white"
                : "text-lg font-black text-slate-950"
            }
          >
            هشدارهای عملیاتی
          </h3>
          <p
            className={
              wallboard
                ? "mt-1 text-sm text-slate-400"
                : "mt-1 text-sm text-slate-500"
            }
          >
            موارد نیازمند توجه در سراها
          </p>
        </div>

        <span
          className={
            wallboard
              ? "rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200"
              : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
          }
        >
          {items.length} هشدار
        </span>
      </div>

      {items.length === 0 ? (
        <div
          className={
            wallboard
              ? "rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100"
              : "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          }
        >
          هیچ هشدار فعالی وجود ندارد.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const style =
              severityClasses[item.severity] ?? severityClasses.info;

            return (
              <motion.div
                key={`${item.type}-${index}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border p-4 ${
                  wallboard ? style.wallboard : style.normal
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${style.badge}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-black">{item.title}</h4>
                      {item.value !== undefined && item.value !== null ? (
                        <span className="text-lg font-black">{item.value}</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-7 opacity-85">
                      {item.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
