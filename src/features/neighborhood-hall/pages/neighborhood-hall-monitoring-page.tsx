"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Expand,
  Maximize,
  Minimize,
  Radar,
  RefreshCcw,
  Server,
  Siren,
  MonitorUp,
} from "lucide-react";
import EmptyState from "@/features/power-shell-pro/components/enterprise/empty-state";
import PermissionGuard from "@/features/power-shell-pro/components/enterprise/permission-guard";
import PageShell from "@/features/power-shell/components/breadcrumb-tools/page-shell";
import { useNeighborhoodHallMonitoring } from "../hooks/use-neighborhood-hall-monitoring";
import {
  KpiTile,
  MonitoringCard,
  StatusDot,
} from "../components/neighborhood-hall-monitoring-shared";
import {
  ErrorsBarChart,
  RequestsUsersMiniChart,
  TrafficAreaChart,
} from "../components/neighborhood-hall-monitoring-charts";
import NeighborhoodHallMonitoringFilters from "../components/neighborhood-hall-monitoring-filters";
import NeighborhoodHallMonitoringSkeleton from "../components/neighborhood-hall-monitoring-skeleton";

const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر سامانه",
  permissions: ["dashboard.view", "neighborhood_hall.monitoring.view"],
};

type Props = {
  fullscreen?: boolean;
};

