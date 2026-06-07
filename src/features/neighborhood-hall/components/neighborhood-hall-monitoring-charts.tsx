"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import type { MonitoringTrafficPoint } from "../types/neighborhood-hall-monitoring-types";

const chartText = "#94a3b8";
const gridColor = "rgba(255,255,255,0.08)";

export function TrafficAreaChart({ data }: { data: MonitoringTrafficPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="requestsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="time"
            stroke={chartText}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke={chartText} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              color: "white",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="requests"
            stroke="#22d3ee"
            fill="url(#requestsFill)"
            strokeWidth={3}
            name="Requests"
          />
          <Line
            type="monotone"
            dataKey="active_users"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
            name="Active Users"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ErrorsBarChart({ data }: { data: MonitoringTrafficPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="time"
            stroke={chartText}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke={chartText} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
            }}
          />
          <Bar
            dataKey="errors"
            fill="#f43f5e"
            radius={[10, 10, 0, 0]}
            name="Errors"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RequestsUsersMiniChart({
  data,
}: {
  data: MonitoringTrafficPoint[];
}) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="miniFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="time"
            stroke={chartText}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke={chartText} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
            }}
          />
          <Area
            type="monotone"
            dataKey="requests"
            stroke="#38bdf8"
            fill="url(#miniFill)"
            strokeWidth={3}
            name="Requests"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
