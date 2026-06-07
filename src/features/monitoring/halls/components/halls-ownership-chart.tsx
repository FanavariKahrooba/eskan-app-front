"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#94a3b8",
];

export function HallsOwnershipChart({
  data,
  wallboard = false,
}: {
  data: { key: string; label: string; value: number }[];
  wallboard?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
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
        وضعیت مالکیت سراها
      </h3>
      <p
        className={
          wallboard
            ? "mb-4 text-sm text-slate-400"
            : "mb-4 text-sm text-slate-500"
        }
      >
        توزیع وضعیت مالکیت براساس اطلاعات ثبت‌شده
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={65}
                outerRadius={100}
              >
                {data.map((item, index) => (
                  <Cell key={item.key} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={item.key}
              className={
                wallboard
                  ? "rounded-2xl bg-slate-800 p-3"
                  : "rounded-2xl bg-slate-50 p-3"
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span
                    className={
                      wallboard
                        ? "text-sm text-slate-200"
                        : "text-sm text-slate-700"
                    }
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  className={
                    wallboard
                      ? "font-black text-white"
                      : "font-black text-slate-950"
                  }
                >
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
