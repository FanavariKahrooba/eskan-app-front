"use client";

import { motion } from "framer-motion";
import { MonitoringProgressBar } from "../../shared/components/monitoring-progress-bar";

interface QualityItem {
  key: string;
  label: string;
  good: number;
  bad: number;
  score: number;
}

function getQualityColor(score: number) {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#f59e0b";
  return "#ef4444";
}

export function HallsQualityPanel({
  items,
  wallboard = false,
}: {
  items: QualityItem[];
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
      <h3 className={wallboard ? "text-lg font-black text-white" : "text-lg font-black text-slate-950"}>
        کیفیت داده‌های ثبت‌شده
      </h3>
      <p className={wallboard ? "mb-4 mt-1 text-sm text-slate-400" : "mb-4 mt-1 text-sm text-slate-500"}>
        ارزیابی کامل بودن اطلاعات پایه سراها
      </p>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className={
              wallboard
                ? "rounded-2xl bg-slate-950 p-4"
                : "rounded-2xl bg-slate-50 p-4"
            }
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <div className={wallboard ? "font-bold text-slate-100" : "font-bold text-slate-800"}>
                  {item.label}
                </div>
                <div className={wallboard ? "mt-1 text-xs text-slate-500" : "mt-1 text-xs text-slate-400"}>
                  کامل: {item.good} | ناقص: {item.bad}
                </div>
              </div>

              <div
                className="rounded-full px-3 py-1 text-xs font-black text-white"
                style={{ backgroundColor: getQualityColor(item.score) }}
              >
                {item.score}%
              </div>
            </div>

            <MonitoringProgressBar
              value={item.score}
              color={getQualityColor(item.score)}
              trackClassName={wallboard ? "bg-slate-800" : "bg-slate-200"}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
