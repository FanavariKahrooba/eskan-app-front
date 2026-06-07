"use client";

import * as React from "react";
import EmptyState from "@/features/power-shell-pro/components/enterprise/empty-state";
import PageToolbar from "@/features/power-shell-pro/components/enterprise/page-toolbar";
import PermissionGuard from "@/features/power-shell-pro/components/enterprise/permission-guard";
import { useAuditLog } from "@/features/power-shell-pro/hooks/use-audit-log";
import { usePagePreferences } from "@/features/power-shell-pro/hooks/use-page-preferences";
import PageShell from "@/features/power-shell/components/breadcrumb-tools/page-shell";
import {
  Briefcase,
  Plus,
  RefreshCcw,
  Settings,
  Trash2,
  UserCog,
  Users,
  Pencil,
} from "lucide-react";
import { neighborhoodHallApi } from "../api/neighborhood-hall-api";
import type {
  ApiPaginationMeta,
  EmploymentType,
  NeighborhoodHallEmployee,
  NeighborhoodHallEmployeePayload,
  NeighborhoodHallPosition,
} from "../types/neighborhood-hall-types";
import {
  formatEmploymentType,
  toPersianDigits,
} from "../utils/neighborhood-hall-formatters";
import { SectionCard, StatCard } from "@/features/shelter/components/shelter-shared";
// import { SectionCard, StatCard } from "../components/neighborhood-hall-shared";

const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر سامانه",
  permissions: [
    "dashboard.view",
    "neighborhood_hall.view",
    "neighborhood_hall.employees.view",
    "neighborhood_hall.employees.manage",
    "settings.view",
  ],
};

type Props = {
  neighborhoodHallId: number;
  kind?: "employees" | "servants";
};

type EmployeeFormState = {
  id?: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  nh_position_id: string;
  employment_type: EmploymentType;
};

const defaultForm: EmployeeFormState = {
  first_name: "",
  last_name: "",
  phone_number: "",
  email: "",
  nh_position_id: "",
  employment_type: "full_time",
};

const emptyMeta: ApiPaginationMeta = {
  current_page: 1,
  from: 0,
  last_page: 1,
  per_page: 10,
  to: 0,
  total: 0,
};

