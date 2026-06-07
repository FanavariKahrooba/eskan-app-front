"use client";

import { MonitoringShell } from "@/features/monitoring/core/components/monitoring-shell";
import { MonitoringThemeToggle } from "@/features/monitoring/core/components/monitoring-theme-toggle";
import { MonitoringRefreshBadge } from "@/features/monitoring/core/components/monitoring-refresh-badge";
import { useShelterMonitoringDashboard } from "../hooks/use-shelter-monitoring-dashboard";
import { useShelterCapacityLogs } from "../hooks/use-shelter-capacity-logs";
import {
  formatDateTimeFa,
  labelizePriority,
  labelizeShelterStatus,
} from "../utils/shelter-monitoring-format";
import { chartMapToData } from "../utils/shelter-monitoring-transforms";
import { ShelterMonitoringKpiCard } from "../components/shelter-monitoring-kpi-card";
import { ShelterMonitoringAlertsBoard } from "../components/shelter-monitoring-alerts-board";
import { ShelterMonitoringTopShelters } from "../components/shelter-monitoring-top-shelters";
import { ShelterMonitoringRecentRequests } from "../components/shelter-monitoring-recent-requests";
import { ShelterMonitoringCapacityLogs } from "../components/shelter-monitoring-capacity-logs";
import { ShelterMonitoringChartCard } from "../components/shelter-monitoring-chart-card";
import { ShelterMonitoringDonutChart } from "../components/shelter-monitoring-donut-chart";
import { ShelterMonitoringBarChart } from "../components/shelter-monitoring-bar-chart";
import { MonitoringSurface } from "@/features/monitoring/core/components/monitoring-surface";

export function ShelterMonitoringFullscreenPage() {
  const { dashboard, kpis, alerts, isLoading, isError, lastUpdatedAt } =
    useShelterMonitoringDashboard(undefined, {
      refetchInterval: 20000,
    });

  const { data: capacityLogsResponse } = useShelterCapacityLogs({
    page: 1,
    per_page: 5,
  });

  const requestsByPriority = chartMapToData(
    dashboard.charts.requests_by_priority,
    labelizePriority,
  );

  const requestsByStatus = chartMapToData(
    dashboard.charts.requests_by_status,
    labelizeShelterStatus,
  );

  return (
    <MonitoringShell
      title="Shelter Monitoring Wallboard"
      subtitle="نمای تمام‌صفحه مناسب تلویزیون و اتاق مانیتورینگ"
      tvMode
      actions={
        <>
          <MonitoringRefreshBadge
            autoRefreshLabel="Wallboard Auto Refresh"
            lastUpdatedLabel={
              lastUpdatedAt
                ? formatDateTimeFa(lastUpdatedAt.toISOString())
                : "در انتظار داده"
            }
          />
          <MonitoringThemeToggle />
        </>
      }
      contentClassName="pb-6"
    >
      {isError ? (
        <MonitoringSurface className="border-rose-500/30 bg-rose-500/10 p-8">
          <h2 className="text-2xl font-black text-rose-200">
            اختلال در دریافت داده‌های مانیتورینگ
          </h2>
          <p className="mt-2 text-rose-100/80">
            اتصال به API داشبورد اسکان بررسی شود.
          </p>
        </MonitoringSurface>
      ) : null}

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4 2xl:grid-cols-8">
        {kpis.slice(0, 8).map((item) => (
          <ShelterMonitoringKpiCard key={item.id} item={item} large />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 2xl:grid-cols-12">
        <div className="2xl:col-span-4">
          <ShelterMonitoringAlertsBoard alerts={alerts.slice(0, 4)} compact />
        </div>

        <div className="2xl:col-span-4">
          <ShelterMonitoringTopShelters
            items={dashboard.top_shelters_by_occupancy}
            compact
          />
        </div>

        <div className="2xl:col-span-4">
          <ShelterMonitoringRecentRequests
            items={dashboard.recent_requests}
            compact
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 2xl:grid-cols-12">
        <div className="2xl:col-span-4">
          <ShelterMonitoringChartCard
            title="اولویت درخواست‌ها"
            subtitle="فوری، بالا، عادی"
          >
            <ShelterMonitoringDonutChart
              data={requestsByPriority}
              centerLabel="اولویت"
              height={260}
            />
          </ShelterMonitoringChartCard>
        </div>

        <div className="2xl:col-span-4">
          <ShelterMonitoringChartCard
            title="وضعیت درخواست‌ها"
            subtitle="توزیع پردازش عملیاتی"
          >
            <ShelterMonitoringBarChart data={requestsByStatus} height={320} />
          </ShelterMonitoringChartCard>
        </div>

        <div className="2xl:col-span-4">
          <ShelterMonitoringCapacityLogs
            items={capacityLogsResponse?.data ?? []}
            compact
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <MonitoringSurface className="p-6">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm monitoring-muted">سراهای فعال</div>
              <div className="mt-3 text-4xl font-black monitoring-title">
                {isLoading ? "..." : dashboard.summary.active_shelters_count}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm monitoring-muted">سراهای فعال‌شده</div>
              <div className="mt-3 text-4xl font-black monitoring-title">
                {isLoading ? "..." : dashboard.summary.enabled_shelters_count}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm monitoring-muted">فضاهای فعال</div>
              <div className="mt-3 text-4xl font-black monitoring-title">
                {isLoading ? "..." : dashboard.summary.active_spaces_count}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm monitoring-muted">فضاهای قابل رزرو</div>
              <div className="mt-3 text-4xl font-black monitoring-title">
                {isLoading ? "..." : dashboard.summary.reservable_spaces_count}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm monitoring-muted">کل درخواست‌ها</div>
              <div className="mt-3 text-4xl font-black monitoring-title">
                {isLoading ? "..." : dashboard.summary.requests_count}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm monitoring-muted">کل رزروها</div>
              <div className="mt-3 text-4xl font-black monitoring-title">
                {isLoading ? "..." : dashboard.summary.reservations_count}
              </div>
            </div>
          </div>
        </MonitoringSurface>
      </section>
    </MonitoringShell>
  );
}
