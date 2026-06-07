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
  Activity,
  AlertTriangle,
  ArrowDownUp,
  BrainCircuit,
  CheckCircle2,
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
import { GiTallBridge } from 'react-icons/gi'

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

type HealthStatus = "healthy" | "warning" | "critical";

type BridgeAlert = {
  id: string;
  title: string;
  bridge: string;
  member: string;
  severity: "high" | "medium" | "low";
  source: string;
  createdAt: string;
};

type InspectionActivity = {
  id: string;
  title: string;
  inspector: string;
  bridge: string;
  createdAt: string;
  status: "completed" | "in_progress" | "scheduled";
};

type TwinMember = {
  id: string;
  name: string;
  category: string;
  status: HealthStatus;
  lastUpdate: string;
};

type AuditEntry = {
  id: string;
  type:
    | "dashboard.viewed"
    | "dashboard.filtered"
    | "dashboard.refreshed"
    | "dashboard.action";
  actor: string;
  message: string;
  createdAt: string;
};

const alertsSeed: BridgeAlert[] = [
  {
    id: "ALT-101",
    title: "افزایش ریسک در ناحیه عرشه",
    bridge: "پل شهید همت",
    member: "Deck Segment A3",
    severity: "high",
    source: "IRT + Visual Inspection",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "ALT-102",
    title: "ناهمخوانی داده حسگر با مدل تحلیلی",
    bridge: "پل طبیعت",
    member: "Pier P2",
    severity: "medium",
    source: "Sensor Stream",
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
  {
    id: "ALT-103",
    title: "نیاز به بازبینی ترک ثبت‌شده",
    bridge: "پل یادگار",
    member: "Girder G7",
    severity: "low",
    source: "Visual Review",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

const inspectionsSeed: InspectionActivity[] = [
  {
    id: "INSP-201",
    title: "ثبت بازرسی تصویری عرشه",
    inspector: "مهندس رضایی",
    bridge: "پل شهید همت",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: "completed",
  },
  {
    id: "INSP-202",
    title: "دریافت داده GPR برای کابل‌ها",
    inspector: "تیم ژئوفیزیک",
    bridge: "پل صدر",
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    status: "in_progress",
  },
  {
    id: "INSP-203",
    title: "ماموریت حسگرگذاری پایه میانی",
    inspector: "کارشناس پایش",
    bridge: "پل طبیعت",
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    status: "scheduled",
  },
];

const membersSeed: TwinMember[] = [
  {
    id: "BM-01",
    name: "عرشه اصلی",
    category: "Deck",
    status: "warning",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: "BM-02",
    name: "پایه P2",
    category: "Pier",
    status: "critical",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "BM-03",
    name: "تیر G7",
    category: "Girder",
    status: "healthy",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "BM-04",
    name: "یاتاقان B4",
    category: "Bearing",
    status: "warning",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

const auditSeed: AuditEntry[] = [
  {
    id: "DB-A1",
    type: "dashboard.viewed",
    actor: "مدیر سامانه",
    message: "داشبورد اصلی مشاهده شد.",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "DB-A2",
    type: "dashboard.filtered",
    actor: "مدیر سامانه",
    message: "فیلتر وضعیت داشبورد تغییر کرد.",
    createdAt: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
  },
  {
    id: "DB-A3",
    type: "dashboard.refreshed",
    actor: "مدیر سامانه",
    message: "داده‌های داشبورد بروزرسانی شد.",
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
  },
];

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
  }
}

function getMemberStatusMeta(status: HealthStatus) {
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
  }
}

function getInspectionStatusMeta(status: InspectionActivity["status"]): {
  label: string;
  className: string;
} {
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
  }
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

export default function DashboardPage() {
  const {
    preferences,
    loading,
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

  const [alerts] = React.useState(alertsSeed);
  const [inspections] = React.useState(inspectionsSeed);
  const [members] = React.useState(membersSeed);
  const [auditEntries] = React.useState(auditSeed);

  const activeTab =
    (preferences.activeTab as "all" | "critical" | "monitoring" | "model") ||
    "all";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const filteredAlerts = React.useMemo(() => {
    let result = [...alerts];

    if (activeTab === "critical") {
      result = result.filter((item) => item.severity === "high");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.bridge.toLowerCase().includes(q) ||
          item.member.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q),
      );
    }

    return result.slice(0, pageSize);
  }, [alerts, activeTab, search, pageSize]);

  const stats = React.useMemo(() => {
    const criticalAlerts = alerts.filter(
      (item) => item.severity === "high",
    ).length;
    const warningMembers = members.filter(
      (item) => item.status === "warning",
    ).length;
    const criticalMembers = members.filter(
      (item) => item.status === "critical",
    ).length;
    const completedInspections = inspections.filter(
      (item) => item.status === "completed",
    ).length;

    return {
      totalBridges: 12,
      syncedModels: 9,
      activeSensors: 148,
      openAlerts: alerts.length,
      criticalAlerts,
      warningMembers,
      criticalMembers,
      completedInspections,
      dataCoverage: 87,
    };
  }, [alerts, inspections, members]);

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
        description="نمای یکپارچه از وضعیت پل‌ها، هشدارها، داده‌های پایش، همگام‌سازی مدل سه‌بعدی و روند فعالیت‌های بازرسی."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/dashboard`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading}
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
            onClick: () => {
              audit.track({
                type: "dashboard.refreshed",
                message: "Dashboard refresh clicked",
              });
              window.location.reload();
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
            subtitle: "نمای کلی وضعیت سامانه و پل‌ها",
            group: "داشبورد",
            href: `${APP_BASE_PATH}/dashboard`,
            keywords: ["dashboard", "main", "داشبورد"],
          },
          {
            id: "dashboard-executive",
            title: "داشبورد مدیریتی پل",
            subtitle: "شاخص‌های کلان مدیریتی و تصمیم‌یار",
            group: "داشبورد",
            href: `${APP_BASE_PATH}/dashboard/executive`,
            keywords: ["executive", "analytics", "مدیریتی"],
          },
          {
            id: "bridge-members",
            title: "همه اعضای پل",
            subtitle: "فهرست عناصر و اجزای سازه‌ای پل",
            group: "پل و عملیات",
            href: `${APP_BASE_PATH}/bridge-members`,
            keywords: ["bridge members", "components", "اجزای پل"],
          },
          {
            id: "model-view",
            title: "نمای سه‌بعدی پل",
            subtitle: "مشاهده مدل سه‌بعدی و وضعیت اجزا",
            group: "بصری‌سازی",
            href: `${APP_BASE_PATH}/visualization/model`,
            keywords: ["3d", "visualization", "مدل سه‌بعدی"],
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
              {toPersianDigits(stats.criticalAlerts)} هشدار بحرانی
            </span>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              {toPersianDigits(stats.warningMembers)} عضو نیازمند بررسی
            </span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {toPersianDigits(stats.activeSensors)} حسگر فعال
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
        <div className="space-y-4">
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
                { id: "all", label: "نمای کلی", badge: stats.totalBridges },
                {
                  id: "critical",
                  label: "بحرانی",
                  badge: stats.criticalAlerts,
                },
                { id: "monitoring", label: "پایش", badge: stats.activeSensors },
                { id: "model", label: "مدل", badge: stats.syncedModels },
              ]}
            />
          </div>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard
              title="پل‌های ثبت‌شده"
              value={toPersianDigits(stats.totalBridges)}
              description="تعداد پل‌های فعال در سامانه"
              icon={<GiTallBridge size={20} />}
              tone="blue"
            />
            <StatCard
              title="مدل‌های همگام"
              value={toPersianDigits(stats.syncedModels)}
              description="مدل‌های 3D متصل به داده"
              icon={<Cuboid size={20} />}
              tone="violet"
            />
            <StatCard
              title="حسگرهای فعال"
              value={toPersianDigits(stats.activeSensors)}
              description="جریان‌های پایش متصل"
              icon={<Radar size={20} />}
              tone="emerald"
            />
            <StatCard
              title="هشدارهای باز"
              value={toPersianDigits(stats.openAlerts)}
              description="هشدارهای در انتظار اقدام"
              icon={<AlertTriangle size={20} />}
              tone="rose"
            />
            <StatCard
              title="پوشش داده"
              value={`${toPersianDigits(stats.dataCoverage)}٪`}
              description="سطح پوشش داده‌های مدل و میدان"
              icon={<Database size={20} />}
              tone="amber"
            />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <SectionCard
                title="هشدارهای اولویت‌دار"
                description="خروجی یکپارچه از بازرسی، حسگر، مدل و تحلیل برای شناسایی نواحی پرریسک."
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
                {filteredAlerts.length === 0 ? (
                  <EmptyState
                    title="هشداری یافت نشد"
                    description="برای فیلترها یا عبارت جستجوی فعلی، موردی ثبت نشده است."
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredAlerts.map((item) => {
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
                                پل:{" "}
                                <span className="font-medium">
                                  {item.bridge}
                                </span>{" "}
                                • عضو:{" "}
                                <span className="font-medium">
                                  {item.member}
                                </span>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                منبع داده: {item.source} •{" "}
                                {formatRelative(item.createdAt)}
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

            <SectionCard
              title="شاخص سلامت سیستم"
              description="جمع‌بندی وضعیت پایش، تحلیل و همگام‌سازی."
            >
              <div className="space-y-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <Gauge size={16} />
                    وضعیت پایش
                  </div>
                  <p className="mt-2 text-sm leading-7 text-emerald-700">
                    جریان حسگرها پایدار است و{" "}
                    <strong>{toPersianDigits(92)}٪</strong> داده‌ها بدون خطا
                    دریافت شده‌اند.
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                    <Layers3 size={16} />
                    همگام‌سازی مدل
                  </div>
                  <p className="mt-2 text-sm leading-7 text-violet-700">
                    <strong>{toPersianDigits(stats.syncedModels)}</strong> مدل
                    سه‌بعدی با لایه اطلاعاتی و داده میدانی همگام هستند.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                    <BrainCircuit size={16} />
                    آمادگی تصمیم‌یار
                  </div>
                  <p className="mt-2 text-sm leading-7 text-amber-700">
                    تحلیل‌های تصمیم‌یار برای{" "}
                    <strong>{toPersianDigits(6)}</strong> ناحیه نیازمند نگهداری
                    آماده شده است.
                  </p>
                </div>
              </div>
            </SectionCard>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <SectionCard
              title="فعالیت‌های اخیر بازرسی"
              description="آخرین رویدادهای ثبت‌شده از تیم‌های بازرسی و پایش."
            >
              <div className="space-y-3">
                {inspections.map((item) => {
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
                            {item.inspector} • {item.bridge}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {formatRelative(item.createdAt)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600">
                          {item.id}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard
              title="اعضای حساس پل"
              description="عناصر دارای ریسک یا نیازمند بازبینی."
            >
              <div className="space-y-3">
                {members.map((item) => {
                  const meta = getMemberStatusMeta(item.status);

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
                            {item.category} • {item.id}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            بروزرسانی: {formatRelative(item.lastUpdate)}
                          </div>
                        </div>
                        <Badge label={meta.label} className={meta.className} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <SectionCard
              title="جعبه تصمیم‌یار"
              description="خلاصه پیشنهادهای هوشمند بر اساس ترکیب داده‌های بازرسی، حسگر و مدل."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                    <Sparkles size={16} />
                    پیشنهاد ۱
                  </div>
                  <p className="mt-3 text-sm leading-7 text-blue-700">
                    برای عرشه پل شهید همت، بازبینی ترکیبی Visual + IRT در بازه
                    ۷۲ ساعت آینده پیشنهاد می‌شود.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                    <ShieldAlert size={16} />
                    پیشنهاد ۲
                  </div>
                  <p className="mt-3 text-sm leading-7 text-amber-700">
                    داده‌های پایه P2 نیازمند صحت‌سنجی با مدل اجزای محدود و
                    مقایسه با الگوی تاریخی است.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <TimerReset size={16} />
                    پیشنهاد ۳
                  </div>
                  <p className="mt-3 text-sm leading-7 text-emerald-700">
                    زمان‌بندی نگهداری پیشگیرانه برای یاتاقان B4 در برنامه آتی
                    ثبت شود.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Audit Log"
              description="رویدادهای اخیر این صفحه."
            >
              <div className="space-y-3">
                {auditEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {entry.message}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {entry.actor} • {formatRelative(entry.createdAt)}
                    </div>
                    <div className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                      {entry.type}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>
        </div>
      </PageShell>
    </PermissionGuard>
  );
}
