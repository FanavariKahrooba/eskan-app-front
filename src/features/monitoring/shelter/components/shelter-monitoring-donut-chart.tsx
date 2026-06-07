"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ShelterMonitoringChartDatum } from "../types/shelter-monitoring.types";
import { ShelterMonitoringEmptyState } from "./shelter-monitoring-empty-state";
import { formatNumber } from "../utils/shelter-monitoring-format";

export function ShelterMonitoringDonutChart({
  data,
  height = 280,
  centerLabel,
}: {
  data: ShelterMonitoringChartDatum[];
  height?: number;
  centerLabel?: string;
}) {
  if (!data.length) {
    return <ShelterMonitoringEmptyState />;
  }

  const total = data.reduce((sum, item) => sum + Number(item.value ?? 0), 0);

  return (
    <div className="relative h-[280px] w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={72}
            outerRadius={108}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={entry.color ?? "#22d3ee"}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number) => [formatNumber(value), "مقدار"]}
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-black monitoring-title">
          {formatNumber(total)}
        </div>
        {centerLabel ? (
          <div className="mt-1 text-xs monitoring-muted">{centerLabel}</div>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color ?? "#22d3ee" }}
              />
              <span className="text-sm monitoring-title">{item.name}</span>
            </div>
            <span className="text-sm font-bold monitoring-muted">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
