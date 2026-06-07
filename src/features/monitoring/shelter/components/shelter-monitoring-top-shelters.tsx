"use client";

import { ShelterTopItem } from "../types/shelter-monitoring.types";
import { ShelterMonitoringEmptyState } from "./shelter-monitoring-empty-state";
import { MonitoringSurface } from "@/features/monitoring/core/components/monitoring-surface";
import { ShelterMonitoringSectionHeader } from "./shelter-monitoring-section-header";
import { formatNumber } from "../utils/shelter-monitoring-format";

export function ShelterMonitoringTopShelters({
  items,
  compact,
}: {
  items: ShelterTopItem[];
  compact?: boolean;
}) {
  return (
    <MonitoringSurface className="p-6">
      <ShelterMonitoringSectionHeader
        title="سراهای برتر از نظر اشغال"
        subtitle="مرتب شده بر اساس درصد اشغال برای تصمیم‌گیری سریع"
      />

      {!items.length ? (
        <ShelterMonitoringEmptyState />
      ) : (
        <div className="space-y-3">
          {items.slice(0, compact ? 5 : 8).map((item, index) => {
            const percent = Math.max(
              0,
              Math.min(100, Number(item.occupancy_percent ?? 0)),
            );

            return (
              <div
                key={`${item.neighborhood_hall_id}-${index}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold monitoring-title">
                      {item.neighborhood_hall_name ?? "بدون نام"}
                    </div>
                    <div className="mt-1 text-xs monitoring-muted">
                      ظرفیت کل: {formatNumber(item.total_capacity)} | اشغال‌شده:{" "}
                      {formatNumber(item.occupied_capacity)}
                    </div>
                  </div>

                  <div className="text-xl font-black text-cyan-300">
                    {percent.toFixed(1)}%
                  </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${
                      percent >= 90
                        ? "bg-rose-400"
                        : percent >= 75
                          ? "bg-amber-400"
                          : "bg-cyan-400"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {!compact ? (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs monitoring-muted">
                    <div>خالی: {formatNumber(item.available_capacity)}</div>
                    <div>رزرو: {formatNumber(item.reserved_capacity)}</div>
                    <div>
                      قابل استفاده: {formatNumber(item.usable_capacity)}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </MonitoringSurface>
  );
}
