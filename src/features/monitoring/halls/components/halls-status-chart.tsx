"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#64748b", "#3b82f6"];

export function HallsStatusChart({
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
          : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      }
    >
      <h3
        className={
          wallboard
            ? "text-lg font-black text-white"
            : "text-lg font-black text-slate-950"
        }
      >
        وضعیت سراها
      </h3>
      <p
        className={
          wallboard
            ? "mb-4 mt-1 text-sm text-slate-400"
            : "mb-4 mt-1 text-sm text-slate-500"
        }
      >
        توزیع سراها براساس وضعیت فعالیت
      </p>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={70}
              outerRadius={105}
            >
              {data.map((item, index) => (
                <Cell key={item.key} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {data.map((item, index) => (
          <div
            key={item.key}
            className={
              wallboard
                ? "rounded-2xl bg-slate-950 px-3 py-2"
                : "rounded-2xl bg-slate-50 px-3 py-2"
            }
          >
            <div className="flex items-center justify-between">
              <span
                className={
                  wallboard
                    ? "text-sm text-slate-300"
                    : "text-sm text-slate-600"
                }
              >
                <span
                  className="ml-2 inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {item.label}
              </span>
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
    </motion.div>
  );
}
