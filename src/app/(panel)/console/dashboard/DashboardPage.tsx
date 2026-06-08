/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Link from "next/link";

import EmptyState from "@/features/power-shell-pro/components/enterprise/empty-state";
import PageTabs from "@/features/power-shell-pro/components/enterprise/page-tabs";
import PageToolbar from "@/features/power-shell-pro/components/enterprise/page-toolbar";
import PermissionGuard from "@/features/power-shell-pro/components/enterprise/permission-guard";
import { useAuditLog } from "@/features/power-shell-pro/hooks/use-audit-log";
import { usePagePreferences } from "@/features/power-shell-pro/hooks/use-page-preferences";
import PageShell from "@/features/power-shell/components/breadcrumb-tools/page-shell";

import {
  ArrowRight,
  Database,
  Gauge,
  Layers3,
  MapPinned,
  Radar,
  RefreshCcw,
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

const cards = [
  {
    title: "مانیتورینگ سراهای محله",
    subtitle: "پایش وضعیت سراها، امکانات، ظرفیت، کیفیت داده و وضعیت منطقه‌ای",
    href: "/console/monitoring/halls",
    wallboardHref: "/monitoring/halls/wallboard",
    color: "from-sky-500 to-blue-700",
  },
  {
    title: "مانیتورینگ کامل اسکان",
    subtitle: "پایش ظرفیت، درخواست‌ها، رزروها، فضاها، هشدارها و لاگ‌های اسکان",
    href: "/console/monitoring/shelter",
    wallboardHref: "/console/monitoring/shelter/wallboard",
    color: "from-violet-500 to-fuchsia-700",
  },
  {
    title: "نقشه و ظرفیت سرای های محله",
    subtitle: "پایش ظرفیت، درخواست‌ها، رزروها، فضاها، هشدارها و لاگ‌های اسکان",
    href: "/console/monitoring/shelters",
    wallboardHref: "/monitoring/shelters/wallboard",
    color: "from-cyan-500 to-teal-700",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
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

function NavigationCard({
  title,
  subtitle,
  href,
  wallboardHref,
  color,
}: {
  title: string;
  subtitle: string;
  href: string;
  wallboardHref: string;
  color: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br p-[1px] shadow-sm",
        color,
      )}
    >
      <div className="h-full rounded-[calc(1.5rem-1px)] bg-white p-5">
        <div className="flex h-full flex-col justify-between gap-5">
          <div>
            <div className="text-base font-bold text-gray-950">{title}</div>
            <p className="mt-2 text-sm leading-7 text-gray-600">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              ورود
              <ArrowRight size={16} />
            </Link>

            <Link
              href={wallboardHref}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              وال‌بورد
            </Link>
          </div>
        </div>
      </div>
    </div>
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
      visibleColumns: ["regions", "status", "capacity"],
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
    region_id?: number | null;
    district_id?: number | null;
    search?: string;
    tab?: string;
  }>({
    top: 8,
    region_id: null,
    district_id: null,
    search,
    tab: activeTab,
  });

  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search,
      tab: activeTab,
    }));
  }, [search, activeTab]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardOverview({
    top: filters.top,
    region_id: filters.region_id,
    district_id: filters.district_id,
  });

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

  const overview = response.data;
  const kpis = overview.kpis;
  const statusBreakdown = overview.status_breakdown ?? [];
  const regionBreakdown = overview.region_breakdown ?? [];

  const filteredRegions = regionBreakdown.filter((region) => {
    const matchesSearch = !search
      ? true
      : region.region_name.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "critical") {
      return matchesSearch && region.usage_rate >= 70;
    }

    if (activeTab === "monitoring") {
      return matchesSearch && region.active_halls > 0;
    }

    if (activeTab === "model") {
      return matchesSearch && region.halls_with_info > 0;
    }

    return matchesSearch;
  });

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
        description="نمای کلی شاخص‌های سراهای محله، وضعیت ظرفیت، کیفیت اطلاعات و تفکیک منطقه‌ای."
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
            id: "dashboard-halls-monitoring",
            title: "مانیتورینگ سراهای محله",
            subtitle: "ورود به مانیتورینگ سراها",
            group: "مانیتورینگ",
            href: "/console/monitoring/halls",
            keywords: ["halls", "monitoring", "سرا"],
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
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {toPersianDigits(kpis.total_halls)} سالن
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {toPersianDigits(kpis.active_halls)} فعال
            </span>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              ظرفیت کل: {toPersianDigits(kpis.total_capacity)}
            </span>

            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
              استفاده: {toPersianDigits(kpis.average_usage_rate)}٪
            </span>

            {saving ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                در حال ذخیره...
              </span>
            ) : null}
          </div>
        }
      >
        <div className="space-y-6">
          <MonitoringFadeIn>
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {cards.map((card) => (
                <NavigationCard
                  key={card.href}
                  title={card.title}
                  subtitle={card.subtitle}
                  href={card.href}
                  wallboardHref={card.wallboardHref}
                  color={card.color}
                />
              ))}
            </section>
          </MonitoringFadeIn>

          <MonitoringFadeIn delay={0.03}>
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

          <MonitoringFadeIn delay={0.05}>
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
                    badge: kpis.total_halls,
                  },
                  {
                    id: "critical",
                    label: "بحرانی",
                    badge: kpis.critical_halls,
                  },
                  {
                    id: "monitoring",
                    label: "فعال",
                    badge: kpis.active_halls,
                  },
                  {
                    id: "model",
                    label: "دارای اطلاعات",
                    badge: kpis.halls_with_info,
                  },
                ]}
              />
            </div>
          </MonitoringFadeIn>

          <MonitoringFadeIn delay={0.07}>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatCard
                title="مجموع سالن‌ها"
                value={toPersianDigits(kpis.total_halls)}
                description="تعداد کل سالن‌های ثبت‌شده"
                icon={<GiTallBridge size={20} />}
                tone="blue"
              />

              <StatCard
                title="سالن‌های فعال"
                value={toPersianDigits(kpis.active_halls)}
                description="سالن‌های دارای وضعیت فعال"
                icon={<Gauge size={20} />}
                tone="emerald"
              />

              <StatCard
                title="ظرفیت کل"
                value={toPersianDigits(kpis.total_capacity)}
                description="مجموع ظرفیت ثبت‌شده"
                icon={<Database size={20} />}
                tone="violet"
              />

              <StatCard
                title="ظرفیت آزاد"
                value={toPersianDigits(kpis.available_capacity)}
                description="ظرفیت قابل استفاده و آزاد"
                icon={<Layers3 size={20} />}
                tone="amber"
              />

              <StatCard
                title="نرخ استفاده"
                value={`${toPersianDigits(kpis.average_usage_rate)}٪`}
                description="میانگین نرخ استفاده از ظرفیت"
                icon={<Radar size={20} />}
                tone="rose"
              />
            </section>
          </MonitoringFadeIn>

          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
            <div className="2xl:col-span-4">
              <SectionCard
                title="وضعیت سالن‌ها"
                description="توزیع سالن‌ها بر اساس وضعیت ثبت‌شده."
              >
                {!statusBreakdown.length ? (
                  <EmptyState
                    title="داده‌ای یافت نشد"
                    description="اطلاعات وضعیت سالن‌ها در پاسخ API موجود نیست."
                  />
                ) : (
                  <div className="space-y-3">
                    {statusBreakdown.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="text-sm font-medium text-gray-800">
                          {item.label}
                        </div>
                        <div className="rounded-xl bg-white px-3 py-1 text-sm font-bold text-gray-950 ring-1 ring-inset ring-gray-200">
                          {toPersianDigits(item.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            <div className="2xl:col-span-8">
              <SectionCard
                title="ظرفیت و پوشش داده"
                description="خلاصه کیفیت اطلاعات، ظرفیت و وضعیت بهره‌برداری سالن‌ها."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-sm font-semibold text-emerald-800">
                      سالن‌های دارای اطلاعات
                    </div>
                    <div className="mt-3 text-2xl font-bold text-emerald-900">
                      {toPersianDigits(kpis.halls_with_info)}
                    </div>
                    <p className="mt-2 text-sm text-emerald-700">
                      بدون اطلاعات: {toPersianDigits(kpis.halls_without_info)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <div className="text-sm font-semibold text-blue-800">
                      اطلاعات تماس و مدیر
                    </div>
                    <div className="mt-3 text-2xl font-bold text-blue-900">
                      {toPersianDigits(kpis.halls_with_contact)}
                    </div>
                    <p className="mt-2 text-sm text-blue-700">
                      دارای مدیر: {toPersianDigits(kpis.halls_with_manager)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="text-sm font-semibold text-amber-800">
                      ظرفیت اشغال‌شده
                    </div>
                    <div className="mt-3 text-2xl font-bold text-amber-900">
                      {toPersianDigits(kpis.occupied_capacity)}
                    </div>
                    <p className="mt-2 text-sm text-amber-700">
                      رزروشده: {toPersianDigits(kpis.reserved_capacity)}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>

          <MonitoringFadeIn delay={0.1}>
            <SectionCard
              title="تفکیک منطقه‌ای سالن‌ها"
              description="نمای منطقه‌ای تعداد سالن‌ها، ظرفیت، ظرفیت آزاد و نرخ استفاده."
              action={
                <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  <MapPinned size={14} />
                  {toPersianDigits(filteredRegions.length)} منطقه
                </div>
              }
            >
              {!filteredRegions.length ? (
                <EmptyState
                  title="منطقه‌ای یافت نشد"
                  description="اطلاعات تفکیک منطقه‌ای برای فیلتر یا جستجوی فعلی موجود نیست."
                />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-right">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                            منطقه
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                            کل سالن‌ها
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                            فعال
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                            دارای اطلاعات
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                            ظرفیت کل
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                            ظرفیت آزاد
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                            نرخ استفاده
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredRegions.slice(0, pageSize).map((region) => (
                          <tr
                            key={region.region_id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-950">
                              {region.region_name}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">
                              {toPersianDigits(region.total_halls)}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">
                              {toPersianDigits(region.active_halls)}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">
                              {toPersianDigits(region.halls_with_info)}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">
                              {toPersianDigits(region.total_capacity)}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">
                              {toPersianDigits(region.available_capacity)}
                            </td>

                            <td className="px-4 py-3 text-sm">
                              <div className="flex min-w-32 items-center gap-2">
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className="h-full rounded-full bg-blue-500"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.max(0, region.usage_rate),
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <span className="w-12 text-xs font-medium text-gray-700">
                                  {toPersianDigits(region.usage_rate)}٪
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </SectionCard>
          </MonitoringFadeIn>

          <MonitoringFadeIn delay={0.12}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <SectionCard
                title="شاخص‌های ظرفیتی"
                description="خلاصه وضعیت بهره‌برداری و ظرفیت."
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">
                      ظرفیت قابل استفاده
                    </span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.usable_capacity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">ظرفیت آزاد</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.available_capacity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">ظرفیت رزروشده</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.reserved_capacity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">
                      ظرفیت اشغال‌شده
                    </span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.occupied_capacity)}
                    </span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="کیفیت داده"
                description="پوشش اطلاعات پایه سالن‌ها."
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">دارای اطلاعات</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.halls_with_info)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">بدون اطلاعات</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.halls_without_info)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">دارای مختصات</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.halls_with_geo)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">فاقد مختصات</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.halls_with_missing_geo)}
                    </span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="وضعیت مدیریتی"
                description="وضعیت پروفایل، تماس و مدیر سالن‌ها."
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">دارای تماس</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.halls_with_contact)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">فاقد تماس</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.halls_with_missing_contact)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">دارای مدیر</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.halls_with_manager)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                    <span className="text-sm text-gray-600">دارای پروفایل</span>
                    <span className="text-sm font-bold text-gray-950">
                      {toPersianDigits(kpis.halls_with_profile)}
                    </span>
                  </div>
                </div>
              </SectionCard>
            </div>
          </MonitoringFadeIn>
        </div>
      </PageShell>
    </PermissionGuard>
  );
}
