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
  Clock3,
  Eye,
  RefreshCcw,
  Settings,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";
import { shelterApi } from "../api/shelter-api";
import type {
  ShelterRequest,
  ShelterRequestStatus,
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
  getRequestStatusMeta,
  toPersianDigits,
} from "../utils/shelter-formatters";

const PAGE_KEY = "shelter-requests";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر اسکان",
  permissions: [
    "shelter.requests.view",
    "shelter.requests.review",
    "shelter.reservations.manage",
    "settings.view",
  ],
};

export default function ShelterRequestsPage() {
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
        "capacity",
        "date",
        "status",
        "created_at",
      ],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const [rows, setRows] = React.useState<ShelterRequest[]>([]);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<ShelterRequest | null>(null);
  const [reviewNote, setReviewNote] = React.useState("");
  const [reviewLoading, setReviewLoading] = React.useState(false);

  const activeTab =
    (preferences.activeTab as ShelterRequestStatus | "all") || "all";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadRows = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response = await shelterApi.requests({
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

  const reviewRequest = async (status: "approved" | "rejected") => {
    if (!selectedRecord) return;

    try {
      setReviewLoading(true);

      await shelterApi.reviewRequest(selectedRecord.id, {
        status,
        admin_note: reviewNote,
      });

      audit.track({
        type: "shelter.request.reviewed",
        message: "Shelter request reviewed",
        metadata: { id: selectedRecord.id, status },
      });

      setSelectedRecord(null);
      setReviewNote("");
      await loadRows();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در بررسی درخواست");
    } finally {
      setReviewLoading(false);
    }
  };

  const stats = React.useMemo(() => {
    return {
      total: rows.length,
      pending: rows.filter((item) => item.status === "pending").length,
      approved: rows.filter((item) => item.status === "approved").length,
      rejected: rows.filter((item) => item.status === "rejected").length,
      reserved: rows.filter((item) => item.status === "reserved").length,
    };
  }, [rows]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="shelter.requests.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده درخواست‌های اسکان را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="درخواست‌های اسکان"
        description="بررسی، تأیید یا رد درخواست‌های ثبت‌شده توسط کاربران."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/shelter/requests`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "اسکان", href: `${APP_BASE_PATH}/shelter` },
          { label: "درخواست‌ها", href: `${APP_BASE_PATH}/shelter/requests` },
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
            subtitle: "نمای ظرفیت و رزروها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter`,
            keywords: ["dashboard", "داشبورد"],
          },
          {
            id: "shelter-reservations",
            title: "رزروهای اسکان",
            subtitle: "مدیریت پذیرش و خروج",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/reservations`,
            keywords: ["reservations", "رزرو"],
          },
          {
            id: "reset-shelter-requests-preferences",
            title: "بازنشانی تنظیمات درخواست‌ها",
            subtitle: "حذف تنظیمات ذخیره‌شده این صفحه",
            group: "تنظیمات",
            onSelect: resetPreferences,
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              در انتظار: {toPersianDigits(stats.pending)}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              تأیید شده: {toPersianDigits(stats.approved)}
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
                { id: "pending", label: "در انتظار", badge: stats.pending },
                { id: "approved", label: "تأیید", badge: stats.approved },
                { id: "rejected", label: "رد شده", badge: stats.rejected },
                { id: "reserved", label: "رزرو شده", badge: stats.reserved },
              ]}
            />
          </div>

          {error ? (
            <EmptyState title="خطا در دریافت اطلاعات" description={error} />
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="کل درخواست‌ها"
              value={toPersianDigits(stats.total)}
              description="درخواست‌های دریافت‌شده"
              icon={<UserCheck size={20} />}
              tone="blue"
            />
            <StatCard
              title="در انتظار بررسی"
              value={toPersianDigits(stats.pending)}
              description="نیازمند اقدام مدیر"
              icon={<Clock3 size={20} />}
              tone="amber"
            />
            <StatCard
              title="تأیید شده"
              value={toPersianDigits(stats.approved)}
              description="قابل تبدیل به رزرو"
              icon={<CheckCircle2 size={20} />}
              tone="emerald"
            />
            <StatCard
              title="رد شده"
              value={toPersianDigits(stats.rejected)}
              description="درخواست‌های نامعتبر یا فاقد شرایط"
              icon={<XCircle size={20} />}
              tone="rose"
            />
          </section>

          <SectionCard
            title="فهرست درخواست‌های اسکان"
            description="درخواست‌ها را بررسی و در صورت نیاز تأیید یا رد کنید."
          >
            {rows.length === 0 ? (
              <EmptyState
                title="درخواستی یافت نشد"
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
                        <th className="px-4 py-3">ظرفیت درخواستی</th>
                        <th className="px-4 py-3">بازه زمانی</th>
                        <th className="px-4 py-3">وضعیت</th>
                        <th className="px-4 py-3">ثبت</th>
                        <th className="px-4 py-3">عملیات</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {rows.map((item) => {
                        const status = getRequestStatusMeta(item.status);

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
                              {toPersianDigits(item.requested_capacity || 0)}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {formatDate(item.from_date)} تا{" "}
                              {formatDate(item.to_date)}
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
                                onClick={() => setSelectedRecord(item)}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                              >
                                <Eye size={16} />
                                بررسی
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
          onClose={() => {
            setSelectedRecord(null);
            setReviewNote("");
          }}
          title="بررسی درخواست اسکان"
          description="جزئیات درخواست و عملیات تأیید یا رد."
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
                  label="ظرفیت درخواستی"
                  value={toPersianDigits(
                    selectedRecord.requested_capacity || 0,
                  )}
                />
                <InfoItem
                  label="از تاریخ"
                  value={formatDate(selectedRecord.from_date)}
                />
                <InfoItem
                  label="تا تاریخ"
                  value={formatDate(selectedRecord.to_date)}
                />
                <InfoItem
                  label="وضعیت"
                  value={getRequestStatusMeta(selectedRecord.status).label}
                />
              </div>

              <SectionCard title="علت درخواست" description="شرح ثبت‌شده کاربر.">
                <p className="text-sm leading-7 text-gray-700">
                  {selectedRecord.reason || "—"}
                </p>
              </SectionCard>

              <PermissionGuard
                permissions={currentUser.permissions}
                required="shelter.requests.review"
              >
                {selectedRecord.status === "pending" ? (
                  <SectionCard
                    title="تصمیم مدیر"
                    description="نتیجه بررسی درخواست را ثبت کنید."
                  >
                    <div className="space-y-4">
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                          توضیح مدیر
                        </span>
                        <textarea
                          value={reviewNote}
                          onChange={(event) =>
                            setReviewNote(event.target.value)
                          }
                          rows={4}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                          placeholder="توضیح اختیاری برای تأیید یا رد درخواست..."
                        />
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={reviewLoading}
                          onClick={() => reviewRequest("approved")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <ShieldCheck size={16} />
                          تأیید درخواست
                        </button>

                        <button
                          type="button"
                          disabled={reviewLoading}
                          onClick={() => reviewRequest("rejected")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
                        >
                          <XCircle size={16} />
                          رد درخواست
                        </button>
                      </div>
                    </div>
                  </SectionCard>
                ) : null}
              </PermissionGuard>
            </div>
          ) : null}
        </Modal>
      </PageShell>
    </PermissionGuard>
  );
}
