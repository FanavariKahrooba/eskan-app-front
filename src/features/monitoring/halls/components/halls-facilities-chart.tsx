"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

interface FacilityItem {
  key: string;
  label: string;
  available: number;
  missing: number;
}

export function HallsFacilitiesChart({
  data,
  wallboard = false,
}: {
  data: FacilityItem[];
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
        امکانات و زیرساخت سراها
      </h3>
      <p
        className={
          wallboard
            ? "mb-4 mt-1 text-sm text-slate-400"
            : "mb-4 mt-1 text-sm text-slate-500"
        }
      >
        مقایسه امکانات موجود و ثبت‌نشده
      </p>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke={wallboard ? "#334155" : "#e2e8f0"}
            />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 12, fill: wallboard ? "#cbd5e1" : "#475569" }}
            />
            <YAxis
              dataKey="label"
              type="category"
              width={110}
              tick={{ fontSize: 12, fill: wallboard ? "#cbd5e1" : "#475569" }}
            />
            <Tooltip />
            <Legend />
            <Bar
              name="موجود"
              dataKey="available"
              stackId="a"
              fill="#22c55e"
              radius={[0, 8, 8, 0]}
            />
            <Bar
              name="فاقد/ثبت‌نشده"
              dataKey="missing"
              stackId="a"
              fill="#ef4444"
              radius={[8, 0, 0, 8]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
