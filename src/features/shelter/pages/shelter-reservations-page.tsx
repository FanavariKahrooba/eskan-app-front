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
  CheckCircle2,
  DoorOpen,
  Eye,
  LogOut,
  RefreshCcw,
  Settings,
  UserCheck,
  XCircle,
} from "lucide-react";
import { shelterApi } from "../api/shelter-api";
import type {
  ShelterReservation,
  ShelterReservationStatus,
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
  getReservationStatusMeta,
  toPersianDigits,
} from "../utils/shelter-formatters";

const PAGE_KEY = "shelter-reservations";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر پذیرش",
  permissions: [
    "shelter.reservations.view",
    "shelter.reservations.manage",
    "settings.view",
  ],
};

export default function ShelterReservationsPage() {
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
        "user",
        "shelter",
        "space",
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

  const [rows, setRows] = React.useState<ShelterReservation[]>([]);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<ShelterReservation | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const activeTab =
    (preferences.activeTab as ShelterReservationStatus | "all") || "all";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadRows = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response = await shelterApi.reservations({
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

  const runReservationAction = async (
    action: "check-in" | "check-out" | "cancel",
  ) => {
    if (!selectedRecord) return;

    const labels = {
      "check-in": "پذیرش",
      "check-out": "خروج",
      cancel: "لغو",
    };

    const ok = window.confirm(
      `آیا از ثبت عملیات ${labels[action]} برای این رزرو مطمئن هستید؟`,
    );
    if (!ok) return;

    try {
      setActionLoading(true);

      if (action === "check-in") {
        await shelterApi.checkInReservation(selectedRecord.id);
      }

      if (action === "check-out") {
        await shelterApi.checkOutReservation(selectedRecord.id);
      }

      if (action === "cancel") {
        await shelterApi.cancelReservation(selectedRecord.id);
      }

      audit.track({
        type: "shelter.reservation.action",
        message: "Shelter reservation action executed",
        metadata: { id: selectedRecord.id, action },
      });

      setSelectedRecord(null);
      await loadRows();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در اجرای عملیات");
    } finally {
      setActionLoading(false);
    }
  };

  const stats = React.useMemo(() => {
    return {
      total: rows.length,
      reserved: rows.filter((item) => item.status === "reserved").length,
      checkedIn: rows.filter((item) => item.status === "checked_in").length,
      checkedOut: rows.filter((item) => item.status === "checked_out").length,
      cancelled: rows.filter((item) => item.status === "cancelled").length,
      capacity: rows.reduce((sum, item) => sum + Number(item.capacity || 0), 0),
    };
  }, [rows]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="shelter.reservations.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده رزروهای اسکان را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="رزروها و پذیرش اسکان"
        description="مدیریت رزروها، ثبت پذیرش، خروج و لغو رزروهای سراهای محله."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/shelter/reservations`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "اسکان", href: `${APP_BASE_PATH}/shelter` },
          { label: "رزروها", href: `${APP_BASE_PATH}/shelter/reservations` },
        ]}
        actions={[
          {
            id: "refresh",
            label: "بروزرسانی",
            icon: <RefreshCcw size={16} />,
            variant: "secondary",
            onClick: loadRows,
          },
        ]}
        commandActions={[
          {
            id: "shelter-dashboard",
            title: "داشبورد اسکان",
            subtitle: "نمای ظرفیت و وضعیت کلی",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter`,
            keywords: ["dashboard", "داشبورد"],
          },
          {
            id: "shelter-requests",
            title: "درخواست‌های اسکان",
            subtitle: "بررسی درخواست‌ها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/requests`,
            keywords: ["requests", "درخواست"],
          },
          {
            id: "reset-shelter-reservations-preferences",
            title: "بازنشانی تنظیمات رزروها",
            subtitle: "حذف تنظیمات ذخیره‌شده این صفحه",
            group: "تنظیمات",
            onSelect: resetPreferences,
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              رزرو فعال: {toPersianDigits(stats.reserved)}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              پذیرش شده: {toPersianDigits(stats.checkedIn)}
            </span>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
              ظرفیت رزروشده: {toPersianDigits(stats.capacity)}
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
                { id: "reserved", label: "رزرو شده", badge: stats.reserved },
                {
                  id: "checked_in",
                  label: "پذیرش شده",
                  badge: stats.checkedIn,
                },
                {
                  id: "checked_out",
                  label: "خروج ثبت شده",
                  badge: stats.checkedOut,
                },
                { id: "cancelled", label: "لغو شده", badge: stats.cancelled },
              ]}
            />
          </div>

          {error ? (
            <EmptyState title="خطا در دریافت اطلاعات" description={error} />
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="کل رزروها"
              value={toPersianDigits(stats.total)}
              description="رزروهای ثبت‌شده"
              icon={<BedDouble size={20} />}
              tone="blue"
            />
            <StatCard
              title="رزرو فعال"
              value={toPersianDigits(stats.reserved)}
              description="در انتظار پذیرش"
              icon={<UserCheck size={20} />}
              tone="violet"
            />
            <StatCard
              title="پذیرش شده"
              value={toPersianDigits(stats.checkedIn)}
              description="افراد مستقر"
              icon={<CheckCircle2 size={20} />}
              tone="emerald"
            />
            <StatCard
              title="لغو شده"
              value={toPersianDigits(stats.cancelled)}
              description="رزروهای لغوشده"
              icon={<XCircle size={20} />}
              tone="rose"
            />
          </section>

          <SectionCard
            title="فهرست رزروهای اسکان"
            description="برای هر رزرو می‌توانید پذیرش، خروج یا لغو را ثبت کنید."
          >
            {rows.length === 0 ? (
              <EmptyState
                title="رزروی یافت نشد"
                description="با تغییر فیلترها دوباره بررسی کنید."
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
                        <th className="px-4 py-3">متقاضی</th>
                        <th className="px-4 py-3">سرا</th>
                        <th className="px-4 py-3">فضا</th>
                        <th className="px-4 py-3">ظرفیت</th>
                        <th className="px-4 py-3">وضعیت</th>
                        <th className="px-4 py-3">پذیرش</th>
                        <th className="px-4 py-3">خروج</th>
                        <th className="px-4 py-3">عملیات</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {rows.map((item) => {
                        const status = getReservationStatusMeta(item.status);

                        return (
                          <tr key={item.id} className="align-top">
                            <td className="px-4 py-4">
                              <div className="font-medium text-gray-950">
                                {item.user_name || "—"}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {item.user_mobile || "—"}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {item.shelter_title || "—"}
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {item.space_title || "—"}
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {toPersianDigits(item.capacity || 0)}
                            </td>
                            <td className="px-4 py-4">
                              <Badge
                                label={status.label}
                                className={status.className}
                              />
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {formatDate(item.check_in_at)}
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {formatDate(item.check_out_at)}
                            </td>
                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() => setSelectedRecord(item)}
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
          title="جزئیات رزرو اسکان"
          description="اطلاعات رزرو و عملیات پذیرش، خروج یا لغو."
        >
          {selectedRecord ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoItem label="شناسه" value={String(selectedRecord.id)} />
                <InfoItem
                  label="متقاضی"
                  value={selectedRecord.user_name || "—"}
                />
                <InfoItem
                  label="موبایل"
                  value={selectedRecord.user_mobile || "—"}
                />
                <InfoItem
                  label="سرا"
                  value={selectedRecord.shelter_title || "—"}
                />
                <InfoItem
                  label="فضا"
                  value={selectedRecord.space_title || "—"}
                />
                <InfoItem
                  label="ظرفیت"
                  value={toPersianDigits(selectedRecord.capacity || 0)}
                />
                <InfoItem
                  label="وضعیت"
                  value={getReservationStatusMeta(selectedRecord.status).label}
                />
                <InfoItem
                  label="تاریخ ثبت"
                  value={formatDate(selectedRecord.created_at)}
                />
              </div>

              <SectionCard
                title="زمان‌بندی پذیرش و خروج"
                description="وضعیت ثبت ورود و خروج رزرو."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem
                    label="زمان پذیرش"
                    value={formatDate(selectedRecord.check_in_at)}
                  />
                  <InfoItem
                    label="زمان خروج"
                    value={formatDate(selectedRecord.check_out_at)}
                  />
                </div>
              </SectionCard>

              <PermissionGuard
                permissions={currentUser.permissions}
                required="shelter.reservations.manage"
              >
                <SectionCard
                  title="عملیات رزرو"
                  description="عملیات مجاز با توجه به وضعیت فعلی رزرو."
                >
                  <div className="flex flex-wrap gap-3">
                    {selectedRecord.status === "reserved" ? (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => runReservationAction("check-in")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                      >
                        <DoorOpen size={16} />
                        ثبت پذیرش
                      </button>
                    ) : null}

                    {selectedRecord.status === "checked_in" ? (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => runReservationAction("check-out")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
                      >
                        <LogOut size={16} />
                        ثبت خروج
                      </button>
                    ) : null}

                    {["reserved", "checked_in"].includes(
                      selectedRecord.status,
                    ) ? (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => runReservationAction("cancel")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
                      >
                        <XCircle size={16} />
                        لغو رزرو
                      </button>
                    ) : null}
                  </div>
                </SectionCard>
              </PermissionGuard>
            </div>
          ) : null}
        </Modal>
      </PageShell>
    </PermissionGuard>
  );
}
