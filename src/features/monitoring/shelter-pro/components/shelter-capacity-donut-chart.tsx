"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function ShelterCapacityDonutChart({
  data,
}: {
  data: { key: string; label: string; value: number; color: string }[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">ترکیب ظرفیت</h3>
          <p className="text-sm text-slate-500">
            نمای کلی ظرفیت خالی، رزرو، اشغال و اضطراری
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Total: {total}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={3}
                cornerRadius={10}
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-3">
          {data.map((item) => {
            const percent =
              total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";

            return (
              <div
                key={item.key}
                className="rounded-xl border border-slate-200 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-slate-800">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {item.value}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  {percent}% از کل ظرفیت
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
