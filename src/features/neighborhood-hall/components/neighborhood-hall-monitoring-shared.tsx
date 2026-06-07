"use client";

import { cn } from "@/utils/tools";
import * as React from "react";

export function MonitoringCard({
  title,
  children,
  className,
  rightSlot,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/10 bg-[#0f172a]/90 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.95)]" />
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}

export function KpiTile({
  title,
  value,
  unit,
  change,
  status = "neutral",
}: {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  status?: "healthy" | "warning" | "critical" | "neutral";
}) {
  const tone =
    status === "healthy"
      ? "from-emerald-500/20 to-emerald-400/5 border-emerald-400/20"
      : status === "warning"
        ? "from-amber-500/20 to-amber-400/5 border-amber-400/20"
        : status === "critical"
          ? "from-rose-500/20 to-rose-400/5 border-rose-400/20"
          : "from-sky-500/20 to-sky-400/5 border-sky-400/20";

  const changeTone = (change || 0) >= 0 ? "text-emerald-400" : "text-rose-400";

  return (
    <div className={cn("rounded-3xl border bg-gradient-to-br p-5", tone)}>
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-3 flex items-end gap-2">
        <div className="text-3xl font-black tracking-tight text-white">
          {value}
        </div>
        {unit ? (
          <div className="pb-1 text-sm font-medium text-slate-400">{unit}</div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-500">وضعیت لحظه‌ای</span>
        {typeof change === "number" ? (
          <span className={cn("text-xs font-bold", changeTone)}>
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function StatusDot({
  status,
}: {
  status: "online" | "degraded" | "offline";
}) {
  const color =
    status === "online"
      ? "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.95)]"
      : status === "degraded"
        ? "bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.95)]"
        : "bg-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.95)]";

  return (
    <span className={cn("inline-block h-2.5 w-2.5 rounded-full", color)} />
  );
}

export function SelectBox({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none ring-0"
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((item) => (
        <option
          key={item.value}
          value={item.value}
          className="bg-slate-900 text-white"
        >
          {item.label}
        </option>
      ))}
    </select>
  );
}
