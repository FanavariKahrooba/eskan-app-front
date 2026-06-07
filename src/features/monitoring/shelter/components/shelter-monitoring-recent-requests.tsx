"use client";

import { ShelterRecentRequestItem } from "../types/shelter-monitoring.types";
import { MonitoringSurface } from "@/features/monitoring/core/components/monitoring-surface";
import { ShelterMonitoringSectionHeader } from "./shelter-monitoring-section-header";
import { ShelterMonitoringEmptyState } from "./shelter-monitoring-empty-state";
import {
  formatDateTimeFa,
  labelizePriority,
  labelizeRequestType,
  labelizeShelterStatus,
  formatNumber,
} from "../utils/shelter-monitoring-format";

function priorityClass(priority?: string) {
  switch (priority) {
    case "urgent":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "high":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "normal":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    default:
      return "border-white/10 bg-white/5 text-white";
  }
}

export function ShelterMonitoringRecentRequests({
  items,
  compact,
}: {
  items: ShelterRecentRequestItem[];
  compact?: boolean;
}) {
  return (
    <MonitoringSurface className="p-6">
      <ShelterMonitoringSectionHeader
        title="فید زنده درخواست‌ها"
        subtitle="آخرین درخواست‌های ثبت‌شده برای بررسی سریع عملیاتی"
      />

      {!items.length ? (
        <ShelterMonitoringEmptyState />
      ) : (
        <div className="space-y-3">
          {items.slice(0, compact ? 5 : 10).map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-bold monitoring-title">
                      {item.applicant_name || "بدون نام"}
                    </div>

                    <span
                      className={`rounded-xl border px-2 py-1 text-xs ${priorityClass(item.priority_level)}`}
                    >
                      {labelizePriority(item.priority_level)}
                    </span>

                    <span className="rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs monitoring-muted">
                      {labelizeShelterStatus(item.status)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm monitoring-muted">
                    <span>شماره درخواست: {item.request_number}</span>
                    <span>نوع: {labelizeRequestType(item.request_type)}</span>
                    <span>بعد خانوار: {formatNumber(item.household_size)}</span>
                    <span>
                      سرا: {item.neighborhood_hall_name ?? "تعیین نشده"}
                    </span>
                  </div>
                </div>

                <div className="text-sm monitoring-muted">
                  {formatDateTimeFa(item.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MonitoringSurface>
  );
}
