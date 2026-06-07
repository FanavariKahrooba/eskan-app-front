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

interface RegionItem {
  region_id: number | null;
  region_name: string | null;
  total_halls: number;
  active_halls: number;
  shelter_enabled_halls: number;
  halls_with_info: number;
  total_capacity: number;
  available_capacity: number;
  usage_rate: number;
}

export function HallsRegionChart({
  data,
  wallboard = false,
}: {
  data: RegionItem[];
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
        توزیع منطقه‌ای سراها
      </h3>
      <p
        className={
          wallboard
            ? "mb-4 mt-1 text-sm text-slate-400"
            : "mb-4 mt-1 text-sm text-slate-500"
        }
      >
        مقایسه تعداد کل، فعال و دارای اسکان در مناطق
      </p>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={wallboard ? "#334155" : "#e2e8f0"}
            />
            <XAxis
              dataKey="region_name"
              tick={{ fontSize: 12, fill: wallboard ? "#cbd5e1" : "#475569" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: wallboard ? "#cbd5e1" : "#475569" }}
            />
            <Tooltip />
            <Legend />
            <Bar
              name="کل سراها"
              dataKey="total_halls"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              name="فعال"
              dataKey="active_halls"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              name="دارای اسکان"
              dataKey="shelter_enabled_halls"
              fill="#8b5cf6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
