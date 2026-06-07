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
  CheckCircle2,
  Eye,
  FolderTree,
  Plus,
  RefreshCcw,
  Settings,
  ShieldAlert,
  Tags,
} from "lucide-react";
import { shelterApi } from "../api/shelter-api";
import type {
  ShelterCategory,
  ShelterCategoryStatus,
} from "../types/shelter-types";
import {
  Badge,
  InfoItem,
  Modal,
  SectionCard,
  StatCard,
} from "../components/shelter-shared";
import { cn, formatDate, toPersianDigits } from "../utils/shelter-formatters";

const PAGE_KEY = "shelter-categories";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر اسکان",
  permissions: [
    "dashboard.view",
    "shelter.dashboard.view",
    "shelter.profiles.view",
    "shelter.profiles.manage",
    "shelter.categories.view",
    "shelter.categories.manage",
    "settings.view",
  ],
};

function getCategoryStatusMeta(status: ShelterCategoryStatus) {
  const map = {
    active: {
      label: "فعال",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    inactive: {
      label: "غیرفعال",
      className: "bg-gray-100 text-gray-700 ring-gray-200",
    },
  } satisfies Record<
    ShelterCategoryStatus,
    { label: string; className: string }
  >;

  return map[status];
}

export default function ShelterCategoriesPage() {
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
        "shelters_count",
        "spaces_count",
        "status",
      ],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const [rows, setRows] = React.useState<ShelterCategory[]>([]);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<ShelterCategory | null>(null);

  const activeTab =
    (preferences.activeTab as ShelterCategoryStatus | "all") || "all";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadRows = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response = await shelterApi.categories({
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

    const sheltersCount = rows.reduce(
      (sum, item) => sum + Number(item.shelters_count || 0),
      0,
    );

    const spacesCount = rows.reduce(
      (sum, item) => sum + Number(item.spaces_count || 0),
      0,
    );

    return {
      total: rows.length,
      active,
      inactive,
      sheltersCount,
      spacesCount,
    };
  }, [rows]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="shelter.categories.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده دسته‌بندی سراها را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="دسته‌بندی سراها"
        description="مدیریت گروه‌بندی سراهای اسکان برای تفکیک نوع خدمت، ظرفیت و کاربرد عملیاتی."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/shelters/categories`}
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
            label: "دسته‌بندی سراها",
            href: `${APP_BASE_PATH}/shelters/categories`,
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
                type: "shelter.categories.refreshed",
                message: "Shelter categories refreshed",
              });
              loadRows();
            },
          },
          {
            id: "create-category",
            label: "افزودن دسته‌بندی",
            icon: <Plus size={16} />,
            variant: "primary",
            href: `${APP_BASE_PATH}/shelters/categories/new`,
            permission: "shelter.categories.manage",
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
            id: "shelter-facilities",
            title: "امکانات سرا",
            subtitle: "مدیریت امکانات و تجهیزات",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelters/facilities`,
            keywords: ["facilities", "امکانات"],
          },
          {
            id: "reset-shelter-categories-preferences",
            title: "بازنشانی تنظیمات دسته‌بندی سراها",
            subtitle: "حذف تنظیمات ذخیره‌شده این صفحه",
            group: "تنظیمات",
            onSelect: resetPreferences,
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {toPersianDigits(stats.total)} دسته‌بندی
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {toPersianDigits(stats.active)} فعال
            </span>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              {toPersianDigits(stats.sheltersCount)} سرا
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
                type: "shelter.categories.filtered",
                message: "Shelter categories search changed",
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
                  type: "shelter.categories.filtered",
                  message: "Shelter categories status tab changed",
                  metadata: { tab },
                });
              }}
              tabs={[
                { id: "all", label: "همه", badge: stats.total },
                { id: "active", label: "فعال", badge: stats.active },
                { id: "inactive", label: "غیرفعال", badge: stats.inactive },
              ]}
            />
          </div>

          {error ? (
            <EmptyState title="خطا در دریافت اطلاعات" description={error} />
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="کل دسته‌بندی‌ها"
              value={toPersianDigits(stats.total)}
              description="دسته‌بندی‌های تعریف‌شده"
              icon={<Tags size={20} />}
              tone="blue"
            />

            <StatCard
              title="فعال"
              value={toPersianDigits(stats.active)}
              description="قابل استفاده در پروفایل سرا"
              icon={<CheckCircle2 size={20} />}
              tone="emerald"
            />

            <StatCard
              title="سراهای متصل"
              value={toPersianDigits(stats.sheltersCount)}
              description="مجموع سراهای مرتبط"
              icon={<FolderTree size={20} />}
              tone="violet"
            />

            <StatCard
              title="فضاهای مرتبط"
              value={toPersianDigits(stats.spacesCount)}
              description="فضاهای زیرمجموعه دسته‌ها"
              icon={<ShieldAlert size={20} />}
              tone="amber"
            />
          </section>

          <SectionCard
            title="فهرست دسته‌بندی سراها"
            description="نمایش دسته‌بندی‌ها، کد، تعداد سراهای مرتبط و وضعیت استفاده."
            action={
              <PermissionGuard
                permissions={currentUser.permissions}
                required="shelter.categories.manage"
              >
                <a
                  href={`${APP_BASE_PATH}/shelters/categories/new`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Plus size={16} />
                  افزودن دسته‌بندی
                </a>
              </PermissionGuard>
            }
          >
            {rows.length === 0 ? (
              <EmptyState
                title="دسته‌بندی‌ای یافت نشد"
                description="با تغییر فیلترها یا ثبت دسته‌بندی جدید دوباره بررسی کنید."
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
                        <th className="px-4 py-3">سراهای مرتبط</th>
                        <th className="px-4 py-3">فضاهای مرتبط</th>
                        <th className="px-4 py-3">وضعیت</th>
                        <th className="px-4 py-3">ثبت</th>
                        <th className="px-4 py-3">عملیات</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {rows.map((item) => {
                        const status = getCategoryStatusMeta(item.status);

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
                              {toPersianDigits(item.shelters_count || 0)}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {toPersianDigits(item.spaces_count || 0)}
                            </td>

                            <td className="px-4 py-4">
                              <Badge
                                label={status.label}
                                className={status.className}
                              />
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {formatDate(item.created_at || "")}
                            </td>

                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRecord(item);
                                  audit.track({
                                    type: "shelter.category.viewed",
                                    message: "Shelter category opened",
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
          title={selectedRecord?.title || "جزئیات دسته‌بندی"}
          description="اطلاعات دسته‌بندی سرا و تعداد ارتباطات ثبت‌شده."
        >
          {selectedRecord ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoItem label="شناسه" value={String(selectedRecord.id)} />
                <InfoItem label="عنوان" value={selectedRecord.title} />
                <InfoItem label="کد" value={selectedRecord.code || "—"} />
                <InfoItem
                  label="سراهای مرتبط"
                  value={toPersianDigits(selectedRecord.shelters_count || 0)}
                />
                <InfoItem
                  label="فضاهای مرتبط"
                  value={toPersianDigits(selectedRecord.spaces_count || 0)}
                />
                <InfoItem
                  label="وضعیت"
                  value={getCategoryStatusMeta(selectedRecord.status).label}
                />
                <InfoItem
                  label="تاریخ ثبت"
                  value={formatDate(selectedRecord.created_at || "")}
                />
                <InfoItem
                  label="آخرین ویرایش"
                  value={formatDate(selectedRecord.updated_at || "")}
                />
              </div>

              <SectionCard title="توضیحات" description="شرح کاربرد دسته‌بندی.">
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
