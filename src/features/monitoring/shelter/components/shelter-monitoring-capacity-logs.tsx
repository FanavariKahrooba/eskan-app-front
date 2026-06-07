"use client";

import { MonitoringSurface } from "@/features/monitoring/core/components/monitoring-surface";
import { ShelterMonitoringSectionHeader } from "./shelter-monitoring-section-header";
import { ShelterMonitoringEmptyState } from "./shelter-monitoring-empty-state";
import { ShelterCapacityLogItem } from "../types/shelter-monitoring.types";
import {
  formatDateTimeFa,
  formatNumber,
} from "../utils/shelter-monitoring-format";

function changeTypeLabel(type?: string | null) {
  switch (type) {
    case "reservation_created":
      return "ایجاد رزرو";
    case "reservation_cancelled":
      return "لغو رزرو";
    case "check_in":
      return "پذیرش";
    case "check_out":
      return "خروج";
    case "manual_adjustment":
      return "اصلاح دستی";
    default:
      return type || "نامشخص";
  }
}

export function ShelterMonitoringCapacityLogs({
  items,
  compact,
}: {
  items: ShelterCapacityLogItem[];
  compact?: boolean;
}) {
  return (
    <MonitoringSurface className="p-6">
      <ShelterMonitoringSectionHeader
        title="تغییرات ظرفیت"
        subtitle="آخرین رویدادهای مؤثر بر وضعیت ظرفیت در سراها"
      />

      {!items.length ? (
        <ShelterMonitoringEmptyState
          title="لاگ ظرفیتی موجود نیست"
          description="در حال حاضر رویداد ثبت‌شده‌ای برای ظرفیت یافت نشد."
        />
      ) : (
        <div className="space-y-3">
          {items.slice(0, compact ? 5 : 8).map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold monitoring-title">
                    {item.neighborhood_hall_name ?? "سرای نامشخص"}
                  </div>
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">
                    {changeTypeLabel(item.change_type)}
                  </div>
                </div>

                <div className="text-sm monitoring-muted">
                  {item.description || "تغییری در ظرفیت ثبت شده است."}
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs monitoring-muted md:grid-cols-3">
                  <div>
                    خالی: {formatNumber(item.before_available_capacity)} ←{" "}
                    {formatNumber(item.after_available_capacity)}
                  </div>
                  <div>
                    رزرو: {formatNumber(item.before_reserved_capacity)} ←{" "}
                    {formatNumber(item.after_reserved_capacity)}
                  </div>
                  <div>
                    اشغال: {formatNumber(item.before_occupied_capacity)} ←{" "}
                    {formatNumber(item.after_occupied_capacity)}
                  </div>
                </div>

                <div className="text-xs monitoring-muted">
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
