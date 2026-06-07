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
  BedDouble,
  Building2,
  CheckCircle2,
  Eye,
  Home,
  Plus,
  RefreshCcw,
  Settings,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { shelterApi } from "../api/shelter-api";
import type { ShelterProfile, ShelterStatus } from "../types/shelter-types";
import {
  Badge,
  InfoItem,
  Modal,
  SectionCard,
  StatCard,
} from "../components/shelter-shared";
import {
  cn,
  formatDate,
  getShelterStatusMeta,
  toPersianDigits,
} from "../utils/shelter-formatters";

const PAGE_KEY = "shelter-profiles";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر اسکان",
  permissions: [
    "dashboard.view",
    "shelter.dashboard.view",
    "shelter.profiles.view",
    "shelter.profiles.manage",
    "shelter.spaces.view",
    "shelter.requests.view",
    "shelter.reservations.view",
    "settings.view",
  ],
};

export default function ShelterProfilesPage() {
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
      visibleColumns: [
        "title",
        "region",
        "district",
        "capacity",
        "status",
        "manager",
      ],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const [rows, setRows] = React.useState<ShelterProfile[]>([]);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<ShelterProfile | null>(null);

  const activeTab = (preferences.activeTab as ShelterStatus | "all") || "all";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadRows = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response = await shelterApi.profiles({
        search,
        status: activeTab === "all" ? undefined : activeTab,
        per_page: pageSize,
      });

      setRows(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
    } finally {
      setApiLoading(false);
    }
  }, [search, activeTab, pageSize]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRows();
  }, [loadRows]);

  const stats = React.useMemo(() => {
    const active = rows.filter((item) => item.status === "active").length;
    const inactive = rows.filter((item) => item.status === "inactive").length;
    const maintenance = rows.filter(
      (item) => item.status === "maintenance",
    ).length;

    const totalCapacity = rows.reduce(
      (sum, item) => sum + Number(item.total_capacity || 0),
      0,
    );
    const availableCapacity = rows.reduce(
      (sum, item) => sum + Number(item.available_capacity || 0),
      0,
    );

    return {
      total: rows.length,
      active,
      inactive,
      maintenance,
      totalCapacity,
      availableCapacity,
    };
  }, [rows]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="shelter.profiles.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده سراهای اسکان را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="سراهای اسکان"
        description="مدیریت پروفایل سراهای محله، ظرفیت کلی، وضعیت فعالیت و اطلاعات مسئول سرا."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/shelter/profiles`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "اسکان", href: `${APP_BASE_PATH}/shelter` },
          { label: "سراها", href: `${APP_BASE_PATH}/shelter/profiles` },
        ]}
        actions={[
          {
            id: "refresh",
            label: "بروزرسانی",
            icon: <RefreshCcw size={16} />,
            variant: "secondary",
            onClick: () => {
              audit.track({
                type: "shelter.profiles.refreshed",
                message: "Shelter profiles refreshed",
              });
              loadRows();
            },
          },
          {
            id: "create-profile",
            label: "افزودن سرا",
            icon: <Plus size={16} />,
            variant: "primary",
            href: `${APP_BASE_PATH}/shelter/profiles/new`,
            permission: "shelter.profiles.manage",
          },
        ]}
        commandActions={[
          {
            id: "shelter-dashboard",
            title: "داشبورد اسکان",
            subtitle: "ظرفیت و وضعیت عملیاتی",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter`,
            keywords: ["shelter", "dashboard", "داشبورد"],
          },
          {
            id: "shelter-spaces",
            title: "فضاهای اسکان",
            subtitle: "مدیریت ظرفیت‌ها و اتاق‌ها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/spaces`,
            keywords: ["spaces", "فضا"],
          },
          {
            id: "shelter-requests",
            title: "درخواست‌های اسکان",
            subtitle: "بررسی درخواست‌های کاربران",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/requests`,
            keywords: ["requests", "درخواست"],
          },
          {
            id: "reset-shelter-profiles-preferences",
            title: "بازنشانی تنظیمات سراها",
            subtitle: "حذف تنظیمات ذخیره‌شده این صفحه",
            group: "تنظیمات",
            onSelect: resetPreferences,
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {toPersianDigits(stats.total)} سرا
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {toPersianDigits(stats.active)} فعال
            </span>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              ظرفیت آزاد: {toPersianDigits(stats.availableCapacity)}
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
            onSearchChange={(value) => {
              setSearch(value);
              audit.track({
                type: "shelter.profiles.filtered",
                message: "Shelter profiles search changed",
                metadata: { search: value },
              });
            }}
            density={density}
            onDensityChange={setDensity}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onResetPreferences={resetPreferences}
            saving={saving}
          />

          <div className="rounded-2xl border border-gray-200 bg-white px-4 shadow-sm">
            <PageTabs
              value={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                audit.track({
                  type: "shelter.profiles.filtered",
                  message: "Shelter profiles status tab changed",
                  metadata: { tab },
                });
              }}
              tabs={[
                { id: "all", label: "همه", badge: stats.total },
                { id: "active", label: "فعال", badge: stats.active },
                {
                  id: "maintenance",
                  label: "در حال تعمیر",
                  badge: stats.maintenance,
                },
                { id: "inactive", label: "غیرفعال", badge: stats.inactive },
              ]}
            />
          </div>

          {error ? (
            <EmptyState title="خطا در دریافت اطلاعات" description={error} />
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard
              title="کل سراها"
              value={toPersianDigits(stats.total)}
              description="سراهای ثبت‌شده در سامانه"
              icon={<Building2 size={20} />}
              tone="blue"
            />

            <StatCard
              title="سراهای فعال"
              value={toPersianDigits(stats.active)}
              description="قابل استفاده برای پذیرش"
              icon={<CheckCircle2 size={20} />}
              tone="emerald"
            />

            <StatCard
              title="در حال تعمیر"
              value={toPersianDigits(stats.maintenance)}
              description="موقتاً خارج از چرخه عادی"
              icon={<Wrench size={20} />}
              tone="amber"
            />

            <StatCard
              title="ظرفیت کل"
              value={toPersianDigits(stats.totalCapacity)}
              description="مجموع ظرفیت سراها"
              icon={<BedDouble size={20} />}
              tone="violet"
            />

            <StatCard
              title="ظرفیت آزاد"
              value={toPersianDigits(stats.availableCapacity)}
              description="قابل تخصیص در حال حاضر"
              icon={<Home size={20} />}
              tone="emerald"
            />
          </section>

          <SectionCard
            title="فهرست سراهای اسکان"
            description="نمایش اطلاعات پایه سراها، ظرفیت، وضعیت و مسئول مربوطه."
            action={
              <PermissionGuard
                permissions={currentUser.permissions}
                required="shelter.profiles.manage"
              >
                <a
                  href={`${APP_BASE_PATH}/shelter/profiles/new`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Plus size={16} />
                  افزودن سرا
                </a>
              </PermissionGuard>
            }
          >
            {rows.length === 0 ? (
              <EmptyState
                title="سرایی یافت نشد"
                description="با تغییر فیلترها یا ثبت سرای جدید دوباره بررسی کنید."
              />
            ) : (
              <div
                className={cn(
                  "overflow-hidden rounded-2xl border border-gray-200",
                  density === "compact" ? "text-xs" : "text-sm",
                )}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="text-right text-xs font-semibold text-gray-600">
                        <th className="px-4 py-3">نام سرا</th>
                        <th className="px-4 py-3">منطقه / ناحیه</th>
                        <th className="px-4 py-3">مسئول</th>
                        <th className="px-4 py-3">ظرفیت کل</th>
                        <th className="px-4 py-3">اشغال</th>
                        <th className="px-4 py-3">آزاد</th>
                        <th className="px-4 py-3">وضعیت</th>
                        <th className="px-4 py-3">ثبت</th>
                        <th className="px-4 py-3">عملیات</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {rows.map((item) => {
                        const status = getShelterStatusMeta(item.status);

                        return (
                          <tr key={item.id} className="align-top">
                            <td className="px-4 py-4">
                              <div className="font-medium text-gray-950">
                                {item.title}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {item.neighborhood_hall_name || "—"}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {(item.region_name || "—") +
                                " / " +
                                (item.district_name || "—")}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              <div>{item.manager_name || "—"}</div>
                              <div className="mt-1 text-xs text-gray-500">
                                {item.manager_mobile || "—"}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {toPersianDigits(item.total_capacity || 0)}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {toPersianDigits(item.occupied_capacity || 0)}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {toPersianDigits(item.available_capacity || 0)}
                            </td>

                            <td className="px-4 py-4">
                              <Badge
                                label={status.label}
                                className={status.className}
                              />
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {formatDate(item.created_at)}
                            </td>

                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRecord(item);
                                  audit.track({
                                    type: "shelter.profile.viewed",
                                    message: "Shelter profile opened",
                                    metadata: { id: item.id },
                                  });
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                              >
                                <Eye size={16} />
                                مشاهده
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="جمع‌بندی مدیریت سراها"
            description="نکات عملیاتی برای مدیر سامانه."
          >
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
              <p className="text-sm leading-8 text-gray-700">
                برای جلوگیری از خطای ظرفیت، وضعیت سراهای غیرفعال و در حال تعمیر
                باید پیش از تخصیص رزرو بررسی شود. همچنین ظرفیت آزاد هر سرا باید
                با فضاهای زیرمجموعه آن همخوانی داشته باشد.
              </p>
            </div>
          </SectionCard>
        </div>

        <Modal
          open={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={selectedRecord?.title || "جزئیات سرا"}
          description="اطلاعات پایه، ظرفیت و وضعیت عملیاتی سرا."
        >
          {selectedRecord ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoItem label="شناسه" value={String(selectedRecord.id)} />
                <InfoItem label="نام سرا" value={selectedRecord.title} />
                <InfoItem
                  label="سرای محله"
                  value={selectedRecord.neighborhood_hall_name || "—"}
                />
                <InfoItem
                  label="منطقه"
                  value={selectedRecord.region_name || "—"}
                />
                <InfoItem
                  label="ناحیه"
                  value={selectedRecord.district_name || "—"}
                />
                <InfoItem
                  label="ظرفیت کل"
                  value={toPersianDigits(selectedRecord.total_capacity || 0)}
                />
                <InfoItem
                  label="ظرفیت اشغال"
                  value={toPersianDigits(selectedRecord.occupied_capacity || 0)}
                />
                <InfoItem
                  label="ظرفیت آزاد"
                  value={toPersianDigits(
                    selectedRecord.available_capacity || 0,
                  )}
                />
              </div>

              <SectionCard
                title="اطلاعات مسئول"
                description="مشخصات مدیر یا مسئول عملیاتی سرا."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem
                    label="نام مسئول"
                    value={selectedRecord.manager_name || "—"}
                  />
                  <InfoItem
                    label="شماره تماس"
                    value={selectedRecord.manager_mobile || "—"}
                  />
                </div>
              </SectionCard>

              <SectionCard title="آدرس" description="محل استقرار سرا.">
                <p className="text-sm leading-7 text-gray-700">
                  {selectedRecord.address || "—"}
                </p>
              </SectionCard>
            </div>
          ) : null}
        </Modal>
      </PageShell>
    </PermissionGuard>
  );
}
