"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

export function HallsProgramActivityChart({
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
        وضعیت برنامه‌های فعال
      </h3>
      <p
        className={
          wallboard
            ? "mb-4 text-sm text-slate-400"
            : "mb-4 text-sm text-slate-500"
        }
      >
        تحلیل فعالیت عملیاتی سراها بر اساس برنامه‌های ثبت‌شده
      </p>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
