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
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Database,
  DollarSign,
  LineChart,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Siren,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { GiTallBridge } from 'react-icons/gi'

const PAGE_KEY = "bridge-dashboard-executive";
const APP_BASE_PATH = "";

const currentUser = {
  id: "user_1",
  name: "مدیر ارشد پروژه",
  permissions: [
    "dashboard.view",
    "dashboard.executive.view",
    "reports.view",
    "finance.view",
    "settings.view",
  ],
  featureFlags: ["executive_dashboard", "advanced_reports"],
};

type AuditEntry = {
  id: string;
  type: "executive.viewed" | "executive.filtered" | "executive.refreshed";
  actor: string;
  message: string;
  createdAt: string;
};

const auditSeed: AuditEntry[] = [
  {
    id: "EXE-1",
    type: "executive.viewed",
    actor: "مدیر ارشد پروژه",
    message: "داشبورد مدیریتی باز شد.",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "EXE-2",
    type: "executive.filtered",
    actor: "مدیر ارشد پروژه",
    message: "بازه تحلیل تغییر کرد.",
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
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
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
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

export default function ExecutiveDashboardPage() {
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
      activeTab: "quarter",
      search: "",
      density: "comfortable",
      pageSize: 10,
      visibleColumns: ["kpis", "risks", "actions"],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const [auditEntries] = React.useState(auditSeed);

  const activeTab =
    (preferences.activeTab as "month" | "quarter" | "year") || "quarter";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const stats = {
    portfolioBridges: 24,
    healthScore: 82,
    predictedRiskZones: 7,
    maintenanceReady: 13,
    annualBudgetUse: 68,
    syncedAssets: 91,
    reportsGenerated: 46,
    decisionConfidence: 89,
  };

  const strategicItems = [
    {
      title: "پایداری شبکه پل‌ها",
      value: "۸۲ از ۱۰۰",
      desc: "برآورد سلامت کلی بر اساس بازرسی، حسگر و تحلیل",
      tone: "emerald" as const,
      icon: <ShieldCheck size={20} />,
    },
    {
      title: "نواحی دارای ریسک پیش‌بینی‌شده",
      value: "۷ ناحیه",
      desc: "خروجی مدل داده‌محور و روندهای تاریخی",
      tone: "rose" as const,
      icon: <Siren size={20} />,
    },
    {
      title: "آمادگی نگهداری",
      value: "۱۳ اقدام",
      desc: "اقدامات اولویت‌دار آماده اجرا",
      tone: "amber" as const,
      icon: <ClipboardCheck size={20} />,
    },
    {
      title: "اعتماد تصمیم‌یار",
      value: "۸۹٪",
      desc: "اطمینان مدل نسبت به پیشنهادهای فعلی",
      tone: "violet" as const,
      icon: <BrainCircuit size={20} />,
    },
  ];

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="dashboard.executive.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده داشبورد مدیریتی پل را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="داشبورد مدیریتی پل"
        description="تحلیل سطح مدیران برای مشاهده شاخص‌های کلان، ریسک‌های آینده، آمادگی نگهداری، پوشش داده و وضعیت تصمیم‌یار."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/dashboard/executive`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "داشبورد", href: `${APP_BASE_PATH}/dashboard` },
          {
            label: "داشبورد مدیریتی پل",
            href: `${APP_BASE_PATH}/dashboard/executive`,
          },
        ]}
        actions={[
          {
            id: "refresh",
            label: "بروزرسانی",
            icon: <RefreshCcw size={16} />,
            variant: "secondary",
            onClick: () => {
              audit.track({
                type: "executive.refreshed",
                message: "Executive dashboard refresh clicked",
              });
              window.location.reload();
            },
          },
        ]}
        commandActions={[
          {
            id: "executive-dashboard",
            title: "داشبورد مدیریتی پل",
            subtitle: "شاخص‌های کلان مدیریتی",
            group: "داشبورد",
            href: `${APP_BASE_PATH}/dashboard/executive`,
            keywords: ["executive dashboard", "مدیریتی"],
          },
          {
            id: "reports-advanced",
            title: "گزارشات پیشرفته",
            subtitle: "تحلیل‌های تکمیلی و خروجی مدیریتی",
            group: "گزارشات",
            href: `${APP_BASE_PATH}/reports/advanced`,
            keywords: ["advanced reports", "analytics"],
          },
          {
            id: "finance-reports",
            title: "گزارش مالی پروژه",
            subtitle: "بودجه، هزینه و روندهای مالی",
            group: "مالی",
            href: `${APP_BASE_PATH}/finance/reports`,
            keywords: ["finance reports", "budget"],
          },
          {
            id: "reset-executive-preferences",
            title: "بازنشانی تنظیمات داشبورد مدیریتی",
            subtitle: "حذف تنظیمات ذخیره‌شده صفحه",
            group: "تنظیمات",
            onSelect: async () => {
              await resetPreferences();
              audit.track({
                type: "executive.filtered",
                message: "Executive preferences reset",
              });
            },
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              سلامت پرتفو: {toPersianDigits(stats.healthScore)}٪
            </span>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
              {toPersianDigits(stats.predictedRiskZones)} ریسک پیش‌بینی‌شده
            </span>
            {saving ? (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
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
                type: "executive.filtered",
                message: "Executive search changed",
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
                type: "executive.filtered",
                message: "Executive preferences reset",
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
                  type: "executive.filtered",
                  message: "Executive period changed",
                  metadata: { tab },
                });
              }}
              tabs={[
                { id: "month", label: "ماهانه", badge: 30 },
                { id: "quarter", label: "فصلی", badge: 90 },
                { id: "year", label: "سالانه", badge: 365 },
              ]}
            />
          </div>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {strategicItems.map((item) => (
              <StatCard
                key={item.title}
                title={item.title}
                value={item.value}
                description={item.desc}
                icon={item.icon}
                tone={item.tone}
              />
            ))}
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <SectionCard
              title="خلاصه مدیریتی"
              description="برداشت سریع از وضعیت پروژه و دارایی‌های پل."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                    <GiTallBridge size={16} />
                    پوشش پرتفو
                  </div>
                  <p className="mt-3 text-sm leading-7 text-blue-700">
                    تعداد{" "}
                    <strong>{toPersianDigits(stats.portfolioBridges)}</strong>{" "}
                    پل در سطح پرتفو فعال هستند و{" "}
                    <strong>{toPersianDigits(stats.syncedAssets)}٪</strong>
                    از دارایی‌ها به لایه داده و مدل متصل شده‌اند.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <TrendingUp size={16} />
                    روند بهبود
                  </div>
                  <p className="mt-3 text-sm leading-7 text-emerald-700">
                    کیفیت داده و نرخ تکمیل بازرسی‌ها نسبت به دوره قبل روند صعودی
                    داشته و زمان تصمیم‌گیری کاهش یافته است.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                    <DollarSign size={16} />
                    بودجه نگهداری
                  </div>
                  <p className="mt-3 text-sm leading-7 text-amber-700">
                    میزان استفاده از بودجه سالانه نگهداری تاکنون
                    <strong> {toPersianDigits(stats.annualBudgetUse)}٪ </strong>
                    بوده و اولویت‌بندی اقدامات باید حفظ شود.
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                    <Sparkles size={16} />
                    قابلیت پیش‌بینی
                  </div>
                  <p className="mt-3 text-sm leading-7 text-violet-700">
                    سامانه تصمیم‌یار در این بازه
                    <strong>
                      {" "}
                      {toPersianDigits(stats.decisionConfidence)}٪{" "}
                    </strong>
                    اعتماد برای پیشنهادهای نگهداری ارائه کرده است.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="اقدامات کلیدی"
              description="مواردی که باید در سطح مدیریت پیگیری شوند."
            >
              <div className="space-y-3">
                {[
                  "اولویت‌بندی نواحی با ریسک بالا برای بازبینی ترکیبی",
                  "اختصاص بودجه به تعمیرات پیشگیرانه در پایه‌های حساس",
                  "افزایش نرخ همگام‌سازی بین مدل 3D و داده سنسورها",
                  "مرور گزارشات پیشرفته و مقایسه عملکرد بین پل‌ها",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gray-950 text-xs font-bold text-white">
                        {toPersianDigits(index + 1)}
                      </div>
                      <div className="text-sm leading-7 text-gray-700">
                        {item}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <SectionCard
              title="شاخص‌های عملکرد"
              description="KPI های کلیدی برای تصمیم‌گیری."
            >
              <div className="space-y-4">
                {[
                  {
                    label: "نرخ تکمیل بازرسی",
                    value: "۹۴٪",
                    icon: <CheckCircle2 size={16} />,
                  },
                  {
                    label: "کیفیت لایه داده",
                    value: "۸۸٪",
                    icon: <Database size={16} />,
                  },
                  {
                    label: "تعداد گزارش تولیدشده",
                    value: "۴۶",
                    icon: <BarChart3 size={16} />,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      {item.icon}
                      {item.label}
                    </div>
                    <div className="text-lg font-bold text-gray-950">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="تحلیل روند"
              description="نمای متنی از جهت حرکت شاخص‌ها."
            >
              <div className="space-y-3">
                {[
                  "روند هشدارهای بحرانی در دو هفته اخیر کاهشی بوده است.",
                  "پوشش داده حسگرها در سه پل اصلی افزایش یافته است.",
                  "مدل داده‌محور دقت بالاتری در پیش‌بینی آسیب‌های عرشه نشان داده است.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-7 text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Audit Log"
              description="آخرین فعالیت‌های مدیریتی."
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
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                      <LineChart size={12} />
                      {entry.type}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>

          <SectionCard
            title="جمع‌بندی تصمیم‌یار"
            description="خروجی نهایی برای اقدام در سطح مدیریت."
            action={
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <ArrowUpRight size={15} />
                مشاهده تحلیل پیشرفته
              </button>
            }
          >
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
              <p className="text-sm leading-8 text-gray-700">
                در بازه{" "}
                <strong>
                  {activeTab === "month"
                    ? "ماهانه"
                    : activeTab === "quarter"
                      ? "فصلی"
                      : "سالانه"}
                </strong>
                ، سامانه نشان می‌دهد که اولویت مدیریت باید بر
                <strong> نواحی با ریسک پیش‌بینی‌شده بالا</strong>،
                <strong> نگهداری پیشگیرانه اجزای حساس</strong> و
                <strong> بهبود همگام‌سازی داده با مدل سه‌بعدی</strong>
                متمرکز باشد. ترکیب داده‌های بازرسی، حسگر و مدل اطلاعاتی قابلیت
                تصمیم‌گیری سریع‌تر و دقیق‌تر را فراهم کرده است.
              </p>
            </div>
          </SectionCard>
        </div>
      </PageShell>
    </PermissionGuard>
  );
}