export default function NeighborhoodHallMonitoringPage({
  fullscreen = false,
}: Props) {
  const {
    data,
    loading,
    refreshing,
    error,
    autoRefresh,
    setAutoRefresh,
    filters,
    setFilters,
    regions,
    filteredServices,
    filteredAlerts,
    filteredVectors,
    reload,
  } = useNeighborhoodHallMonitoring();

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [browserFullscreen, setBrowserFullscreen] = React.useState(false);

  const handleBrowserFullscreen = React.useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await (
          containerRef.current || document.documentElement
        ).requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // intentionally silent
    }
  }, []);

  React.useEffect(() => {
    const onChange = () => {
      setBrowserFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const content = (
    <div
      ref={containerRef}
      className="min-h-screen bg-[radial-gradient(circle_at_top_right,#1e293b_0%,#0f172a_45%,#020617_100%)] text-white"
    >
      <div className="mx-auto w-full max-w-[1800px] space-y-6 p-4 md:p-6">
        <div className="rounded-[28px] border border-cyan-400/10 bg-white/5 p-4 backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                <Radar size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                  داشبورد مانیتورینگ حرفه‌ای
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  پایش لحظه‌ای سرویس‌ها، هشدارها، ترافیک و بار عملیاتی سراهای
                  محله
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAutoRefresh((prev) => !prev)}
                className={`inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-bold transition ${
                  autoRefresh
                    ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/20"
                    : "bg-white/10 text-slate-300 ring-1 ring-white/10"
                }`}
              >
                <Activity size={16} />
                {autoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
              </button>

              <button
                type="button"
                onClick={() => reload(true)}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-bold text-white ring-1 ring-white/10 transition hover:bg-white/15"
              >
                <RefreshCcw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                بروزرسانی
              </button>

              <button
                type="button"
                onClick={handleBrowserFullscreen}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-violet-500/20 px-4 text-sm font-bold text-violet-200 ring-1 ring-violet-400/20 transition hover:bg-violet-500/25"
              >
                <MonitorUp size={16} />
                {browserFullscreen
                  ? "خروج از Fullscreen Browser"
                  : "Fullscreen Browser"}
              </button>

              {!fullscreen ? (
                <Link
                  href={`${APP_BASE_PATH}/neighborhood-halls/monitoring/fullscreen`}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-cyan-500/20 px-4 text-sm font-bold text-cyan-300 ring-1 ring-cyan-400/20 transition hover:bg-cyan-500/25"
                >
                  <Maximize size={16} />
                  Focus Mode
                </Link>
              ) : (
                <Link
                  href={`${APP_BASE_PATH}/neighborhood-halls/monitoring`}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-bold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                >
                  <Minimize size={16} />
                  خروج از Focus Mode
                </Link>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
              آخرین بروزرسانی: {data?.generated_at || "-"}
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
              بازه بروزرسانی: {data?.refresh_interval_sec || 0} ثانیه
            </span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-emerald-300 ring-1 ring-emerald-400/20">
              Realtime Monitoring
            </span>
          </div>
        </div>

        <NeighborhoodHallMonitoringFilters
          filters={filters}
          onChange={setFilters}
          regions={regions}
        />

        {error ? (
          <div className="rounded-3xl bg-white p-4">
            <EmptyState title="خطا در مانیتورینگ" description={error} />
          </div>
        ) : null}

        {loading ? (
          <NeighborhoodHallMonitoringSkeleton />
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {(data?.kpis || []).map((kpi) => (
                <KpiTile
                  key={kpi.title}
                  title={kpi.title}
                  value={kpi.value}
                  unit={kpi.unit}
                  change={kpi.change}
                  status={kpi.status}
                />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <MonitoringCard
                title="روند درخواست‌ها و کاربران فعال"
                className="xl:col-span-8"
              >
                <TrafficAreaChart data={data?.traffic || []} />
              </MonitoringCard>

              <MonitoringCard
                title="نمای سریع ترافیک"
                className="xl:col-span-4"
              >
                <RequestsUsersMiniChart data={data?.traffic || []} />
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="text-xs text-slate-400">
                      بیشترین درخواست
                    </div>
                    <div className="mt-2 text-2xl font-black text-white">
                      {Math.max(
                        ...(data?.traffic || []).map((x) => x.requests),
                        0,
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="text-xs text-slate-400">
                      بیشترین کاربر فعال
                    </div>
                    <div className="mt-2 text-2xl font-black text-emerald-300">
                      {Math.max(
                        ...(data?.traffic || []).map((x) => x.active_users),
                        0,
                      )}
                    </div>
                  </div>
                </div>
              </MonitoringCard>
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <MonitoringCard title="وضعیت سرویس‌ها" className="xl:col-span-4">
                <div className="space-y-3">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <StatusDot status={service.status} />
                          <div>
                            <div className="font-bold text-white">
                              {service.name}
                            </div>
                            <div className="mt-1 text-xs text-slate-400">
                              {service.region_name || "-"}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-white">
                            {service.latency_ms} ms
                          </div>
                          <div className="text-xs text-slate-400">
                            uptime {service.uptime_percent}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredServices.length === 0 ? (
                    <div className="rounded-2xl bg-white/5 p-6 text-sm text-slate-400 ring-1 ring-white/10">
                      موردی برای این فیلتر پیدا نشد.
                    </div>
                  ) : null}
                </div>
              </MonitoringCard>

              <MonitoringCard title="نمودار خطاها" className="xl:col-span-4">
                <ErrorsBarChart data={data?.traffic || []} />
              </MonitoringCard>

              <MonitoringCard
                title="بار عملیاتی مناطق"
                className="xl:col-span-4"
              >
                <div className="space-y-4">
                  {filteredVectors.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-bold text-white">{item.name}</div>
                        <div
                          className={`text-xs font-bold ${
                            item.status === "healthy"
                              ? "text-emerald-300"
                              : item.status === "warning"
                                ? "text-amber-300"
                                : "text-rose-300"
                          }`}
                        >
                          {item.status === "healthy"
                            ? "پایدار"
                            : item.status === "warning"
                              ? "هشدار"
                              : "بحرانی"}
                        </div>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${
                            item.status === "healthy"
                              ? "bg-emerald-400"
                              : item.status === "warning"
                                ? "bg-amber-400"
                                : "bg-rose-400"
                          }`}
                          style={{ width: `${item.load_percent}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>بار: {item.load_percent}%</span>
                        <span>سراهای فعال: {item.active_halls}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </MonitoringCard>
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <MonitoringCard title="هشدارهای فعال" className="xl:col-span-5">
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 rounded-xl p-2 ${
                              alert.severity === "critical"
                                ? "bg-rose-500/20 text-rose-300"
                                : alert.severity === "warning"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-sky-500/20 text-sky-300"
                            }`}
                          >
                            <Siren size={16} />
                          </div>

                          <div>
                            <div className="font-bold text-white">
                              {alert.title}
                            </div>
                            <div className="mt-1 text-xs text-slate-400">
                              {alert.source} | {alert.region_name || "-"}
                            </div>
                            {alert.description ? (
                              <p className="mt-2 text-xs leading-6 text-slate-300">
                                {alert.description}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="text-xs text-slate-500">
                          {alert.created_at}
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredAlerts.length === 0 ? (
                    <div className="rounded-2xl bg-white/5 p-6 text-sm text-slate-400 ring-1 ring-white/10">
                      هشدار فعالی برای این فیلتر وجود ندارد.
                    </div>
                  ) : null}
                </div>
              </MonitoringCard>

              <MonitoringCard
                title="شاخص سلامت سیستم"
                className="xl:col-span-3"
              >
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="text-xs text-slate-400">Health Score</div>
                    <div className="mt-2 text-3xl font-black text-emerald-300">
                      94
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="text-xs text-slate-400">Risk Index</div>
                    <div className="mt-2 text-3xl font-black text-amber-300">
                      27
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                      <Server size={16} />
                      System Pressure
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400" />
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      میانگین فشار سیستم در وضعیت کنترل‌شده قرار دارد.
                    </div>
                  </div>
                </div>
              </MonitoringCard>

              <MonitoringCard
                title="رخدادهای لحظه‌ای"
                className="xl:col-span-4"
              >
                <div className="space-y-3">
                  {(data?.logs || []).map((row) => (
                    <div
                      key={row.id}
                      className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-white">
                            {row.event}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {row.actor || "-"} / {row.target || "-"}
                          </div>
                        </div>

                        <div className="text-left">
                          <div
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              row.level === "error"
                                ? "bg-rose-500/20 text-rose-300"
                                : row.level === "warning"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-sky-500/20 text-sky-300"
                            }`}
                          >
                            {row.level}
                          </div>
                          <div className="mt-2 text-xs text-slate-500">
                            {row.created_at}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </MonitoringCard>
            </section>
          </>
        )}
      </div>
    </div>
  );

  const fallback = (
    <div className="p-6">
      <EmptyState
        title="عدم دسترسی"
        description="شما دسترسی مشاهده مانیتورینگ را ندارید."
      />
    </div>
  );

  if (fullscreen) {
    return (
      <PermissionGuard
        permissions={currentUser.permissions}
        required="neighborhood_hall.monitoring.view"
        fallback={fallback}
      >
        {content}
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="neighborhood_hall.monitoring.view"
      fallback={fallback}
    >
      <PageShell
        title="مانیتورینگ سراهای محله"
        description="داشبورد حرفه‌ای پایش لحظه‌ای سراها و سرویس‌های مرتبط"
        favoriteKey="neighborhood-hall-monitoring"
        currentPath={`${APP_BASE_PATH}/neighborhood-halls/monitoring`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "سراهای محله", href: `${APP_BASE_PATH}/neighborhood-halls` },
          {
            label: "مانیتورینگ",
            href: `${APP_BASE_PATH}/neighborhood-halls/monitoring`,
          },
        ]}
        actions={[
          {
            id: "refresh",
            label: "بروزرسانی",
            icon: <RefreshCcw size={16} />,
            variant: "secondary",
            onClick: () => reload(true),
          },
          {
            id: "fullscreen",
            label: "فول اسکرین",
            icon: <Expand size={16} />,
            variant: "primary",
            href: `${APP_BASE_PATH}/neighborhood-halls/monitoring/fullscreen`,
          },
        ]}
        commandActions={[
          {
            id: "monitoring-open",
            title: "داشبورد مانیتورینگ",
            subtitle: "نمایش پایش حرفه‌ای و لحظه‌ای",
            group: "سراهای محله",
            href: `${APP_BASE_PATH}/neighborhood-halls/monitoring`,
            keywords: ["monitoring", "dashboard", "realtime", "مانیتورینگ"],
          },
          {
            id: "monitoring-fullscreen",
            title: "مانیتورینگ فول اسکرین",
            subtitle: "نمای تمام‌صفحه مانیتورینگ",
            group: "سراهای محله",
            href: `${APP_BASE_PATH}/neighborhood-halls/monitoring/fullscreen`,
            keywords: ["fullscreen", "focus", "live"],
          },
        ]}
      >
        {content}
      </PageShell>
    </PermissionGuard>
  );
}
