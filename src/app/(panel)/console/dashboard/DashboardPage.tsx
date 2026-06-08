/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import EmptyState from "@/features/power-shell-pro/components/enterprise/empty-state";
import PageTabs from "@/features/power-shell-pro/components/enterprise/page-tabs";
import PageToolbar from "@/features/power-shell-pro/components/enterprise/page-toolbar";
import PermissionGuard from "@/features/power-shell-pro/components/enterprise/permission-guard";
import { useAuditLog } from "@/features/power-shell-pro/hooks/use-audit-log";
import { usePagePreferences } from "@/features/power-shell-pro/hooks/use-page-preferences";
import PageShell from "@/features/power-shell/components/breadcrumb-tools/page-shell";

import {
  AlertTriangle,
  ArrowDownUp,
  Cuboid,
  Database,
  Eye,
  Gauge,
  Layers3,
  Plus,
  Radar,
  RefreshCcw,
  Settings,
  ShieldAlert,
  Sparkles,
  TimerReset,
  Wrench,
} from "lucide-react";
import { GiTallBridge } from "react-icons/gi";

import { useDashboardOverview } from "./use-dashboard-overview";
import { MonitoringSkeleton } from "@/features/monitoring/shared/components/monitoring-skeleton";
import { MonitoringErrorState } from "@/features/monitoring/shared/components/monitoring-error-state";
import { MonitoringFadeIn } from "@/features/monitoring/shared/components/monitoring-fade-in";

const PAGE_KEY = "bridge-dashboard-main";
const APP_BASE_PATH = "";

const currentUser = {
  id: "user_1",
  name: "مدیر سامانه",
  permissions: [
    "dashboard.view",
    "dashboard.executive.view",
    "orders.view",
    "reports.view",
    "settings.view",
    "ai.view",
    "tables.view",
    "inventory.view",
  ],
  featureFlags: ["executive_dashboard", "advanced_reports", "ai_assistant"],
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function formatRelative(dateIso?: string) {
  if (!dateIso) return "—";
  const diff = Date.now() - new Date(dateIso).getTime();
  const mins = Math.max(0, Math.floor(diff / 60000));
  if (mins < 1) return "همین حالا";
  if (mins < 60) return `${toPersianDigits(mins)} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${toPersianDigits(days)} روز پیش`;
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        className,
      )}
    >
      {label}
    </span>
  );
}

function getSeverityMeta(severity: "high" | "medium" | "low") {
  switch (severity) {
    case "high":
      return {
        label: "بحرانی",
        className: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
      };
    case "medium":
      return {
        label: "متوسط",
        className:
          "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
      };
    case "low":
      return {
        label: "کم",
        className: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
      };
    default:
      return {
        label: "نامشخص",
        className: "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200",
      };
  }
}

function getHealthMeta(status?: "healthy" | "warning" | "critical") {
  switch (status) {
    case "healthy":
      return {
        label: "پایدار",
        className:
          "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
      };
    case "warning":
      return {
        label: "نیاز به بررسی",
        className:
          "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
      };
    case "critical":
      return {
        label: "بحرانی",
        className: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
      };
    default:
      return {
        label: "نامشخص",
        className: "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200",
      };
  }
}

function getInspectionStatusMeta(
  status?: "completed" | "in_progress" | "scheduled",
) {
  switch (status) {
    case "completed":
      return {
        label: "تکمیل شده",
        className:
          "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
      };
    case "in_progress":
      return {
        label: "در حال انجام",
        className: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
      };
    case "scheduled":
      return {
        label: "برنامه‌ریزی شده",
        className:
          "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
      };
    default:
      return {
        label: "نامشخص",
        className: "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200",
      };
  }
}

