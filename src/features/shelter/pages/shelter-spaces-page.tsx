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
  DoorOpen,
  Eye,
  Home,
  Plus,
  RefreshCcw,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { shelterApi } from "../api/shelter-api";
import type {
  ShelterSpace,
  ShelterSpaceType,
  ShelterStatus,
} from "../types/shelter-types";
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
  getSpaceTypeLabel,
  toPersianDigits,
} from "../utils/shelter-formatters";

const PAGE_KEY = "shelter-spaces";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر اسکان",
  permissions: [
    "shelter.spaces.view",
    "shelter.spaces.manage",
    "shelter.profiles.view",
    "settings.view",
  ],
};

export default function ShelterSpacesPage() {
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
        "shelter",
        "type",
        "capacity",
        "status",
        "created_at",
      ],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const [rows, setRows] = React.useState<ShelterSpace[]>([]);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<ShelterSpace | null>(null);

  const activeTab =
    (preferences.activeTab as ShelterSpaceType | "all") || "all";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadRows = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response = await shelterApi.spaces({
        search,
        type: activeTab === "all" ? undefined : activeTab,
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

  const deleteRecord = async (id: string | number) => {
    const ok = window.confirm("آیا از حذف این فضا مطمئن هستید؟");
    if (!ok) return;

    try {
      await shelterApi.deleteSpace(id);
      audit.track({
        type: "shelter.space.deleted",
        message: "Shelter space deleted",
        metadata: { id },
      });
      await loadRows();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در حذف فضا");
    }
  };

  const stats = React.useMemo(() => {
    const totalCapacity = rows.reduce(
      (sum, item) => sum + Number(item.capacity || 0),
      0,
    );
    const occupiedCapacity = rows.reduce(
      (sum, item) => sum + Number(item.occupied_capacity || 0),
      0,
    );
    const availableCapacity = rows.reduce(
      (sum, item) => sum + Number(item.available_capacity || 0),
      0,
    );

    return {
      total: rows.length,
      totalCapacity,
      occupiedCapacity,
      availableCapacity,
      rooms: rows.filter((item) => item.type === "room").length,
      halls: rows.filter((item) => item.type === "hall").length,
      emergency: rows.filter((item) => item.type === "emergency").length,
    };
  }, [rows]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="shelter.spaces.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده فضاهای اسکان را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="فضاهای اسکان"
        description="مدیریت اتاق‌ها، سالن‌ها، تخت‌ها و ظرفیت قابل تخصیص در هر سرا."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/shelter/spaces`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "اسکان", href: `${APP_BASE_PATH}/shelter` },
          { label: "فضاها", href: `${APP_BASE_PATH}/shelter/spaces` },
        ]}
        actions={[
          {
            id: "refresh",
            label: "بروزرسانی",
            icon: <RefreshCcw size={16} />,
            variant: "secondary",
            onClick: loadRows,
          },
          {
            id: "create-space",
            label: "افزودن فضا",
            icon: <Plus size={16} />,
            variant: "primary",
            href: `${APP_BASE_PATH}/shelter/spaces/new`,
            permission: "shelter.spaces.manage",
          },
        ]}
        commandActions={[
          {
            id: "shelter-dashboard",
            title: "داشبورد اسکان",
            subtitle: "نمای ظرفیت و رزروها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter`,
            keywords: ["dashboard", "داشبورد"],
          },
          {
            id: "shelter-profiles",
            title: "سراهای اسکان",
            subtitle: "مدیریت سراها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/profiles`,
            keywords: ["profiles", "سرا"],
          },
          {
            id: "reset-shelter-spaces-preferences",
            title: "بازنشانی تنظیمات فضاها",
            subtitle: "حذف تنظیمات ذخیره‌شده این صفحه",
            group: "تنظیمات",
            onSelect: resetPreferences,
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {toPersianDigits(stats.total)} فضا
            </span>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
              ظرفیت کل: {toPersianDigits(stats.totalCapacity)}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              آزاد: {toPersianDigits(stats.availableCapacity)}
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

          <div className="rounded-2xl border border-gray-200 bg-white px-4 shadow-sm">
            <PageTabs
              value={activeTab}
              onChange={setActiveTab}
              tabs={[
                { id: "all", label: "همه", badge: stats.total },
                { id: "room", label: "اتاق", badge: stats.rooms },
                { id: "hall", label: "سالن", badge: stats.halls },
                { id: "emergency", label: "اضطراری", badge: stats.emergency },
              ]}
            />
          </div>

          {error ? (
            <EmptyState title="خطا در دریافت اطلاعات" description={error} />
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="کل فضاها"
              value={toPersianDigits(stats.total)}
              description="فضاهای ثبت‌شده"
              icon={<DoorOpen size={20} />}
              tone="blue"
            />
            <StatCard
              title="ظرفیت کل"
              value={toPersianDigits(stats.totalCapacity)}
              description="ظرفیت تجمیعی فضاها"
              icon={<BedDouble size={20} />}
              tone="violet"
            />
            <StatCard
              title="ظرفیت اشغال"
              value={toPersianDigits(stats.occupiedCapacity)}
              description="ظرفیت مصرف‌شده"
              icon={<Users size={20} />}
              tone="amber"
            />
            <StatCard
              title="ظرفیت آزاد"
              value={toPersianDigits(stats.availableCapacity)}
              description="قابل تخصیص"
              icon={<Home size={20} />}
              tone="emerald"
            />
          </section>

          <SectionCard
            title="فهرست فضاهای اسکان"
            description="نمایش فضاهای زیرمجموعه سراها، نوع فضا، ظرفیت و وضعیت."
            action={
              <PermissionGuard
                permissions={currentUser.permissions}
                required="shelter.spaces.manage"
              >
                <a
                  href={`${APP_BASE_PATH}/shelter/spaces/new`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Plus size={16} />
                  افزودن فضا
                </a>
              </PermissionGuard>
            }
          >
            {rows.length === 0 ? (
              <EmptyState
                title="فضایی یافت نشد"
                description="با تغییر جستجو یا ثبت فضا دوباره بررسی کنید."
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
                        <th className="px-4 py-3">فضا</th>
                        <th className="px-4 py-3">سرا</th>
                        <th className="px-4 py-3">نوع</th>
                        <th className="px-4 py-3">ظرفیت</th>
                        <th className="px-4 py-3">اشغال</th>
                        <th className="px-4 py-3">آزاد</th>
                        <th className="px-4 py-3">وضعیت</th>
                        <th className="px-4 py-3">ثبت</th>
                        <th className="px-4 py-3">عملیات</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {rows.map((item) => {
                        const status = getShelterStatusMeta(
                          item.status as ShelterStatus,
                        );

                        return (
                          <tr key={item.id} className="align-top">
                            <td className="px-4 py-4 font-medium text-gray-950">
                              {item.title}
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {item.shelter_title || "—"}
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {getSpaceTypeLabel(item.type)}
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {toPersianDigits(item.capacity || 0)}
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
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRecord(item)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                                >
                                  <Eye size={16} />
                                  مشاهده
                                </button>

                                <PermissionGuard
                                  permissions={currentUser.permissions}
                                  required="shelter.spaces.manage"
                                >
                                  <button
                                    type="button"
                                    onClick={() => deleteRecord(item.id)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50"
                                  >
                                    <Trash2 size={16} />
                                    حذف
                                  </button>
                                </PermissionGuard>
                              </div>
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
          title={selectedRecord?.title || "جزئیات فضا"}
          description="اطلاعات ظرفیت و وضعیت فضا."
        >
          {selectedRecord ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoItem label="شناسه" value={String(selectedRecord.id)} />
                <InfoItem label="نام فضا" value={selectedRecord.title} />
                <InfoItem
                  label="سرا"
                  value={selectedRecord.shelter_title || "—"}
                />
                <InfoItem
                  label="نوع"
                  value={getSpaceTypeLabel(selectedRecord.type)}
                />
                <InfoItem
                  label="ظرفیت"
                  value={toPersianDigits(selectedRecord.capacity || 0)}
                />
                <InfoItem
                  label="اشغال"
                  value={toPersianDigits(selectedRecord.occupied_capacity || 0)}
                />
                <InfoItem
                  label="آزاد"
                  value={toPersianDigits(
                    selectedRecord.available_capacity || 0,
                  )}
                />
                <InfoItem
                  label="تاریخ ثبت"
                  value={formatDate(selectedRecord.created_at)}
                />
              </div>

              <SectionCard title="توضیحات" description="شرح فضا.">
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
