"use client";

import React from "react";
import { Activity, MonitorSmartphone } from "lucide-react";
import { MonitoringShellProps } from "../types/monitoring";
import { MonitoringSurface } from "./monitoring-surface";
import { useMonitoringClock } from "../hooks/use-monitoring-clock";
import { mcn } from "../utils/monitoring-cn";

function formatClock(date: Date) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

export function MonitoringShell({
  title,
  subtitle,
  children,
  actions,
  className,
  contentClassName,
  tvMode,
}: MonitoringShellProps) {
  const now = useMonitoringClock();

  return (
    <div className={mcn("min-h-screen px-4 py-4 md:px-6 md:py-6", className)}>
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4">
        <MonitoringSurface strong className="rounded-[28px] p-5 md:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 monitoring-accent-ring">
                {tvMode ? (
                  <MonitorSmartphone className="h-7 w-7" />
                ) : (
                  <Activity className="h-7 w-7" />
                )}
              </div>

              <div className="space-y-1">
                <h1 className="monitoring-title text-2xl font-black tracking-tight md:text-3xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="monitoring-muted max-w-3xl text-sm md:text-base">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 xl:items-end">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <span className="monitoring-muted">اکنون:</span>{" "}
                <span className="font-semibold">{formatClock(now)}</span>
              </div>

              {actions ? (
                <div className="flex flex-wrap items-center gap-2">
                  {actions}
                </div>
              ) : null}
            </div>
          </div>
        </MonitoringSurface>

        <div className={mcn("flex flex-col gap-4", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
