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
  CheckCircle2,
  Eye,
  PackageCheck,
  Plus,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { shelterApi } from "../api/shelter-api";
import type {
  ShelterFacility,
  ShelterFacilityStatus,
} from "../types/shelter-types";
import {
  Badge,
  InfoItem,
  Modal,
  SectionCard,
  StatCard,
} from "../components/shelter-shared";
import { cn, formatDate, toPersianDigits } from "../utils/shelter-formatters";

const PAGE_KEY = "shelter-facilities";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر اسکان",
  permissions: [
    "dashboard.view",
    "shelter.dashboard.view",
    "shelter.facilities.view",
    "shelter.facilities.manage",
    "settings.view",
  ],
};

function getFacilityStatusMeta(status: ShelterFacilityStatus) {
  const map = {
    active: {
      label: "فعال",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    inactive: {
      label: "غیرفعال",
      className: "bg-gray-100 text-gray-700 ring-gray-200",
    },
    maintenance: {
      label: "نیازمند رسیدگی",
      className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
  } satisfies Record<
    ShelterFacilityStatus,
    { label: string; className: string }
  >;

  return map[status];
}

export default function ShelterFacilitiesPage() {
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
        "code",
        "category",
        "shelters_count",
        "status",
        "is_required",
      ],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const [rows, setRows] = React.useState<ShelterFacility[]>([]);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<ShelterFacility | null>(null);

  const activeTab =
    (preferences.activeTab as ShelterFacilityStatus | "all") || "all";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadRows = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response = await shelterApi.facilities({
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
    loadRows();
  }, [loadRows]);

  const stats = React.useMemo(() => {
    const active = rows.filter((item) => item.status === "active").length;
    const inactive = rows.filter((item) => item.status === "inactive").length;
    const maintenance = rows.filter(
      (item) => item.status === "maintenance",
    ).length;
    const required = rows.filter((item) => item.is_required).length;

    return {
      total: rows.length,
      active,
      inactive,
      maintenance,
      required,
    };
  }, [rows]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="shelter.facilities.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده امکانات سرا را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="امکانات و تجهیزات سرا"
        description="مدیریت امکانات قابل تعریف برای سراها، تجهیزات الزامی و وضعیت عملیاتی آن‌ها."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/shelters/facilities`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "اسکان", href: `${APP_BASE_PATH}/shelter` },
          { label: "سراها", href: `${APP_BASE_PATH}/shelter/profiles` },
          {
            label: "امکانات و تجهیزات",
            href: `${APP_BASE_PATH}/shelters/facilities`,
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
                type: "shelter.facilities.refreshed",
                message: "Shelter facilities refreshed",
              });
              loadRows();
            },
          },
          {
            id: "create-facility",
            label: "افزودن امکان",
            icon: <Plus size={16} />,
            variant: "primary",
            href: `${APP_BASE_PATH}/shelters/facilities/new`,
            permission: "shelter.facilities.manage",
          },
        ]}
        commandActions={[
          {
            id: "shelter-profiles",
            title: "سراهای اسکان",
            subtitle: "مدیریت پروفایل سراها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/profiles`,
            keywords: ["shelter", "profiles", "سراها"],
          },
          {
            id: "shelter-categories",
            title: "دسته‌بندی سراها",
            subtitle: "مدیریت دسته‌بندی‌ها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelters/categories`,
            keywords: ["categories", "دسته‌بندی"],
          },
          {
            id: "reset-shelter-facilities-preferences",
            title: "بازنشانی تنظیمات امکانات سرا",
            subtitle: "حذف تنظیمات ذخیره‌شده این صفحه",
            group: "تنظیمات",
            onSelect: resetPreferences,
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {toPersianDigits(stats.total)} امکان
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {toPersianDigits(stats.active)} فعال
            </span>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              {toPersianDigits(stats.required)} الزامی
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
                type: "shelter.facilities.filtered",
                message: "Shelter facilities search changed",
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
                  type: "shelter.facilities.filtered",
                  message: "Shelter facilities status tab changed",
                  metadata: { tab },
                });
              }}
              tabs={[
                { id: "all", label: "همه", badge: stats.total },
                { id: "active", label: "فعال", badge: stats.active },
                {
                  id: "maintenance",
                  label: "نیازمند رسیدگی",
                  badge: stats.maintenance,
                },
                { id: "inactive", label: "غیرفعال", badge: stats.inactive },
              ]}
            />
          </div>

          {error ? (
            <EmptyState title="خطا در دریافت اطلاعات" description={error} />
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="کل امکانات"
              value={toPersianDigits(stats.total)}
              description="امکانات ثبت‌شده"
              icon={<PackageCheck size={20} />}
              tone="blue"
            />

            <StatCard
              title="امکانات فعال"
              value={toPersianDigits(stats.active)}
              description="قابل تخصیص به سراها"
              icon={<CheckCircle2 size={20} />}
              tone="emerald"
            />

            <StatCard
              title="نیازمند رسیدگی"
              value={toPersianDigits(stats.maintenance)}
              description="امکانات دارای وضعیت عملیاتی خاص"
              icon={<Wrench size={20} />}
              tone="amber"
            />

            <StatCard
              title="امکانات الزامی"
              value={toPersianDigits(stats.required)}
              description="موارد ضروری برای سرا"
              icon={<ShieldCheck size={20} />}
              tone="violet"
            />
          </section>

          <SectionCard
            title="فهرست امکانات و تجهیزات"
            description="نمایش امکانات تعریف‌شده، گروه، الزامی بودن و وضعیت استفاده."
            action={
              <PermissionGuard
                permissions={currentUser.permissions}
                required="shelter.facilities.manage"
              >
                <a
                  href={`${APP_BASE_PATH}/shelters/facilities/new`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Plus size={16} />
                  افزودن امکان
                </a>
              </PermissionGuard>
            }
          >
            {rows.length === 0 ? (
              <EmptyState
                title="امکانی یافت نشد"
                description="با تغییر فیلترها یا ثبت امکان جدید دوباره بررسی کنید."
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
                        <th className="px-4 py-3">عنوان</th>
                        <th className="px-4 py-3">کد</th>
                        <th className="px-4 py-3">گروه</th>
                        <th className="px-4 py-3">سراهای دارای امکان</th>
                        <th className="px-4 py-3">الزامی</th>
                        <th className="px-4 py-3">وضعیت</th>
                        <th className="px-4 py-3">ثبت</th>
                        <th className="px-4 py-3">عملیات</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {rows.map((item) => {
                        const status = getFacilityStatusMeta(item.status);

                        return (
                          <tr key={item.id} className="align-top">
                            <td className="px-4 py-4">
                              <div className="font-medium text-gray-950">
                                {item.title}
                              </div>
                              <div className="mt-1 line-clamp-1 text-xs text-gray-500">
                                {item.description || "—"}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {item.code || "—"}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {item.category || "—"}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {toPersianDigits(item.shelters_count || 0)}
                            </td>

                            <td className="px-4 py-4">
                              <Badge
                                label={item.is_required ? "بله" : "خیر"}
                                className={
                                  item.is_required
                                    ? "bg-violet-50 text-violet-700 ring-violet-200"
                                    : "bg-gray-100 text-gray-700 ring-gray-200"
                                }
                              />
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
                                    type: "shelter.facility.viewed",
                                    message: "Shelter facility opened",
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
        </div>

        <Modal
          open={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={selectedRecord?.title || "جزئیات امکان"}
          description="اطلاعات امکان یا تجهیز قابل تخصیص به سرا."
        >
          {selectedRecord ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoItem label="شناسه" value={String(selectedRecord.id)} />
                <InfoItem label="عنوان" value={selectedRecord.title} />
                <InfoItem label="کد" value={selectedRecord.code || "—"} />
                <InfoItem label="گروه" value={selectedRecord.category || "—"} />
                <InfoItem
                  label="سراهای دارای امکان"
                  value={toPersianDigits(selectedRecord.shelters_count || 0)}
                />
                <InfoItem
                  label="الزامی"
                  value={selectedRecord.is_required ? "بله" : "خیر"}
                />
                <InfoItem
                  label="وضعیت"
                  value={getFacilityStatusMeta(selectedRecord.status).label}
                />
                <InfoItem
                  label="تاریخ ثبت"
                  value={formatDate(selectedRecord.created_at || "")}
                />
              </div>

              <SectionCard title="توضیحات" description="شرح کاربرد این امکان.">
                <p className="text-sm leading-7 text-gray-700">
                  {selectedRecord.description || "—"}
                </p>
              </SectionCard>
            </div>
          ) : null}
        </Modal>
      </PageShell>
    </PermissionGuard>
  );
}
