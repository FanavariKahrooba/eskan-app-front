"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function ShelterRequestPriorityChart({
  data,
}: {
  data: { key: string; label: string; value: number; color: string }[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">اولویت درخواست‌ها</h3>
      <p className="mb-4 text-sm text-slate-500">
        تمرکز سریع بر درخواست‌های بحرانی و فوری
      </p>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="15%"
            outerRadius="90%"
            data={data}
            startAngle={180}
            endAngle={-180}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, "dataMax"]}
              tick={false}
            />
            <Tooltip />
            <RadialBar dataKey="value" background cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-700">{item.label}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
