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
import { ShelterMonitoringChartDatum } from "../types/shelter-monitoring.types";
import { ShelterMonitoringEmptyState } from "./shelter-monitoring-empty-state";
import { formatNumber } from "../utils/shelter-monitoring-format";

export function ShelterMonitoringBarChart({
  data,
  height = 320,
}: {
  data: ShelterMonitoringChartDatum[];
  height?: number;
}) {
  if (!data.length) {
    return <ShelterMonitoringEmptyState />;
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <Tooltip
            formatter={(value: number) => [formatNumber(value), "مقدار"]}
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              color: "#fff",
            }}
          />
          <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#22d3ee" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
