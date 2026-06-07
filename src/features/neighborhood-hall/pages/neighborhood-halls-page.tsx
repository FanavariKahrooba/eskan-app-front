"use client";

import * as React from "react";
import { Building2, Eye, Plus, RefreshCcw, Users, MapPin } from "lucide-react";
import EmptyState from "@/features/power-shell-pro/components/enterprise/empty-state";
import PageToolbar from "@/features/power-shell-pro/components/enterprise/page-toolbar";
import PermissionGuard from "@/features/power-shell-pro/components/enterprise/permission-guard";
import { useAuditLog } from "@/features/power-shell-pro/hooks/use-audit-log";
import { usePagePreferences } from "@/features/power-shell-pro/hooks/use-page-preferences";
import PageShell from "@/features/power-shell/components/breadcrumb-tools/page-shell";
import {
  Badge,
  InfoItem,
  Modal,
  SectionCard,
  StatCard,
} from "@/features/shelter/components/shelter-shared";
import { neighborhoodHallApi } from "../api/neighborhood-hall-api";
import type {
  NeighborhoodHallDashboard,
  NeighborhoodHallListItem,
} from "../types/neighborhood-hall-types";
import {
  cn,
  formatDate,
  toPersianDigits,
} from "../utils/neighborhood-hall-formatters";

const PAGE_KEY = "neighborhood-halls";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  permissions: [
    "dashboard.view",
    "neighborhood-halls.view",
    "neighborhood-halls.manage",
    "settings.view",
  ],
};

