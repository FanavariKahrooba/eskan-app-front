"use client";

import { motion } from "framer-motion";
import { MonitoringProgressBar } from "../../shared/components/monitoring-progress-bar";

export function HallsTopTable({
  items,
  wallboard = false,
}: {
  items: {
    id: number;
    name: string | null;
    hall_code: string | null;
    region_name: string | null;
    district_name: string | null;
    manager_name: string | null;
    has_info: boolean;
    is_shelter_enabled: boolean;
    has_geo: boolean;
    has_contact: boolean;
    available_capacity: number;
    reserved_capacity: number;
    occupied_capacity: number;
    usable_capacity: number;
    usage_rate: number;
    number_of_active_programs: number;
  }[];
  wallboard?: boolean;
}) {
  return (
    <div
      className={
        wallboard
          ? "rounded-3xl border border-slate-800 bg-slate-900 p-5"
          : "rounded-3xl border bg-white p-5 shadow-sm"
      }
    >
      <h3
        className={
          wallboard
            ? "text-lg font-black text-white"
            : "text-lg font-black text-slate-950"
        }
      >
        سراهای اولویت‌دار برای پایش
      </h3>
      <p
        className={
          wallboard
            ? "mb-4 text-sm text-slate-400"
            : "mb-4 text-sm text-slate-500"
        }
      >
        ترکیبی از ریسک ظرفیت، نقص داده و اهمیت عملیاتی
      </p>

      <div className="space-y-3">
        {items.map((item, index) => {
          const barColor =
            item.usage_rate >= 95
              ? "#ef4444"
              : item.usage_rate >= 85
                ? "#f59e0b"
                : "#22c55e";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className={
                wallboard
                  ? "rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  : "rounded-2xl border border-slate-200 bg-white p-4"
              }
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div
                    className={
                      wallboard
                        ? "font-black text-white"
                        : "font-black text-slate-950"
                    }
                  >
                    {item.name ?? "بدون نام"}
                  </div>
                  <div
                    className={
                      wallboard
                        ? "mt-1 text-xs text-slate-400"
                        : "mt-1 text-xs text-slate-500"
                    }
                  >
                    کد: {item.hall_code ?? "-"} | منطقه:{" "}
                    {item.region_name ?? "-"} | ناحیه:{" "}
                    {item.district_name ?? "-"}
                  </div>
                  <div
                    className={
                      wallboard
                        ? "mt-1 text-xs text-slate-500"
                        : "mt-1 text-xs text-slate-400"
                    }
                  >
                    مدیر: {item.manager_name ?? "ثبت نشده"} | برنامه‌های فعال:{" "}
                    {item.number_of_active_programs}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.is_shelter_enabled ? (
                    <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-bold text-violet-700">
                      اسکان
                    </span>
                  ) : null}
                  {!item.has_info ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                      info ناقص
                    </span>
                  ) : null}
                  {!item.has_geo ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                      مختصات ناقص
                    </span>
                  ) : null}
                  {!item.has_contact ? (
                    <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700">
                      تماس ناقص
                    </span>
                  ) : null}
                </div>
              </div>

              <MonitoringProgressBar
                value={item.usage_rate}
                color={barColor}
                showLabel
              />

              <div
                className={
                  wallboard
                    ? "mt-3 grid grid-cols-4 gap-2 text-xs text-slate-300"
                    : "mt-3 grid grid-cols-4 gap-2 text-xs text-slate-600"
                }
              >
                <div>ظرفیت: {item.usable_capacity}</div>
                <div>خالی: {item.available_capacity}</div>
                <div>اشغال: {item.occupied_capacity}</div>
                <div>رزرو: {item.reserved_capacity}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
