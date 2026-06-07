"use client";

import { ShelterMonitoringCapacity } from "../types/shelter-monitoring.types";
import { ShelterMonitoringDonutChart } from "./shelter-monitoring-donut-chart";
import { ShelterMonitoringChartCard } from "./shelter-monitoring-chart-card";
import {
  formatNumber,
  formatPercent,
} from "../utils/shelter-monitoring-format";

export function ShelterMonitoringOccupancySummary({
  capacity,
}: {
  capacity: ShelterMonitoringCapacity;
}) {
  const data = [
    {
      name: "خالی",
      value: Number(capacity.available ?? 0),
      color: "#22c55e",
    },
    {
      name: "رزرو شده",
      value: Number(capacity.reserved ?? 0),
      color: "#f59e0b",
    },
    {
      name: "اشغال شده",
      value: Number(capacity.occupied ?? 0),
      color: "#06b6d4",
    },
    {
      name: "اضطراری",
      value: Number(capacity.emergency ?? 0),
      color: "#f43f5e",
    },
  ];

  return (
    <ShelterMonitoringChartCard
      title="ترکیب وضعیت ظرفیت"
      subtitle="نمای توزیع ظرفیت‌های قابل استفاده در سراهای اسکان"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ShelterMonitoringDonutChart
          data={data}
          centerLabel="ظرفیت کل"
          height={300}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm monitoring-muted">ظرفیت کل</div>
            <div className="mt-2 text-3xl font-black monitoring-title">
              {formatNumber(capacity.total)}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm monitoring-muted">قابل استفاده</div>
            <div className="mt-2 text-3xl font-black monitoring-title">
              {formatNumber(capacity.usable)}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm monitoring-muted">نرخ اشغال</div>
            <div className="mt-2 text-3xl font-black text-cyan-300">
              {formatPercent(capacity.occupancy_percent)}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm monitoring-muted">ظرفیت خالی</div>
            <div className="mt-2 text-3xl font-black text-emerald-300">
              {formatNumber(capacity.available)}
            </div>
          </div>
        </div>
      </div>
    </ShelterMonitoringChartCard>
  );
}