export default function NeighborhoodHallEmployeesPage({
  neighborhoodHallId,
  kind = "employees",
}: Props) {
  const PAGE_KEY = `neighborhood-hall-${kind}-${neighborhoodHallId}`;

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
      activeTab: kind,
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

  const [items, setItems] = React.useState<NeighborhoodHallEmployee[]>([]);
  const [positions, setPositions] = React.useState<NeighborhoodHallPosition[]>(
    [],
  );
  const [meta, setMeta] = React.useState<ApiPaginationMeta>(emptyMeta);

  const [page, setPage] = React.useState(1);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [positionsLoading, setPositionsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<EmployeeFormState>(defaultForm);

  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const pageTitle = kind === "servants" ? "نیروهای خدماتی سرا" : "کارکنان سرا";

  const requiredPositions = React.useMemo(() => {
    return kind === "servants" ? [5] : [1, 2, 3, 4];
  }, [kind]);

  const filteredPositions = React.useMemo(() => {
    return positions.filter((item) =>
      requiredPositions.includes(Number(item.id)),
    );
  }, [positions, requiredPositions]);

  const loadPositions = React.useCallback(async () => {
    try {
      setPositionsLoading(true);
      const response = await neighborhoodHallApi.employees.positions();
      setPositions(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت سمت‌ها");
    } finally {
      setPositionsLoading(false);
    }
  }, []);

  const loadEmployees = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response =
        kind === "servants"
          ? await neighborhoodHallApi.employees.servants({
              q: search,
              page,
            })
          : await neighborhoodHallApi.employees.list({
              q: search,
              page,
            });

      setItems(response.data || []);
      setMeta(response.meta || emptyMeta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
    } finally {
      setApiLoading(false);
    }
  }, [kind, page, search]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPositions();
  }, [loadPositions]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees();
  }, [loadEmployees]);

  const openCreateModal = React.useCallback(() => {
    setForm({
      ...defaultForm,
      nh_position_id:
        filteredPositions.length > 0 ? String(filteredPositions[0].id) : "",
    });
    setModalOpen(true);
  }, [filteredPositions]);

  const openEditModal = React.useCallback(
    (employee: NeighborhoodHallEmployee) => {
      setForm({
        id: employee.id,
        first_name:
          employee.user?.first_name ||
          extractFirstName(employee.user?.name || ""),
        last_name:
          employee.user?.last_name ||
          extractLastName(employee.user?.name || ""),
        phone_number: employee.user?.phone_number || "",
        email: employee.user?.email || "",
        nh_position_id: String(
          employee.position?.id || employee.nh_position_id || "",
        ),
        employment_type:
          employee.employment_type === "part_time" ? "part_time" : "full_time",
      });
      setModalOpen(true);
    },
    [],
  );

  const handleSubmit = React.useCallback(async () => {
    if (!form.first_name.trim()) {
      setError("نام الزامی است.");
      return;
    }
    if (!form.last_name.trim()) {
      setError("نام خانوادگی الزامی است.");
      return;
    }
    if (!form.phone_number.trim()) {
      setError("شماره موبایل الزامی است.");
      return;
    }
    if (!form.nh_position_id) {
      setError("انتخاب سمت الزامی است.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload: NeighborhoodHallEmployeePayload = {
        id: form.id,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone_number: form.phone_number.trim(),
        email: form.email.trim() || "",
        nh_position_id: Number(form.nh_position_id),
        neighborhood_hall_id: neighborhoodHallId,
        employment_type: form.employment_type,
      };

      if (form.id) {
        await neighborhoodHallApi.employees.update(payload);
        audit.track({
          type: "neighborhood_hall.employee.updated",
          message: `Employee updated: ${form.id}`,
          // entityId: String(form.id),
        });
      } else {
        await neighborhoodHallApi.employees.create(payload);
        audit.track({
          type: "neighborhood_hall.employee.created",
          message: `Employee created for hall: ${neighborhoodHallId}`,
          // entityId: String(neighborhoodHallId),
        });
      }

      setModalOpen(false);
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره اطلاعات");
    } finally {
      setSubmitting(false);
    }
  }, [audit, form, loadEmployees, neighborhoodHallId]);

  const handleDelete = React.useCallback(
    async (item: NeighborhoodHallEmployee) => {
      const confirmed = window.confirm("آیا از حذف این رکورد مطمئن هستید؟");
      if (!confirmed) return;

      try {
        await neighborhoodHallApi.employees.destroy(item.id);
        audit.track({
          type: "neighborhood_hall.employee.deleted",
          message: `Employee deleted: ${item.id}`,
          // entityId: String(item.id),
        });
        await loadEmployees();
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در حذف رکورد");
      }
    },
    [audit, loadEmployees],
  );

  const rowPadding =
    density === "compact"
      ? "px-4 py-2"
      : density == "comfortable"
        ? "px-4 py-5"
        : "px-4 py-3";

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="neighborhood_hall.employees.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده این بخش را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title={pageTitle}
        description="مدیریت اطلاعات کارکنان و نیروهای خدماتی وابسته به سرای محله."
        favoriteKey={PAGE_KEY}
        currentPath={`${APP_BASE_PATH}/neighborhood-halls/${neighborhoodHallId}/${kind}`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading || positionsLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "سراهای محله", href: `${APP_BASE_PATH}/neighborhood-halls` },
          {
            label: "فهرست سراها",
            href: `${APP_BASE_PATH}/neighborhood-halls/list`,
          },
          {
            label: pageTitle,
            href: `${APP_BASE_PATH}/neighborhood-halls/${neighborhoodHallId}/${kind}`,
          },
        ]}
        actions={[
          {
            id: "refresh",
            label: "بروزرسانی",
            icon: <RefreshCcw size={16} />,
            variant: "secondary",
            onClick: () => {
              loadEmployees();
            },
          },
          {
            id: "create",
            label:
              kind === "servants" ? "افزودن نیروی خدماتی" : "افزودن کارمند",
            icon: <Plus size={16} />,
            variant: "primary",
            onClick: openCreateModal,
            permission: "neighborhood_hall.employees.manage",
          },
        ]}
        commandActions={[
          {
            id: "employee-create",
            title:
              kind === "servants" ? "افزودن نیروی خدماتی" : "افزودن کارمند سرا",
            subtitle: "ثبت رکورد جدید",
            group: "سراهای محله",
            onSelect: async () => {
              openCreateModal();
            },
          },
          {
            id: "employee-reset-preferences",
            title: "بازنشانی تنظیمات صفحه کارکنان",
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
              شناسه سرا: {toPersianDigits(neighborhoodHallId)}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              تعداد رکورد: {toPersianDigits(meta.total || items.length)}
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
              setPage(1);
              setSearch(value);
            }}
            density={density}
            onDensityChange={setDensity}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onResetPreferences={resetPreferences}
            saving={saving}
          />

          {error ? <EmptyState title="خطا" description={error} /> : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title={kind === "servants" ? "نیروهای خدماتی" : "کارکنان"}
              value={toPersianDigits(meta.total || items.length)}
              description="تعداد رکوردهای ثبت‌شده"
              icon={<Users size={20} />}
              tone="blue"
            />
            <StatCard
              title="صفحه فعلی"
              value={toPersianDigits(meta.current_page || 1)}
              description="صفحه فعال در فهرست"
              icon={<Briefcase size={20} />}
              tone="emerald"
            />
            <StatCard
              title="سمت‌های قابل انتخاب"
              value={toPersianDigits(filteredPositions.length)}
              description="براساس نوع صفحه"
              icon={<UserCog size={20} />}
              tone="violet"
            />
          </section>

          <SectionCard
            title={pageTitle}
            description="لیست رکوردهای ثبت‌شده برای این سرا"
          >
            {items.length === 0 && !apiLoading ? (
              <EmptyState
                title="رکوردی یافت نشد"
                description="در حال حاضر اطلاعاتی برای نمایش وجود ندارد."
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse bg-white text-right text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-gray-600">
                        <th className="px-4 py-3 font-medium">شناسه</th>
                        <th className="px-4 py-3 font-medium">
                          نام و نام خانوادگی
                        </th>
                        <th className="px-4 py-3 font-medium">موبایل</th>
                        <th className="px-4 py-3 font-medium">ایمیل</th>
                        <th className="px-4 py-3 font-medium">سمت</th>
                        <th className="px-4 py-3 font-medium">نوع همکاری</th>
                        <th className="px-4 py-3 font-medium">عملیات</th>
                      </tr>
                    </thead>

                    <tbody>
                      {apiLoading ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-10 text-center text-gray-500"
                          >
                            در حال دریافت اطلاعات...
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-gray-100 text-gray-700"
                          >
                            <td className={rowPadding}>
                              {toPersianDigits(item.id)}
                            </td>
                            <td
                              className={`${rowPadding} font-bold text-gray-900`}
                            >
                              {getEmployeeFullName(item) || "-"}
                            </td>
                            <td className={rowPadding}>
                              {item.user?.phone_number || "-"}
                            </td>
                            <td className={rowPadding}>
                              {item.user?.email || "-"}
                            </td>
                            <td className={rowPadding}>
                              {item.position?.title || "-"}
                            </td>
                            <td className={rowPadding}>
                              {formatEmploymentType(item.employment_type)}
                            </td>
                            <td className={rowPadding}>
                              <div className="flex items-center gap-2">
                                <PermissionGuard
                                  permissions={currentUser.permissions}
                                  required="neighborhood_hall.employees.manage"
                                >
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(item)}
                                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                                  >
                                    <Pencil size={14} />
                                    ویرایش
                                  </button>
                                </PermissionGuard>

                                <PermissionGuard
                                  permissions={currentUser.permissions}
                                  required="neighborhood_hall.employees.manage"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(item)}
                                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                                  >
                                    <Trash2 size={14} />
                                    حذف
                                  </button>
                                </PermissionGuard>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-gray-500">
                نمایش{" "}
                <span className="font-medium text-gray-800">
                  {toPersianDigits(meta.from || 0)}
                </span>{" "}
                تا{" "}
                <span className="font-medium text-gray-800">
                  {toPersianDigits(meta.to || 0)}
                </span>{" "}
                از{" "}
                <span className="font-medium text-gray-800">
                  {toPersianDigits(meta.total || 0)}
                </span>{" "}
                رکورد
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || apiLoading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  قبلی
                </button>

                <span className="text-sm text-gray-500">
                  صفحه {toPersianDigits(page)} از{" "}
                  {toPersianDigits(meta.last_page || 1)}
                </span>

                <button
                  type="button"
                  disabled={page >= (meta.last_page || 1) || apiLoading}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, meta.last_page || 1))
                  }
                  className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {modalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {form.id
                      ? "ویرایش اطلاعات"
                      : kind === "servants"
                        ? "افزودن نیروی خدماتی"
                        : "افزودن کارمند"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    اطلاعات فرد را تکمیل کنید.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg px-2 py-1 text-gray-500 transition hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <MiniField
                  label="نام"
                  value={form.first_name}
                  required
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, first_name: value }))
                  }
                />

                <MiniField
                  label="نام خانوادگی"
                  value={form.last_name}
                  required
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, last_name: value }))
                  }
                />

                <MiniField
                  label="شماره موبایل"
                  value={form.phone_number}
                  required
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, phone_number: value }))
                  }
                />

                <MiniField
                  label="ایمیل"
                  value={form.email}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, email: value }))
                  }
                />

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    سمت <span className="text-red-500">*</span>
                  </span>
                  <select
                    value={form.nh_position_id}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        nh_position_id: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-400"
                  >
                    <option value="">انتخاب کنید</option>
                    {filteredPositions.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    نوع همکاری
                  </span>
                  <select
                    value={form.employment_type}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        employment_type: event.target.value as EmploymentType,
                      }))
                    }
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-400"
                  >
                    <option value="full_time">تمام‌وقت</option>
                    <option value="part_time">پاره‌وقت</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  انصراف
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="h-11 rounded-xl bg-gray-900 px-5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                >
                  {submitting ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </PageShell>
    </PermissionGuard>
  );
}

function MiniField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-400"
      />
    </label>
  );
}

function getEmployeeFullName(employee: NeighborhoodHallEmployee) {
  const firstName = employee.user?.first_name || "";
  const lastName = employee.user?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || employee.user?.name || "";
}

function extractFirstName(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  return parts[0] ?? "";
}

function extractLastName(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  return parts.slice(1).join(" ");
}
