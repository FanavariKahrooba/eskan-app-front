"use client";

import * as React from "react";
import EmptyState from "@/features/power-shell-pro/components/enterprise/empty-state";
import PageToolbar from "@/features/power-shell-pro/components/enterprise/page-toolbar";
import PermissionGuard from "@/features/power-shell-pro/components/enterprise/permission-guard";
import { useAuditLog } from "@/features/power-shell-pro/hooks/use-audit-log";
import { usePagePreferences } from "@/features/power-shell-pro/hooks/use-page-preferences";
import PageShell from "@/features/power-shell/components/breadcrumb-tools/page-shell";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  Clock3,
  Home,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { shelterApi } from "../api/shelter-api";
import type { ShelterDashboard } from "../types/shelter-types";
import { SectionCard, StatCard } from "../components/shelter-shared";
import { toPersianDigits } from "../utils/shelter-formatters";

const PAGE_KEY = "shelter-dashboard";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر سامانه",
  permissions: [
    "dashboard.view",
    "shelter.dashboard.view",
    "shelter.profiles.view",
    "shelter.profiles.manage",
    "shelter.spaces.view",
    "shelter.requests.view",
    "shelter.requests.review",
    "shelter.reservations.view",
    "shelter.reservations.manage",
    "settings.view",
  ],
};

const emptyDashboard: ShelterDashboard = {
  profiles_count: 0,
  active_profiles_count: 0,
  spaces_count: 0,
  total_capacity: 0,
  occupied_capacity: 0,
  available_capacity: 0,
  pending_requests_count: 0,
  approved_requests_count: 0,
  active_reservations_count: 0,
  checked_in_count: 0,
  cancelled_reservations_count: 0,
};

