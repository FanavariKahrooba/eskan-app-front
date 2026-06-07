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
  Eye,
  Plus,
  RefreshCcw,
  Scale,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { shelterApi } from "../api/shelter-api";
import type {
  CapacityRuleScope,
  CapacityRuleStatus,
  ShelterCapacityRule,
} from "../types/shelter-types";
import {
  Badge,
  InfoItem,
  Modal,
  SectionCard,
  StatCard,
} from "../components/shelter-shared";
import { cn, formatDate, toPersianDigits } from "../utils/shelter-formatters";

const PAGE_KEY = "shelter-capacity-rules";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر اسکان",
  permissions: [
    "dashboard.view",
    "shelter.dashboard.view",
    "shelter.capacity-rules.view",
    "shelter.capacity-rules.manage",
    "settings.view",
  ],
};

function getRuleStatusMeta(status: CapacityRuleStatus) {
  const map = {
    active: {
      label: "فعال",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    inactive: {
      label: "غیرفعال",
      className: "bg-gray-100 text-gray-700 ring-gray-200",
    },
  } satisfies Record<CapacityRuleStatus, { label: string; className: string }>;

  return map[status];
}

function getRuleScopeLabel(scope: CapacityRuleScope) {
  const map = {
    global: "سراسری",
    shelter: "سرا",
    space: "فضا",
    category: "دسته‌بندی",
  } satisfies Record<CapacityRuleScope, string>;

  return map[scope];
}

function getGenderPolicyLabel(policy?: ShelterCapacityRule["gender_policy"]) {
  if (!policy) return "—";

  const map = {
    male: "آقایان",
    female: "بانوان",
    family: "خانواده",
    any: "بدون محدودیت",
  } satisfies Record<NonNullable<ShelterCapacityRule["gender_policy"]>, string>;

  return map[policy];
}

export default function ShelterCapacityRulesPage() {
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
        "scope",
        "min_capacity",
        "max_capacity",
        "reserve_buffer",
        "status",
      ],
    },
  });

  const audit = useAuditLog({
    pageKey: PAGE_KEY,
    userId: currentUser.id,
  });

  const [rows, setRows] = React.useState<ShelterCapacityRule[]>([]);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<ShelterCapacityRule | null>(null);

  const activeTab =
    (preferences.activeTab as CapacityRuleStatus | "all") || "all";
  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadRows = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response = await shelterApi.capacityRules({
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
    const global = rows.filter((item) => item.scope === "global").length;
    const shelterScoped = rows.filter(
      (item) => item.scope === "shelter",
    ).length;

    return {
      total: rows.length,
      active,
      inactive,
      global,
      shelterScoped,
    };
  }, [rows]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="shelter.capacity-rules.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده قواعد ظرفیت و پذیرش را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title="قواعد ظرفیت و پذیرش"
        description="مدیریت محدودیت‌ها، سیاست‌های ظرفیت، رزرو و قواعد پذیرش برای سراها و فضاهای اسکان."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/shelters/capacity-rules`}
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
            label: "قواعد ظرفیت و پذیرش",
            href: `${APP_BASE_PATH}/shelters/capacity-rules`,
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
                type: "shelter.capacity_rules.refreshed",
                message: "Shelter capacity rules refreshed",
              });
              loadRows();
            },
          },
          {
            id: "create-capacity-rule",
            label: "افزودن قاعده",
            icon: <Plus size={16} />,
            variant: "primary",
            href: `${APP_BASE_PATH}/shelters/capacity-rules/new`,
            permission: "shelter.capacity-rules.manage",
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
            id: "shelter-spaces",
            title: "فضاهای اسکان",
            subtitle: "ظرفیت اتاق‌ها و سالن‌ها",
            group: "اسکان",
            href: `${APP_BASE_PATH}/shelter/spaces`,
            keywords: ["spaces", "capacity", "ظرفیت"],
          },
          {
            id: "reset-shelter-capacity-rules-preferences",
            title: "بازنشانی تنظیمات قواعد ظرفیت",
            subtitle: "حذف تنظیمات ذخیره‌شده این صفحه",
            group: "تنظیمات",
            onSelect: resetPreferences,
          },
        ]}
        headerMeta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {toPersianDigits(stats.total)} قاعده
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {toPersianDigits(stats.active)} فعال
            </span>

            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
              {toPersianDigits(stats.global)} سراسری
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
                type: "shelter.capacity_rules.filtered",
                message: "Shelter capacity rules search changed",
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
                  type: "shelter.capacity_rules.filtered",
                  message: "Shelter capacity rules status tab changed",
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
              title="کل قواعد"
              value={toPersianDigits(stats.total)}
              description="قواعد تعریف‌شده برای ظرفیت"
              icon={<Scale size={20} />}
              tone="blue"
            />

            <StatCard
              title="قواعد فعال"
              value={toPersianDigits(stats.active)}
              description="در چرخه پذیرش اعمال می‌شوند"
              icon={<CheckCircle2 size={20} />}
              tone="emerald"
            />

            <StatCard
              title="قواعد سراسری"
              value={toPersianDigits(stats.global)}
              description="اعمال روی کل سامانه"
              icon={<ShieldCheck size={20} />}
              tone="violet"
            />

            <StatCard
              title="قواعد سطح سرا"
              value={toPersianDigits(stats.shelterScoped)}
              description="مختص سراهای مشخص"
              icon={<BedDouble size={20} />}
              tone="amber"
            />
          </section>

          <SectionCard
            title="فهرست قواعد ظرفیت"
            description="نمایش قواعد پذیرش، محدوده اعمال، ظرفیت مجاز و سیاست رزرو."
            action={
              <PermissionGuard
                permissions={currentUser.permissions}
                required="shelter.capacity-rules.manage"
              >
                <a
                  href={`${APP_BASE_PATH}/shelters/capacity-rules/new`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Plus size={16} />
                  افزودن قاعده
                </a>
              </PermissionGuard>
            }
          >
            {rows.length === 0 ? (
              <EmptyState
                title="قاعده‌ای یافت نشد"
                description="با تغییر فیلترها یا ثبت قاعده جدید دوباره بررسی کنید."
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
                        <th className="px-4 py-3">محدوده</th>
                        <th className="px-4 py-3">حداقل ظرفیت</th>
                        <th className="px-4 py-3">حداکثر ظرفیت</th>
                        <th className="px-4 py-3">بافر رزرو</th>
                        <th className="px-4 py-3">سیاست پذیرش</th>
                        <th className="px-4 py-3">وضعیت</th>
                        <th className="px-4 py-3">عملیات</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {rows.map((item) => {
                        const status = getRuleStatusMeta(item.status);

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
                              {getRuleScopeLabel(item.scope)}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {item.min_capacity == null
                                ? "—"
                                : toPersianDigits(item.min_capacity)}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {item.max_capacity == null
                                ? "—"
                                : toPersianDigits(item.max_capacity)}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {item.reserve_buffer == null
                                ? "—"
                                : toPersianDigits(item.reserve_buffer)}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {getGenderPolicyLabel(item.gender_policy)}
                            </td>

                            <td className="px-4 py-4">
                              <Badge
                                label={status.label}
                                className={status.className}
                              />
                            </td>

                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRecord(item);
                                  audit.track({
                                    type: "shelter.capacity_rule.viewed",
                                    message: "Shelter capacity rule opened",
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
          title={selectedRecord?.title || "جزئیات قاعده ظرفیت"}
          description="جزئیات محدودیت‌ها و سیاست‌های ظرفیت و پذیرش."
        >
          {selectedRecord ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoItem label="شناسه" value={String(selectedRecord.id)} />
                <InfoItem label="عنوان" value={selectedRecord.title} />
                <InfoItem label="کد" value={selectedRecord.code || "—"} />
                <InfoItem
                  label="محدوده اعمال"
                  value={getRuleScopeLabel(selectedRecord.scope)}
                />
                <InfoItem
                  label="حداقل ظرفیت"
                  value={
                    selectedRecord.min_capacity == null
                      ? "—"
                      : toPersianDigits(selectedRecord.min_capacity)
                  }
                />
                <InfoItem
                  label="حداکثر ظرفیت"
                  value={
                    selectedRecord.max_capacity == null
                      ? "—"
                      : toPersianDigits(selectedRecord.max_capacity)
                  }
                />
                <InfoItem
                  label="بافر رزرو"
                  value={
                    selectedRecord.reserve_buffer == null
                      ? "—"
                      : toPersianDigits(selectedRecord.reserve_buffer)
                  }
                />
                <InfoItem
                  label="سیاست پذیرش"
                  value={getGenderPolicyLabel(selectedRecord.gender_policy)}
                />
                <InfoItem
                  label="وضعیت"
                  value={getRuleStatusMeta(selectedRecord.status).label}
                />
                <InfoItem
                  label="تاریخ ثبت"
                  value={formatDate(selectedRecord.created_at)}
                />
              </div>

              <SectionCard title="توضیحات" description="شرح منطق اعمال قاعده.">
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
