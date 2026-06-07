"use client";

import * as React from "react";
import EmptyState from "@/features/power-shell-pro/components/enterprise/empty-state";
import PageToolbar from "@/features/power-shell-pro/components/enterprise/page-toolbar";
import PermissionGuard from "@/features/power-shell-pro/components/enterprise/permission-guard";
import { useAuditLog } from "@/features/power-shell-pro/hooks/use-audit-log";
import { usePagePreferences } from "@/features/power-shell-pro/hooks/use-page-preferences";
import PageShell from "@/features/power-shell/components/breadcrumb-tools/page-shell";
import { Building2, RefreshCcw, Save, Settings, Upload } from "lucide-react";
import { neighborhoodHallApi } from "../api/neighborhood-hall-api";
import type {
  NeighborhoodHallDetail,
  NeighborhoodHallDistrictOption,
  NeighborhoodHallFormPayload,
  NeighborhoodHallRegionOption,
  NeighborhoodHallUserOption,
} from "../types/neighborhood-hall-types";

const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر سامانه",
  permissions: [
    "dashboard.view",
    "neighborhood_hall.create",
    "neighborhood_hall.update",
    "settings.view",
  ],
};

type Props = {
  mode: "create" | "edit";
  id?: number;
};

type FormState = {
  id?: number;
  create_hall_name: string;
  create_hall_name_en: string;
  create_hall_description: string;
  create_hall_short_description: string;
  create_hall_popup_desc: string;
  create_hall_coordinates: string;
  create_hall_site_address: string;
  create_hall_address: string;
  create_hall_phone: string;
  create_hall_meta_title: string;
  create_hall_meta_description: string;
  create_hall_meta_keywords: string;
  create_hall_region: string;
  create_hall_district: string;
  create_hall_user_manager: string;
  create_hall_staff_count: string;
  create_hall_insurance: string;
  create_hall_has_workshop: string;
  create_hall_area_land: string;
  create_hall_area_building: string;
  create_hall_has_study_hall: string;
  create_hall_has_theater: string;
  create_hall_theater_capacity: string;
  create_hall_has_gym: string;
  create_hall_has_preschool: string;
  create_hall_contact_number: string;
  create_hall_cover_image: File | null;
};

const defaultForm: FormState = {
  create_hall_name: "",
  create_hall_name_en: "",
  create_hall_description: "",
  create_hall_short_description: "",
  create_hall_popup_desc: "",
  create_hall_coordinates: "",
  create_hall_site_address: "",
  create_hall_address: "",
  create_hall_phone: "",
  create_hall_meta_title: "",
  create_hall_meta_description: "",
  create_hall_meta_keywords: "",
  create_hall_region: "",
  create_hall_district: "",
  create_hall_user_manager: "0",
  create_hall_staff_count: "0",
  create_hall_insurance: "0",
  create_hall_has_workshop: "0",
  create_hall_area_land: "0",
  create_hall_area_building: "0",
  create_hall_has_study_hall: "0",
  create_hall_has_theater: "0",
  create_hall_theater_capacity: "0",
  create_hall_has_gym: "0",
  create_hall_has_preschool: "0",
  create_hall_contact_number: "",
  create_hall_cover_image: null,
};