function StatCard({
  title,
  value,
  description,
  icon,
  tone = "default",
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  tone?: "default" | "blue" | "emerald" | "amber" | "rose" | "violet";
}) {
  const tones = {
    default: "bg-gray-50 text-gray-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="mt-2 text-2xl font-bold text-gray-950">{value}</div>
          <div className="mt-1 text-xs text-gray-400">{description}</div>
        </div>
        <div
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-xl",
            tones[tone],
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-950">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const {
    preferences,
    loading: preferenceLoading,
    saving,
    setActiveTab,
    setSearch,
    setDensity,
    setPageSize,
    resetPreferences,
  } = usePagePreferences({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
    defaultValue: {
      activeTab: "all",
      search: "",
      density: "comfortable",
      pageSize: 10,
      visibleColumns: ["alerts", "inspections", "members"],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const activeTab =
    (preferences.activeTab as "all" | "critical" | "monitoring" | "model") ||
    "all";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const [filters, setFilters] = React.useState<{
    top?: number;
    recent?: number;
    alerts?: number;
    search?: string;
    tab?: string;
  }>({
    top: 5,
    recent: 8,
    alerts: pageSize,
    search,
    tab: activeTab,
  });

  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search,
      alerts: pageSize,
      tab: activeTab,
    }));
  }, [search, pageSize, activeTab]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  }:any = useDashboardOverview(filters);

  if (isLoading || preferenceLoading) {
    return (
      <div className="p-6">
        <MonitoringSkeleton />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="p-6">
        <MonitoringErrorState
          message={error instanceof Error ? error.message : undefined}
        />
      </div>
    );
  }

  const data = response.data;

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="dashboard.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده داشبورد را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="داشبورد اصلی"
        description="نمای یکپارچه و حرفه‌ای از شاخص‌ها، هشدارها، وضعیت پایش، مدل‌ها و فعالیت‌های اخیر سامانه."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/dashboard`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={isLoading || preferenceLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "داشبورد", href: `${APP_BASE_PATH}/dashboard` },
          { label: "داشبورد اصلی", href: `${APP_BASE_PATH}/dashboard` },
        ]}
        actions={[
          {
            id: "refresh",
            label: "بروزرسانی",
            icon: <RefreshCcw size={16} />,
            variant: "secondary",
            onClick: async () => {
              audit.track({
                type: "dashboard.refreshed",
                message: "Dashboard refresh clicked",
              });
              await refetch();
            },
          },
          {
            id: "new-inspection",
            label: "ثبت بازرسی",
            icon: <Plus size={16} />,
            variant: "primary",
            onClick: () => {
              audit.track({
                type: "dashboard.action",
                message: "New inspection clicked",
              });
            },
          },
        ]}
        commandActions={[
          {
            id: "dashboard-main",
            title: "داشبورد اصلی",
            subtitle: "نمای کلی وضعیت سامانه",
            group: "داشبورد",
            href: `${APP_BASE_PATH}/dashboard`,
            keywords: ["dashboard", "main", "داشبورد"],
          },
          {
            id: "dashboard-executive",
            title: "داشبورد مدیریتی",
            subtitle: "شاخص‌های کلان مدیریتی",
            group: "داشبورد",
            href: `${APP_BASE_PATH}/dashboard/executive`,
            keywords: ["executive", "analytics", "مدیریتی"],
          },
          {
            id: "reset-dashboard-preferences",
            title: "بازنشانی تنظیمات داشبورد",
            subtitle: "پاک‌کردن تنظیمات ذخیره‌شده این صفحه",
            group: "تنظیمات",
            onSelect: async () => {
              await resetPreferences();
              audit.track({
                type: "dashboard.filtered",
                message: "Dashboard preferences reset",
              });
            },
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
              {toPersianDigits(data.summary?.critical_alerts ?? 0)} هشدار بحرانی
            </span>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              {toPersianDigits(data.summary?.warning_items ?? 0)} مورد نیازمند
              بررسی
            </span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {toPersianDigits(data.summary?.active_monitors ?? 0)} منبع پایش
              فعال
            </span>
            {saving ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                در حال ذخیره...
              </span>
            ) : null}
          </div>
        }
        headerRightSlot={
          <PermissionGuard
            permissions={currentUser.permissions}
            required="settings.view"
          >
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Settings size={16} />
              تنظیمات
            </button>
          </PermissionGuard>
        }
      >
        <div className="space-y-6">
          <MonitoringFadeIn>
            <PageToolbar
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                audit.track({
                  type: "dashboard.filtered",
                  message: "Dashboard search changed",
                  metadata: { search: value },
                });
              }}
              density={density}
              onDensityChange={(value) => setDensity(value)}
              pageSize={pageSize}
              onPageSizeChange={(value) => setPageSize(value)}
              onResetPreferences={async () => {
                await resetPreferences();
                audit.track({
                  type: "dashboard.filtered",
                  message: "Dashboard preferences reset",
                });
              }}
              saving={saving}
            />
          </MonitoringFadeIn>

          <MonitoringFadeIn delay={0.03}>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 shadow-sm">
              <PageTabs
                value={activeTab}
                onChange={(tab) => {
                  setActiveTab(tab);
                  audit.track({
                    type: "dashboard.filtered",
                    message: "Dashboard tab changed",
                    metadata: { tab },
                  });
                }}
                tabs={[
                  {
                    id: "all",
                    label: "نمای کلی",
                    badge: data.summary?.total_items ?? 0,
                  },
                  {
                    id: "critical",
                    label: "بحرانی",
                    badge: data.summary?.critical_alerts ?? 0,
                  },
                  {
                    id: "monitoring",
                    label: "پایش",
                    badge: data.summary?.active_monitors ?? 0,
                  },
                  {
                    id: "model",
                    label: "مدل",
                    badge: data.summary?.synced_models ?? 0,
                  },
                ]}
              />
            </div>
          </MonitoringFadeIn>

          <MonitoringFadeIn delay={0.05}>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatCard
                title="مجموع دارایی‌ها"
                value={toPersianDigits(data.summary?.total_items ?? 0)}
                description="تعداد کل آیتم‌های ثبت‌شده"
                icon={<GiTallBridge size={20} />}
                tone="blue"
              />
              <StatCard
                title="مدل‌های همگام"
                value={toPersianDigits(data.summary?.synced_models ?? 0)}
                description="مدل‌های متصل به داده"
                icon={<Cuboid size={20} />}
                tone="violet"
              />
              <StatCard
                title="منابع پایش فعال"
                value={toPersianDigits(data.summary?.active_monitors ?? 0)}
                description="جریان‌های فعال مانیتورینگ"
                icon={<Radar size={20} />}
                tone="emerald"
              />
              <StatCard
                title="هشدارهای باز"
                value={toPersianDigits(data.summary?.open_alerts ?? 0)}
                description="هشدارهای در انتظار رسیدگی"
                icon={<AlertTriangle size={20} />}
                tone="rose"
              />
              <StatCard
                title="پوشش داده"
                value={`${toPersianDigits(data.summary?.data_coverage ?? 0)}٪`}
                description="درصد پوشش داده‌های سامانه"
                icon={<Database size={20} />}
                tone="amber"
              />
            </section>
          </MonitoringFadeIn>

          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
            <div className="2xl:col-span-8">
              <SectionCard
                title="هشدارهای اولویت‌دار"
                description="فهرست مهم‌ترین هشدارهای سامانه بر اساس داده‌های دریافتی."
                action={
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <ArrowDownUp size={15} />
                    مرتب‌سازی
                  </button>
                }
              >
                {!data.alerts?.length ? (
                  <EmptyState
                    title="هشداری یافت نشد"
                    description="برای فیلترها یا عبارت جستجوی فعلی، موردی ثبت نشده است."
                  />
                ) : (
                  <div className="space-y-3">
                    {data.alerts.map((item: any) => {
                      const meta = getSeverityMeta(item.severity);

                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="text-sm font-semibold text-gray-950">
                                  {item.title}
                                </div>
                                <Badge
                                  label={meta.label}
                                  className={meta.className}
                                />
                              </div>
                              <div className="mt-2 text-sm text-gray-600">
                                {item.subtitle ?? item.source ?? "—"}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {formatRelative(item.created_at)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                              >
                                <Eye size={15} />
                                مشاهده
                              </button>
                              <button
                                type="button"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-gray-950 px-3 text-sm font-medium text-white transition hover:bg-gray-800"
                              >
                                <Wrench size={15} />
                                اقدام
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            </div>

            <div className="2xl:col-span-4">
              <SectionCard
                title="سلامت سیستم"
                description="جمع‌بندی لحظه‌ای از کیفیت، پایش و همگام‌سازی داده."
              >
                <div className="space-y-3">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                      <Gauge size={16} />
                      وضعیت پایش
                    </div>
                    <p className="mt-2 text-sm leading-7 text-emerald-700">
                      <strong>
                        {toPersianDigits(data.health?.monitoring_score ?? 0)}٪
                      </strong>{" "}
                      پایداری در جریان داده‌های مانیتورینگ ثبت شده است.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                      <Layers3 size={16} />
                      همگام‌سازی مدل
                    </div>
                    <p className="mt-2 text-sm leading-7 text-violet-700">
                      <strong>
                        {toPersianDigits(data.summary?.synced_models ?? 0)}
                      </strong>{" "}
                      منبع یا مدل با داده‌های جاری همگام هستند.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                      <ShieldAlert size={16} />
                      کیفیت داده
                    </div>
                    <p className="mt-2 text-sm leading-7 text-amber-700">
                      <strong>
                        {toPersianDigits(data.health?.data_quality_score ?? 0)}٪
                      </strong>{" "}
                      کیفیت داده برای تحلیل و تصمیم‌یار قابل اتکا ارزیابی شده
                      است.
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
            <div className="2xl:col-span-6">
              <SectionCard
                title="فعالیت‌های اخیر"
                description="آخرین رویدادها و درخواست‌های ثبت‌شده."
              >
                <div className="space-y-3">
                  {(data.recent_activities ?? []).map((item: any) => {
                    const meta = getInspectionStatusMeta(item.status);

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-gray-200 p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="font-medium text-gray-950">
                                {item.title}
                              </div>
                              <Badge
                                label={meta.label}
                                className={meta.className}
                              />
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              {item.actor ?? "—"} • {item.context ?? "—"}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {formatRelative(item.created_at)}
                            </div>
                          </div>

                          <div className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600">
                            {item.code ?? item.id}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </div>

            <div className="2xl:col-span-6">
              <SectionCard
                title="اقلام حساس"
                description="مواردی که نیازمند بازبینی یا توجه بیشتر هستند."
              >
                <div className="space-y-3">
                  {(data.risky_items ?? []).map((item: any) => {
                    const meta = getHealthMeta(item.status);

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-gray-950">
                              {item.name}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {item.category ?? "—"} • {item.code ?? item.id}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              بروزرسانی: {formatRelative(item.updated_at)}
                            </div>
                          </div>
                          <Badge
                            label={meta.label}
                            className={meta.className}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
            <div className="2xl:col-span-8">
              <SectionCard
                title="جعبه تصمیم‌یار"
                description="پیشنهادهای هوشمند تولیدشده بر اساس وضعیت جاری سامانه."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {(data.recommendations ?? []).map(
                    (item: any, index: number) => {
                      const tones = [
                        "border-blue-200 bg-blue-50 text-blue-700",
                        "border-amber-200 bg-amber-50 text-amber-700",
                        "border-emerald-200 bg-emerald-50 text-emerald-700",
                      ];
                      const icons = [
                        <Sparkles key="s" size={16} />,
                        <ShieldAlert key="a" size={16} />,
                        <TimerReset key="t" size={16} />,
                      ];
                      const style = tones[index % tones.length];
                      const icon = icons[index % icons.length];

                      return (
                        <div
                          key={item.id ?? index}
                          className={cn("rounded-2xl border p-5", style)}
                        >
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            {icon}
                            {item.title ??
                              `پیشنهاد ${toPersianDigits(index + 1)}`}
                          </div>
                          <p className="mt-3 text-sm leading-7">
                            {item.description}
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              </SectionCard>
            </div>

            <div className="2xl:col-span-4">
              <SectionCard
                title="Audit Log"
                description="رویدادهای اخیر این صفحه."
              >
                <div className="space-y-3">
                  {(data.audit_logs ?? []).map((entry: any) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {entry.message}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {entry.actor} • {formatRelative(entry.created_at)}
                      </div>
                      <div className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                        {entry.type}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </PageShell>
    </PermissionGuard>
  );
}
