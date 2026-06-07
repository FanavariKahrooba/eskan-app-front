"use client";

import { MonitoringShell } from "@/features/monitoring/core/components/monitoring-shell";
import { MonitoringThemeToggle } from "@/features/monitoring/core/components/monitoring-theme-toggle";
import { MonitoringFullscreenButton } from "@/features/monitoring/core/components/monitoring-fullscreen-button";
import { MonitoringRefreshBadge } from "@/features/monitoring/core/components/monitoring-refresh-badge";
import { useShelterMonitoringDashboard } from "../hooks/use-shelter-monitoring-dashboard";
import { useShelterCapacityLogs } from "../hooks/use-shelter-capacity-logs";
import {
  formatDateTimeFa,
  labelizePriority,
  labelizeShelterStatus,
  labelizeRequestType,
} from "../utils/shelter-monitoring-format";
import { chartMapToData } from "../utils/shelter-monitoring-transforms";
import { ShelterMonitoringKpiCard } from "../components/shelter-monitoring-kpi-card";
import { ShelterMonitoringAlertsBoard } from "../components/shelter-monitoring-alerts-board";
import { ShelterMonitoringOccupancySummary } from "../components/shelter-monitoring-occupancy-summary";
import { ShelterMonitoringChartCard } from "../components/shelter-monitoring-chart-card";
import { ShelterMonitoringBarChart } from "../components/shelter-monitoring-bar-chart";
import { ShelterMonitoringDonutChart } from "../components/shelter-monitoring-donut-chart";
import { ShelterMonitoringTopShelters } from "../components/shelter-monitoring-top-shelters";
import { ShelterMonitoringRecentRequests } from "../components/shelter-monitoring-recent-requests";
import { ShelterMonitoringCapacityLogs } from "../components/shelter-monitoring-capacity-logs";
import { ShelterMonitoringSkeleton } from "../components/shelter-monitoring-skeleton";
import { MonitoringSurface } from "@/features/monitoring/core/components/monitoring-surface";

export function ShelterMonitoringPage() {
  const {
    dashboard,
    kpis,
    alerts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    lastUpdatedAt,
  } = useShelterMonitoringDashboard(undefined, {
    refetchInterval: 30000,
  });

  const { data: capacityLogsResponse, isLoading: logsLoading } =
    useShelterCapacityLogs({
      page: 1,
      per_page: 8,
    });

  const requestsByPriority = chartMapToData(
    dashboard.charts.requests_by_priority,
    labelizePriority,
  );

  const requestsByStatus = chartMapToData(
    dashboard.charts.requests_by_status,
    labelizeShelterStatus,
  );

  const requestsByType = chartMapToData(
    dashboard.charts.requests_by_type,
    labelizeRequestType,
  );

  const reservationsByStatus = chartMapToData(
    dashboard.charts.reservations_by_status,
    labelizeShelterStatus,
  );

  return (
    <MonitoringShell
      title="Shelter Monitoring Command Center"
      subtitle="رصد حرفه‌ای ظرفیت، درخواست‌ها، رزروها و وضعیت عملیاتی سراهای اسکان"
      actions={
        <>
          <MonitoringRefreshBadge
            lastUpdatedLabel={
              lastUpdatedAt
                ? `آخرین بروزرسانی: ${formatDateTimeFa(lastUpdatedAt.toISOString())}`
                : "در انتظار دریافت داده"
            }
          />
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {isFetching ? "در حال بروزرسانی..." : "بروزرسانی دستی"}
          </button>
          <MonitoringThemeToggle />
          <MonitoringFullscreenButton targetId="shelter-monitoring-screen" />
        </>
      }
    >
      <div id="shelter-monitoring-screen" className="grid grid-cols-1 gap-4">
        {isError ? (
          <MonitoringSurface className="border-rose-500/30 bg-rose-500/10 p-6">
            <h2 className="text-lg font-bold text-rose-300">
              خطا در دریافت اطلاعات مانیتورینگ
            </h2>
            <p className="mt-2 text-sm text-rose-100/80">
              {error instanceof Error ? error.message : "خطای نامشخص"}
            </p>
          </MonitoringSurface>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {(isLoading ? Array.from({ length: 8 }) : kpis).map((item, index) =>
            isLoading ? (
              <ShelterMonitoringSkeleton key={index} className="h-[160px]" />
            ) : (
              <ShelterMonitoringKpiCard key={item.id} item={item} />
            ),
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 2xl:grid-cols-3">
          <div className="2xl:col-span-2">
            <ShelterMonitoringOccupancySummary capacity={dashboard.capacity} />
          </div>

          <div>
            <ShelterMonitoringAlertsBoard alerts={alerts} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
          <ShelterMonitoringChartCard
            title="درخواست‌ها بر اساس اولویت"
            subtitle="توزیع درخواست‌ها به تفکیک urgency"
            className="2xl:col-span-1"
          >
            <ShelterMonitoringDonutChart
              data={requestsByPriority}
              centerLabel="درخواست"
            />
          </ShelterMonitoringChartCard>

          <ShelterMonitoringChartCard
            title="درخواست‌ها بر اساس وضعیت"
            subtitle="وضعیت عملیاتی درخواست‌ها"
            className="2xl:col-span-1"
          >
            <ShelterMonitoringBarChart data={requestsByStatus} />
          </ShelterMonitoringChartCard>

          <ShelterMonitoringChartCard
            title="درخواست‌ها بر اساس نوع"
            subtitle="تفکیک نوع خدمت اسکان"
            className="2xl:col-span-1"
          >
            <ShelterMonitoringDonutChart
              data={requestsByType}
              centerLabel="نوع درخواست"
            />
          </ShelterMonitoringChartCard>

          <ShelterMonitoringChartCard
            title="رزروها بر اساس وضعیت"
            subtitle="نمای عملیاتی رزروها"
            className="2xl:col-span-1"
          >
            <ShelterMonitoringBarChart data={reservationsByStatus} />
          </ShelterMonitoringChartCard>
        </section>

        <section className="grid grid-cols-1 gap-4 2xl:grid-cols-3">
          <div className="2xl:col-span-1">
            <ShelterMonitoringTopShelters
              items={dashboard.top_shelters_by_occupancy}
            />
          </div>

          <div className="2xl:col-span-1">
            <ShelterMonitoringRecentRequests
              items={dashboard.recent_requests}
            />
          </div>

          <div className="2xl:col-span-1">
            {logsLoading ? (
              <ShelterMonitoringSkeleton className="h-[520px]" />
            ) : (
              <ShelterMonitoringCapacityLogs
                items={capacityLogsResponse?.data ?? []}
              />
            )}
          </div>
        </section>
      </div>
    </MonitoringShell>
  );
}