export default function NeighborhoodHallsPage() {
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
      search: "",
      density: "comfortable",
      pageSize: 10,
      visibleColumns: ["name", "user", "phone_number", "created_at"],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const [rows, setRows] = React.useState<NeighborhoodHallListItem[]>([]);
  const [dashboard, setDashboard] =
    React.useState<NeighborhoodHallDashboard | null>(null);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<NeighborhoodHallListItem | null>(null);

  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadRows = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const [listResponse, dashboardResponse] = await Promise.all([
        neighborhoodHallApi.list({
          q: search,
          page: 1,
        }),
        neighborhoodHallApi.dashboard(),
      ]);

      setRows(listResponse.data || []);
      setDashboard(dashboardResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
    } finally {
      setApiLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    loadRows();
  }, [loadRows]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="neighborhood-halls.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده سراهای محله را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="سراهای محله"
        description="مدیریت سراهای محله، مدیران، مشخصات تماس و اطلاعات پایه هر سرا."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/neighborhood-halls`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          {
            label: "سراهای محله",
            href: `${APP_BASE_PATH}/neighborhood-halls`,
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
                type: "neighborhood_halls.refreshed",
                message: "Neighborhood halls refreshed",
              });
              loadRows();
            },
          },
          {
            id: "create",
            label: "افزودن سرا",
            icon: <Plus size={16} />,
            variant: "primary",
            href: `${APP_BASE_PATH}/neighborhood-halls/new`,
            permission: "neighborhood-halls.manage",
          },
        ]}
        commandActions={[
          {
            id: "employees",
            title: "کارکنان سرا",
            subtitle: "مدیریت کارکنان سرای تحت مدیریت",
            group: "سراهای محله",
            href: `${APP_BASE_PATH}/neighborhood-halls/employees`,
            keywords: ["employees", "staff", "کارکنان"],
          },
          {
            id: "servants",
            title: "خدمات سرا",
            subtitle: "مدیریت نیروهای خدماتی",
            group: "سراهای محله",
            href: `${APP_BASE_PATH}/neighborhood-halls/servants`,
            keywords: ["servants", "خدمات"],
          },
          {
            id: "reset",
            title: "بازنشانی تنظیمات صفحه سراهای محله",
            group: "تنظیمات",
            onSelect: resetPreferences,
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {toPersianDigits(dashboard?.NeighborhoodHallCount ?? rows.length)}{" "}
              سرا
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {toPersianDigits(dashboard?.userCountManager ?? 0)} مدیر سرا
            </span>

            {saving ? (
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                در حال ذخیره تنظیمات...
              </span>
            ) : null}
          </div>
        }
      >
        <div className="space-y-4">
          <PageToolbar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              audit.track({
                type: "neighborhood_halls.filtered",
                message: "Neighborhood halls search changed",
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

          {error ? (
            <EmptyState title="خطا در دریافت اطلاعات" description={error} />
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="تعداد سراها"
              value={toPersianDigits(
                dashboard?.NeighborhoodHallCount ?? rows.length,
              )}
              description="سراهای ثبت‌شده در سامانه"
              icon={<Building2 size={20} />}
              tone="blue"
            />

            <StatCard
              title="مدیران سرا"
              value={toPersianDigits(dashboard?.userCountManager ?? 0)}
              description="کاربران دارای نقش مدیر سرا"
              icon={<Users size={20} />}
              tone="emerald"
            />

            <StatCard
              title="رکوردهای صفحه"
              value={toPersianDigits(rows.length)}
              description="نتایج قابل نمایش در این صفحه"
              icon={<MapPin size={20} />}
              tone="violet"
            />
          </section>

          <SectionCard
            title="فهرست سراهای محله"
            description="نمایش نام سرا، مدیر، شماره تماس مدیر و تاریخ ثبت."
            action={
              <PermissionGuard
                permissions={currentUser.permissions}
                required="neighborhood-halls.manage"
              >
                <a
                  href={`${APP_BASE_PATH}/neighborhood-halls/new`}
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
                description="با تغییر عبارت جستجو یا ثبت سرای جدید دوباره بررسی کنید."
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
                        <th className="px-4 py-3">مدیر</th>
                        <th className="px-4 py-3">شماره تماس مدیر</th>
                        <th className="px-4 py-3">تاریخ ثبت</th>
                        <th className="px-4 py-3">وضعیت</th>
                        <th className="px-4 py-3">عملیات</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {rows.map((item) => (
                        <tr key={item.id} className="align-top">
                          <td className="px-4 py-4 font-medium text-gray-950">
                            {item.name}
                          </td>

                          <td className="px-4 py-4 text-gray-700">
                            {item.user || "—"}
                          </td>

                          <td className="px-4 py-4 text-gray-700">
                            {item.phone_number || "—"}
                          </td>

                          <td className="px-4 py-4 text-gray-700">
                            {formatDate(item.created_at)}
                          </td>

                          <td className="px-4 py-4">
                            <Badge
                              label="ثبت‌شده"
                              className="bg-emerald-50 text-emerald-700 ring-emerald-200"
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRecord(item);
                                  audit.track({
                                    type: "neighborhood_hall.viewed",
                                    message: "Neighborhood hall opened",
                                    metadata: { id: item.id },
                                  });
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                              >
                                <Eye size={16} />
                                مشاهده
                              </button>

                              <a
                                href={`${APP_BASE_PATH}/neighborhood-halls/${item.id}/edit`}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                              >
                                ویرایش
                              </a>
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
        </div>

        <Modal
          open={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={selectedRecord?.name || "جزئیات سرا"}
          description="اطلاعات خلاصه سرای محله."
        >
          {selectedRecord ? (
            <div className="grid gap-4 md:grid-cols-2">
              <InfoItem
                label="شناسه"
                value={toPersianDigits(selectedRecord.id)}
              />
              <InfoItem label="نام سرا" value={selectedRecord.name} />
              <InfoItem label="مدیر" value={selectedRecord.user || "—"} />
              <InfoItem
                label="شماره تماس"
                value={selectedRecord.phone_number || "—"}
              />
              <InfoItem
                label="تاریخ ثبت"
                value={formatDate(selectedRecord.created_at)}
              />
            </div>
          ) : null}
        </Modal>
      </PageShell>
    </PermissionGuard>
  );
}