export default function NeighborhoodHallFormPage({ mode, id }: Props) {
  const PAGE_KEY =
    mode === "create"
      ? "neighborhood-hall-create"
      : `neighborhood-hall-edit-${id}`;

  const requiredPermission =
    mode === "create" ? "neighborhood_hall.create" : "neighborhood_hall.update";

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
      activeTab: mode,
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

  const [form, setForm] = React.useState<FormState>(defaultForm);
  const [users, setUsers] = React.useState<NeighborhoodHallUserOption[]>([]);
  const [districts, setDistricts] = React.useState<
    NeighborhoodHallDistrictOption[]
  >([]);
  const [regions, setRegions] = React.useState<NeighborhoodHallRegionOption[]>(
    [],
  );

  const [apiLoading, setApiLoading] = React.useState(mode === "edit");
  const [optionsLoading, setOptionsLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadOptions = React.useCallback(async () => {
    try {
      setOptionsLoading(true);

      const [usersResponse, districtsResponse, regionsResponse] =
        await Promise.all([
          neighborhoodHallApi.users(),
          neighborhoodHallApi.districts(),
          neighborhoodHallApi.regions(),
        ]);

      setUsers(usersResponse || []);
      setDistricts(districtsResponse || []);
      setRegions(regionsResponse || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت گزینه‌ها");
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  const loadDetail = React.useCallback(async () => {
    if (mode !== "edit" || !id) return;

    try {
      setApiLoading(true);
      setError(null);

      const response = await neighborhoodHallApi.show(id);
      const data = response.data as NeighborhoodHallDetail | undefined;

      if (!data) return;

      setForm({
        id: data.id,
        create_hall_name: data.name || "",
        create_hall_name_en: data.name_en || "",
        create_hall_description: data.description || "",
        create_hall_short_description: data.short_description || "",
        create_hall_popup_desc: data.popup_desc || "",
        create_hall_coordinates:
          data.lat && data.lng ? JSON.stringify([data.lat, data.lng]) : "",
        create_hall_site_address: data.site_address || "",
        create_hall_address: data.address || "",
        create_hall_phone: data.phone || "",
        create_hall_meta_title: data.meta_title || "",
        create_hall_meta_description: data.meta_description || "",
        create_hall_meta_keywords: data.meta_keywords || "",
        create_hall_region: data.region?.id ? String(data.region.id) : "",
        create_hall_district: data.district?.id ? String(data.district.id) : "",
        create_hall_user_manager: data.user?.id ? String(data.user.id) : "0",
        create_hall_staff_count: String(data.info?.staff_count ?? 0),
        create_hall_insurance: boolToString(data.info?.insurance),
        create_hall_has_workshop: boolToString(data.info?.has_workshop),
        create_hall_area_land: String(data.info?.area_land ?? 0),
        create_hall_area_building: String(data.info?.area_building ?? 0),
        create_hall_has_study_hall: boolToString(data.info?.has_study_hall),
        create_hall_has_theater: boolToString(data.info?.has_theater),
        create_hall_theater_capacity: String(data.info?.theater_capacity ?? 0),
        create_hall_has_gym: boolToString(data.info?.has_gym),
        create_hall_has_preschool: boolToString(data.info?.has_preschool),
        create_hall_contact_number: data.info?.contact_number || "",
        create_hall_cover_image: null,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در دریافت اطلاعات سرا",
      );
    } finally {
      setApiLoading(false);
    }
  }, [id, mode]);

  React.useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  React.useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleChange = React.useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const handleSubmit = React.useCallback(async () => {
    if (!form.create_hall_name.trim()) {
      setError("نام سرا الزامی است.");
      return;
    }

    if (!form.create_hall_district) {
      setError("انتخاب ناحیه الزامی است.");
      return;
    }

    if (!form.create_hall_region) {
      setError("انتخاب منطقه الزامی است.");
      return;
    }

    if (!form.create_hall_coordinates.trim()) {
      setError("مختصات سرا الزامی است.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload: NeighborhoodHallFormPayload = {
        id: form.id,
        create_hall_name: form.create_hall_name,
        create_hall_name_en: form.create_hall_name_en,
        create_hall_description: form.create_hall_description,
        create_hall_short_description: form.create_hall_short_description,
        create_hall_popup_desc: form.create_hall_popup_desc,
        create_hall_coordinates: form.create_hall_coordinates,
        create_hall_site_address: form.create_hall_site_address,
        create_hall_address: form.create_hall_address,
        create_hall_phone: form.create_hall_phone,
        create_hall_meta_title: form.create_hall_meta_title,
        create_hall_meta_description: form.create_hall_meta_description,
        create_hall_meta_keywords: form.create_hall_meta_keywords,
        create_hall_region: form.create_hall_region,
        create_hall_district: form.create_hall_district,
        create_hall_user_manager: form.create_hall_user_manager,
        create_hall_staff_count: form.create_hall_staff_count,
        create_hall_insurance: form.create_hall_insurance,
        create_hall_has_workshop: form.create_hall_has_workshop,
        create_hall_area_land: form.create_hall_area_land,
        create_hall_area_building: form.create_hall_area_building,
        create_hall_has_study_hall: form.create_hall_has_study_hall,
        create_hall_has_theater: form.create_hall_has_theater,
        create_hall_theater_capacity: form.create_hall_theater_capacity,
        create_hall_has_gym: form.create_hall_has_gym,
        create_hall_has_preschool: form.create_hall_has_preschool,
        create_hall_contact_number: form.create_hall_contact_number,
        create_hall_cover_image: form.create_hall_cover_image,
      };

      if (mode === "create") {
        await neighborhoodHallApi.create(payload);
        audit.track({
          type: "neighborhood_hall.created",
          message: "Neighborhood hall created",
        });
      } else {
        await neighborhoodHallApi.update(payload);
        audit.track({
          type: "neighborhood_hall.updated",
          message: `Neighborhood hall updated: ${id}`,
          entityId: String(id),
        });
      }

      window.location.href =
        mode === "create"
          ? `${APP_BASE_PATH}/neighborhood-halls/list`
          : `${APP_BASE_PATH}/neighborhood-halls/${id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره اطلاعات");
    } finally {
      setSubmitting(false);
    }
  }, [audit, form, id, mode]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required={requiredPermission}
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز این عملیات را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title={mode === "create" ? "افزودن سرای محله" : "ویرایش سرای محله"}
        description="ثبت یا ویرایش اطلاعات اصلی، مکانی و تکمیلی سرای محله."
        favoriteKey={PAGE_KEY}
        currentPath={
          mode === "create"
            ? `${APP_BASE_PATH}/neighborhood-halls/create`
            : `${APP_BASE_PATH}/neighborhood-halls/${id}/edit`
        }
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading || optionsLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "سراهای محله", href: `${APP_BASE_PATH}/neighborhood-halls` },
          {
            label: "فهرست سراها",
            href: `${APP_BASE_PATH}/neighborhood-halls/list`,
          },
          {
            label: mode === "create" ? "افزودن سرا" : "ویرایش سرا",
            href:
              mode === "create"
                ? `${APP_BASE_PATH}/neighborhood-halls/create`
                : `${APP_BASE_PATH}/neighborhood-halls/${id}/edit`,
          },
        ]}
        actions={[
          {
            id: "refresh",
            label: "بارگذاری مجدد",
            icon: <RefreshCcw size={16} />,
            variant: "secondary",
            onClick: () => {
              loadOptions();
              loadDetail();
            },
          },
          {
            id: "save",
            label: submitting ? "در حال ذخیره..." : "ذخیره",
            icon: <Save size={16} />,
            variant: "primary",
            onClick: handleSubmit,
          },
        ]}
        commandActions={[
          {
            id: "hall-form-save",
            title: mode === "create" ? "ثبت سرای محله" : "ذخیره ویرایش سرا",
            subtitle: "ذخیره اطلاعات فرم",
            group: "سراهای محله",
            onSelect: async () => {
              await handleSubmit();
            },
          },
          {
            id: "reset-hall-form-preferences",
            title: "بازنشانی تنظیمات فرم سرا",
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
              حالت: {mode === "create" ? "ایجاد" : "ویرایش"}
            </span>

            {form.create_hall_name ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                عنوان: {form.create_hall_name}
              </span>
            ) : null}

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

          {error ? <EmptyState title="خطا" description={error} /> : null}

          <Section title="اطلاعات اصلی" description="مشخصات پایه سرای محله">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <TextField
                label="نام سرا"
                value={form.create_hall_name}
                required
                onChange={(v) => handleChange("create_hall_name", v)}
              />
              <TextField
                label="نام انگلیسی"
                value={form.create_hall_name_en}
                onChange={(v) => handleChange("create_hall_name_en", v)}
              />
              <TextField
                label="شماره تماس"
                value={form.create_hall_phone}
                onChange={(v) => handleChange("create_hall_phone", v)}
              />
              <TextField
                label="آدرس سایت"
                value={form.create_hall_site_address}
                onChange={(v) => handleChange("create_hall_site_address", v)}
              />
              <TextField
                label="مختصات"
                value={form.create_hall_coordinates}
                required
                placeholder='مثال: {"lat":"35.7","lng":"51.4"} یا [35.7,51.4]'
                onChange={(v) => handleChange("create_hall_coordinates", v)}
              />
              <TextField
                label="شماره تماس تکمیلی"
                value={form.create_hall_contact_number}
                onChange={(v) => handleChange("create_hall_contact_number", v)}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextAreaField
                label="آدرس"
                value={form.create_hall_address}
                onChange={(v) => handleChange("create_hall_address", v)}
              />
              <TextAreaField
                label="توضیح کوتاه"
                value={form.create_hall_short_description}
                onChange={(v) =>
                  handleChange("create_hall_short_description", v)
                }
              />
              <TextAreaField
                label="توضیح اصلی"
                value={form.create_hall_description}
                onChange={(v) => handleChange("create_hall_description", v)}
              />
              <TextAreaField
                label="متن پاپ‌آپ"
                value={form.create_hall_popup_desc}
                onChange={(v) => handleChange("create_hall_popup_desc", v)}
              />
            </div>
          </Section>

          <Section
            title="اتصال‌ها و دسته‌بندی"
            description="ناحیه، منطقه و مدیر سرا"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SelectField
                label="منطقه"
                required
                value={form.create_hall_region}
                onChange={(v) => handleChange("create_hall_region", v)}
                options={regions.map((item) => ({
                  value: String(item.id),
                  label: item.name,
                }))}
              />

              <SelectField
                label="ناحیه"
                required
                value={form.create_hall_district}
                onChange={(v) => handleChange("create_hall_district", v)}
                options={districts.map((item) => ({
                  value: String(item.id),
                  label: item.name,
                }))}
              />

              <SelectField
                label="مدیر سرا"
                value={form.create_hall_user_manager}
                onChange={(v) => handleChange("create_hall_user_manager", v)}
                options={[
                  { value: "0", label: "بدون مدیر" },
                  ...users.map((item) => ({
                    value: String(item.id),
                    label: `${item.name}${item.phone_number ? ` - ${item.phone_number}` : ""}`,
                  })),
                ]}
              />
            </div>
          </Section>

          <Section title="مشخصات تکمیلی" description="ویژگی‌ها و امکانات سرا">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <TextField
                label="تعداد کارکنان"
                value={form.create_hall_staff_count}
                onChange={(v) => handleChange("create_hall_staff_count", v)}
              />
              <TextField
                label="مساحت زمین"
                value={form.create_hall_area_land}
                onChange={(v) => handleChange("create_hall_area_land", v)}
              />
              <TextField
                label="مساحت بنا"
                value={form.create_hall_area_building}
                onChange={(v) => handleChange("create_hall_area_building", v)}
              />
              <TextField
                label="ظرفیت تئاتر"
                value={form.create_hall_theater_capacity}
                onChange={(v) =>
                  handleChange("create_hall_theater_capacity", v)
                }
              />

              <BooleanField
                label="بیمه"
                value={form.create_hall_insurance}
                onChange={(v) => handleChange("create_hall_insurance", v)}
              />
              <BooleanField
                label="دارای کارگاه"
                value={form.create_hall_has_workshop}
                onChange={(v) => handleChange("create_hall_has_workshop", v)}
              />
              <BooleanField
                label="سالن مطالعه"
                value={form.create_hall_has_study_hall}
                onChange={(v) => handleChange("create_hall_has_study_hall", v)}
              />
              <BooleanField
                label="سالن تئاتر"
                value={form.create_hall_has_theater}
                onChange={(v) => handleChange("create_hall_has_theater", v)}
              />
              <BooleanField
                label="سالن ورزشی"
                value={form.create_hall_has_gym}
                onChange={(v) => handleChange("create_hall_has_gym", v)}
              />
              <BooleanField
                label="پیش‌دبستانی"
                value={form.create_hall_has_preschool}
                onChange={(v) => handleChange("create_hall_has_preschool", v)}
              />
            </div>
          </Section>

          <Section
            title="اطلاعات سئو و رسانه"
            description="فیلدهای متا و تصویر شاخص"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="Meta Title"
                value={form.create_hall_meta_title}
                onChange={(v) => handleChange("create_hall_meta_title", v)}
              />
              <TextField
                label="Meta Keywords"
                value={form.create_hall_meta_keywords}
                onChange={(v) => handleChange("create_hall_meta_keywords", v)}
              />
              <TextAreaField
                label="Meta Description"
                value={form.create_hall_meta_description}
                onChange={(v) =>
                  handleChange("create_hall_meta_description", v)
                }
              />
              <FileField
                label="تصویر شاخص"
                onChange={(file) =>
                  handleChange("create_hall_cover_image", file)
                }
              />
            </div>
          </Section>
        </div>
      </PageShell>
    </PermissionGuard>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-400"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <textarea
        value={value}
        rows={5}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-gray-400"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-400"
      >
        <option value="">انتخاب کنید</option>
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function BooleanField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <SelectField
      label={label}
      value={value}
      onChange={onChange}
      options={[
        { value: "0", label: "خیر" },
        { value: "1", label: "بله" },
      ]}
    />
  );
}

function FileField({
  label,
  onChange,
}: {
  label: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-600 transition hover:bg-gray-100">
        <Upload size={18} />
        <span className="mt-2">انتخاب فایل</span>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
      </label>
    </label>
  );
}

function boolToString(value: unknown) {
  return value ? "1" : "0";
}
