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

export function ShelterSpaceTypesChart({
  data,
}: {
  data: {
    key: string;
    label: string;
    value: number;
    capacity: number;
    available_capacity: number;
    reserved_capacity: number;
    occupied_capacity: number;
    color: string;
  }[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">تحلیل فضاها</h3>
      <p className="mb-4 text-sm text-slate-500">
        مقایسه ظرفیت اشغال، رزرو و خالی در انواع فضاها
      </p>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={18}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="available_capacity"
              stackId="a"
              fill="#22c55e"
              name="خالی"
              radius={[0, 0, 6, 6]}
            />
            <Bar
              dataKey="reserved_capacity"
              stackId="a"
              fill="#f59e0b"
              name="رزرو"
            />
            <Bar
              dataKey="occupied_capacity"
              stackId="a"
              fill="#ef4444"
              name="اشغال"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