export default function ShelterDashboardPage() {
  const {
    preferences,
    loading,
    saving,
    setSearch,
    setDensity,
    setPageSize,
    resetPreferences,
  } = usePagePreferences({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
    defaultValue: {
      activeTab: "overview",
      search: "",
      density: "comfortable",
      pageSize: 10,
      visibleColumns: [],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const [dashboard, setDashboard] =
    React.useState<ShelterDashboard>(emptyDashboard);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadDashboard = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response = await shelterApi.dashboard();
      setDashboard(response.data || emptyDashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
    } finally {
      setApiLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, [loadDashboard]);

  const occupancyPercent =
    dashboard.total_capacity > 0
      ? Math.round(
          (dashboard.occupied_capacity / dashboard.total_capacity) * 100,
        )
      : 0;

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="shelter.dashboard.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده داشبورد اسکان را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="داشبورد اسکان سراهای محله"
        description="نمای مدیریتی از ظرفیت، درخواست‌ها، رزروها و وضعیت پذیرش در سراهای محله."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/shelter`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "اسکان", href: `${APP_BASE_PATH}/shelter` },
          { label: "داشبورد", href: `${APP_BASE_PATH}/shelter` },
        ]}
        actions={[
          {
            id: "refresh",
            label: "بروزرسانی",
            icon: <RefreshCcw size={16} />,
            variant: "secondary",
            onClick: () => {
              audit.track({
                type: "shelter.dashboard.refreshed",
                message: "Shelter dashboard refreshed",
              });
              loadDashboard();
            },
          },
          {
            id: "profiles",
            label: "مدیریت سراها",
            icon: <Building2 size={16} />,
            variant: "primary",
            href: `${APP_BASE_PATH}/shelter/profiles`,
            permission: "shelter.profiles.view",
          },
        ]}
        commandActions={[
          {
            id: "shelter-dashboard",
            title: "داشبورد اسکان",
            subtitle: "ظرفیت، پذیرش و درخواست‌ها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter`,
            keywords: ["shelter", "dashboard", "اسکان"],
          },
          {
            id: "shelter-profiles",
            title: "سراهای اسکان",
            subtitle: "مدیریت پروفایل سراها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/profiles`,
            keywords: ["profiles", "سرا"],
          },
          {
            id: "shelter-spaces",
            title: "فضاهای اسکان",
            subtitle: "مدیریت اتاق‌ها و ظرفیت‌ها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/spaces`,
            keywords: ["spaces", "ظرفیت"],
          },
          {
            id: "shelter-requests",
            title: "درخواست‌های اسکان",
            subtitle: "بررسی و تأیید درخواست‌ها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/requests`,
            keywords: ["requests", "درخواست"],
          },
          {
            id: "shelter-reservations",
            title: "رزروهای اسکان",
            subtitle: "پذیرش، خروج و لغو رزروها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/reservations`,
            keywords: ["reservations", "رزرو"],
          },
          {
            id: "reset-shelter-dashboard-preferences",
            title: "بازنشانی تنظیمات داشبورد اسکان",
            subtitle: "حذف تنظیمات ذخیره‌شده این صفحه",
            group: "تنظیمات",
            onSelect: async () => {
              await resetPreferences();
            },
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              ظرفیت کل: {toPersianDigits(dashboard.total_capacity)}
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              ظرفیت آزاد: {toPersianDigits(dashboard.available_capacity)}
            </span>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              اشغال: {toPersianDigits(occupancyPercent)}٪
            </span>

            {saving ? (
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                در حال ذخیره تنظیمات...
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
            onSearchChange={setSearch}
            density={density}
            onDensityChange={setDensity}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onResetPreferences={resetPreferences}
            saving={saving}
          />

          {error ? (
            <EmptyState title="خطا در دریافت اطلاعات" description={error} />
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard
              title="تعداد سراها"
              value={toPersianDigits(dashboard.profiles_count)}
              description="کل سراهای ثبت‌شده"
              icon={<Building2 size={20} />}
              tone="blue"
            />

            <StatCard
              title="سراهای فعال"
              value={toPersianDigits(dashboard.active_profiles_count)}
              description="قابل استفاده برای اسکان"
              icon={<ShieldCheck size={20} />}
              tone="emerald"
            />

            <StatCard
              title="فضاهای اسکان"
              value={toPersianDigits(dashboard.spaces_count)}
              description="اتاق، سالن، تخت و سایر فضاها"
              icon={<Home size={20} />}
              tone="violet"
            />

            <StatCard
              title="ظرفیت آزاد"
              value={toPersianDigits(dashboard.available_capacity)}
              description="قابل رزرو در حال حاضر"
              icon={<BedDouble size={20} />}
              tone="emerald"
            />

            <StatCard
              title="درخواست‌های معلق"
              value={toPersianDigits(dashboard.pending_requests_count)}
              description="نیازمند بررسی مدیر"
              icon={<Clock3 size={20} />}
              tone="amber"
            />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <SectionCard
              title="وضعیت ظرفیت"
              description="تحلیل سریع ظرفیت کل، اشغال‌شده و آزاد."
            >
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      درصد اشغال
                    </span>
                    <span className="font-bold text-gray-950">
                      {toPersianDigits(occupancyPercent)}٪
                    </span>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
                    <div className="text-xs text-blue-700">کل</div>
                    <div className="mt-1 text-lg font-bold text-blue-900">
                      {toPersianDigits(dashboard.total_capacity)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                    <div className="text-xs text-amber-700">اشغال</div>
                    <div className="mt-1 text-lg font-bold text-amber-900">
                      {toPersianDigits(dashboard.occupied_capacity)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <div className="text-xs text-emerald-700">آزاد</div>
                    <div className="mt-1 text-lg font-bold text-emerald-900">
                      {toPersianDigits(dashboard.available_capacity)}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="وضعیت درخواست‌ها"
              description="درخواست‌های ثبت‌شده و تأییدشده."
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                    <Clock3 size={16} />
                    در انتظار بررسی
                  </div>
                  <div className="text-lg font-bold text-amber-900">
                    {toPersianDigits(dashboard.pending_requests_count)}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                    <CheckCircle2 size={16} />
                    تأیید شده
                  </div>
                  <div className="text-lg font-bold text-emerald-900">
                    {toPersianDigits(dashboard.approved_requests_count)}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="وضعیت رزروها"
              description="رزروهای فعال، پذیرش‌شده و لغوشده."
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                    <Users size={16} />
                    رزرو فعال
                  </div>
                  <div className="text-lg font-bold text-blue-900">
                    {toPersianDigits(dashboard.active_reservations_count)}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                    <CheckCircle2 size={16} />
                    پذیرش شده
                  </div>
                  <div className="text-lg font-bold text-emerald-900">
                    {toPersianDigits(dashboard.checked_in_count)}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-rose-800">
                    <XCircle size={16} />
                    لغو شده
                  </div>
                  <div className="text-lg font-bold text-rose-900">
                    {toPersianDigits(dashboard.cancelled_reservations_count)}
                  </div>
                </div>
              </div>
            </SectionCard>
          </section>

          <SectionCard
            title="جمع‌بندی عملیاتی"
            description="خروجی سریع برای مدیر اسکان."
          >
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
              <p className="text-sm leading-8 text-gray-700">
                در این داشبورد، ظرفیت سراهای محله، درخواست‌های در انتظار بررسی و
                وضعیت رزروها به‌صورت تجمیعی نمایش داده می‌شود. تمرکز اصلی مدیر
                باید روی بررسی سریع درخواست‌های معلق، جلوگیری از اشغال بیش از
                ظرفیت و ثبت دقیق پذیرش و خروج افراد باشد.
              </p>
            </div>
          </SectionCard>
        </div>
      </PageShell>
    </PermissionGuard>
  );
}
