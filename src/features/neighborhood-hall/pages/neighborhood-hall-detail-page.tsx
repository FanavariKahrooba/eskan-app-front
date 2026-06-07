"use client";

import * as React from "react";
import EmptyState from "@/features/power-shell-pro/components/enterprise/empty-state";
import PageToolbar from "@/features/power-shell-pro/components/enterprise/page-toolbar";
import PermissionGuard from "@/features/power-shell-pro/components/enterprise/permission-guard";
import { useAuditLog } from "@/features/power-shell-pro/hooks/use-audit-log";
import { usePagePreferences } from "@/features/power-shell-pro/hooks/use-page-preferences";
import PageShell from "@/features/power-shell/components/breadcrumb-tools/page-shell";
import {
  Building2,
  FileText,
  MapPin,
  Phone,
  RefreshCcw,
  Settings,
  SquarePen,
  Users,
  Globe,
  ShieldCheck,
  Landmark,
  Theater,
  Dumbbell,
  BookOpen,
  Baby,
} from "lucide-react";
import { neighborhoodHallApi } from "../api/neighborhood-hall-api";
import type { NeighborhoodHallDetail } from "../types/neighborhood-hall-types";
import {
  formatDate,
  toPersianDigits,
  yesNo,
} from "../utils/neighborhood-hall-formatters";
import {
  SectionCard,
  StatCard,
} from "@/features/shelter/components/shelter-shared";

const PAGE_KEY = "neighborhood-hall-detail";
const APP_BASE_PATH = "/console";

const currentUser = {
  id: "user_1",
  name: "مدیر سامانه",
  permissions: [
    "dashboard.view",
    "neighborhood_hall.view",
    "neighborhood_hall.update",
    "neighborhood_hall.employees.view",
    "settings.view",
  ],
};

const emptyDetail: NeighborhoodHallDetail = {
  id: 0,
  name: "",
  name_en: "",
  slug: "",
  slug_en: "",
  description: "",
  short_description: "",
  popup_desc: "",
  lat: "",
  lng: "",
  site_address: "",
  address: "",
  phone: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  created_at: "",
  updated_at: "",
  district: null,
  // region: null,
  user: null,
  info: null,
  image: "",
};

type Props = {
  id: number;
};

export default function NeighborhoodHallDetailPage({ id }: Props) {
  const {
    preferences,
    loading,
    saving,
    setSearch,
    setDensity,
    setPageSize,
    resetPreferences,
  } = usePagePreferences({
    pageKey: `${PAGE_KEY}-${id}`,
    userId: currentUser.id,
    defaultValue: {
      activeTab: "overview",
      search: "",
      density: "comfortable",
      pageSize: 10,
      visibleColumns: [],
    },
  });

  const audit = useAuditLog({
    pageKey: `${PAGE_KEY}-${id}`,
    userId: currentUser.id,
  });

  const [detail, setDetail] =
    React.useState<NeighborhoodHallDetail>(emptyDetail);
  const [apiLoading, setApiLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const search = preferences.search || "";
  const density = preferences.density || "comfortable";
  const pageSize = preferences.pageSize || 10;

  const loadDetail = React.useCallback(async () => {
    try {
      setApiLoading(true);
      setError(null);

      const response = await neighborhoodHallApi.show(id);
      setDetail(response.data || emptyDetail);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در دریافت اطلاعات سرا",
      );
    } finally {
      setApiLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDetail();
  }, [loadDetail]);

  return (
    <PermissionGuard
      permissions={currentUser.permissions}
      required="neighborhood_hall.view"
      fallback={
        <div className="p-6">
          <EmptyState
            title="عدم دسترسی"
            description="شما مجوز مشاهده اطلاعات سرای محله را ندارید."
          />
        </div>
      }
    >
      <PageShell
        title={detail.name || "جزئیات سرای محله"}
        description="نمای کامل اطلاعات ثبت‌شده برای سرای محله، مدیر، موقعیت و مشخصات تکمیلی."
        favoriteKey={`${PAGE_KEY}-${id}`}
        currentPath={`${APP_BASE_PATH}/neighborhood-halls/${id}`}
        maxWidth="full"
        stickyHeader
        enablePalette
        loading={loading || apiLoading}
        userPermissions={currentUser.permissions}
        breadcrumbs={[
          { label: "کنسول", href: "/" },
          { label: "سراهای محله", href: `${APP_BASE_PATH}/neighborhood-halls` },
          {
            label: "فهرست سراها",
            href: `${APP_BASE_PATH}/neighborhood-halls/list`,
          },
          {
            label: detail.name || `سرا ${id}`,
            href: `${APP_BASE_PATH}/neighborhood-halls/${id}`,
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
                type: "neighborhood_hall.detail.refreshed",
                message: `Neighborhood hall detail refreshed: ${id}`,
                // entityId: String(id),
              });
              loadDetail();
            },
          },
          {
            id: "edit",
            label: "ویرایش سرا",
            icon: <SquarePen size={16} />,
            variant: "primary",
            href: `${APP_BASE_PATH}/neighborhood-halls/${id}/edit`,
            permission: "neighborhood_hall.update",
          },
        ]}
        commandActions={[
          {
            id: "hall-detail",
            title: "جزئیات سرای محله",
            subtitle: "مشاهده اطلاعات کامل سرا",
            group: "سراهای محله",
            href: `${APP_BASE_PATH}/neighborhood-halls/${id}`,
            keywords: ["detail", "hall", "سرا"],
          },
          {
            id: "hall-edit",
            title: "ویرایش سرای محله",
            subtitle: "ویرایش اطلاعات اصلی سرا",
            group: "سراهای محله",
            href: `${APP_BASE_PATH}/neighborhood-halls/${id}/edit`,
            keywords: ["edit", "update", "ویرایش"],
          },
          {
            id: "hall-employees",
            title: "کارکنان سرا",
            subtitle: "مدیریت کارکنان سرای محله",
            group: "سراهای محله",
            href: `${APP_BASE_PATH}/neighborhood-halls/${id}/employees`,
            keywords: ["employees", "staff", "کارکنان"],
          },
          {
            id: "hall-servants",
            title: "نیروهای خدماتی سرا",
            subtitle: "مدیریت نیروهای خدماتی",
            group: "سراهای محله",
            href: `${APP_BASE_PATH}/neighborhood-halls/${id}/servants`,
            keywords: ["servants", "services", "خدماتی"],
          },
          {
            id: "reset-hall-detail-preferences",
            title: "بازنشانی تنظیمات صفحه جزئیات",
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
              شناسه: {toPersianDigits(detail.id || 0)}
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {/* مدیر: {detail.user?.name || "-"} */}
            </span>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              ناحیه: {detail.district?.name || "-"}
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

          {error ? (
            <EmptyState title="خطا در دریافت اطلاعات" description={error} />
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="نام سرا"
              value={detail.name || "-"}
              description="عنوان فارسی ثبت‌شده"
              icon={<Building2 size={20} />}
              tone="blue"
            />
            <StatCard
              title="مدیر سرا"
              // value={detail.user?.name || "-"}
              value={"-"}
              description="کاربر منتسب به سرا"
              icon={<Users size={20} />}
              tone="emerald"
            />
            <StatCard
              title="شماره تماس"
              value={detail.phone || "-"}
              description="تلفن تماس سرا یا مدیر"
              icon={<Phone size={20} />}
              tone="amber"
            />
            <StatCard
              title="تعداد کارکنان"
              value={toPersianDigits(detail.info?.staff_count || 0)}
              description="مقدار ثبت‌شده در مشخصات تکمیلی"
              icon={<ShieldCheck size={20} />}
              tone="violet"
            />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <SectionCard
              title="اطلاعات اصلی"
              description="مشخصات پایه سرای محله"
            >
              <InfoGrid
                items={[
                  { label: "شناسه", value: toPersianDigits(detail.id || 0) },
                  { label: "نام فارسی", value: detail.name || "-" },
                  { label: "نام انگلیسی", value: detail.name_en || "-" },
                  { label: "اسلاگ فارسی", value: detail.slug || "-" },
                  { label: "اسلاگ انگلیسی", value: detail.slug_en || "-" },
                  { label: "تاریخ ثبت", value: formatDate(detail.created_at) },
                  {
                    label: "آخرین بروزرسانی",
                    value: formatDate(detail.updated_at),
                  },
                  // { label: "مدیر سرا", value: detail.user?.name || "-" },
                  // {
                  //   label: "شماره مدیر",
                  //   value: detail.user?.phone || "-",
                  // },
                  { label: "تلفن سرا", value: detail.phone || "-" },
                ]}
              />
            </SectionCard>

            <SectionCard
              title="موقعیت و دسترسی"
              description="اطلاعات مکانی و راه‌های ارتباطی"
            >
              <InfoGrid
                items={[
                  { label: "ناحیه", value: detail.district?.name || "-" },
                  // { label: "منطقه", value: detail.region?.name || "-" },
                  { label: "عرض جغرافیایی", value: detail.lat || "-" },
                  { label: "طول جغرافیایی", value: detail.lng || "-" },
                  { label: "آدرس سایت", value: detail.site_address || "-" },
                  { label: "آدرس", value: detail.address || "-" },
                ]}
              />
            </SectionCard>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <SectionCard
              title="مشخصات فضا و امکانات"
              description="اطلاعات تکمیلی ثبت‌شده برای سرا"
            >
              <InfoGrid
                items={[
                  {
                    label: "تعداد کارکنان",
                    value: toPersianDigits(detail.info?.staff_count || 0),
                    icon: <Users size={14} />,
                  },
                  {
                    label: "بیمه",
                    value: yesNo(detail.info?.insurance),
                    icon: <ShieldCheck size={14} />,
                  },
                  {
                    label: "دارای کارگاه",
                    value: yesNo(detail.info?.has_workshop),
                    icon: <Landmark size={14} />,
                  },
                  {
                    label: "مساحت زمین",
                    value: toPersianDigits(detail.info?.area_land || 0),
                    icon: <MapPin size={14} />,
                  },
                  {
                    label: "مساحت بنا",
                    value: toPersianDigits(detail.info?.area_building || 0),
                    icon: <Building2 size={14} />,
                  },
                ]}
              />
            </SectionCard>

            <SectionCard
              title="امکانات فرهنگی"
              description="بررسی وضعیت فضاهای آموزشی و فرهنگی"
            >
              <InfoGrid
                items={[
                  {
                    label: "سالن مطالعه",
                    value: yesNo(detail.info?.has_study_hall),
                    icon: <BookOpen size={14} />,
                  },
                  {
                    label: "سالن تئاتر",
                    value: yesNo(detail.info?.has_theater),
                    icon: <Theater size={14} />,
                  },
                  {
                    label: "ظرفیت تئاتر",
                    value: toPersianDigits(detail.info?.theater_capacity || 0),
                    icon: <Theater size={14} />,
                  },
                  {
                    label: "پیش‌دبستانی",
                    value: yesNo(detail.info?.has_preschool),
                    icon: <Baby size={14} />,
                  },
                  {
                    label: "شماره تماس تکمیلی",
                    value: detail.info?.contact_number || "-",
                    icon: <Phone size={14} />,
                  },
                ]}
              />
            </SectionCard>

            <SectionCard
              title="امکانات ورزشی"
              description="وضعیت فضاهای ورزشی و عمومی"
            >
              <InfoGrid
                items={[
                  {
                    label: "سالن ورزشی",
                    value: yesNo(detail.info?.has_gym),
                    icon: <Dumbbell size={14} />,
                  },
                  {
                    label: "تصویر شاخص",
                    value: detail.image ? "ثبت شده" : "ثبت نشده",
                    icon: <FileText size={14} />,
                  },
                  {
                    label: "متا تایتل",
                    value: detail.meta_title || "-",
                    icon: <Globe size={14} />,
                  },
                  {
                    label: "متا توضیحات",
                    value: detail.meta_description || "-",
                    icon: <Globe size={14} />,
                  },
                  {
                    label: "متا کلیدواژه",
                    value: detail.meta_keywords || "-",
                    icon: <Globe size={14} />,
                  },
                ]}
              />
            </SectionCard>
          </section>

          <SectionCard
            title="توضیحات"
            description="توضیحات کوتاه، اصلی و متن پاپ‌آپ"
          >
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <TextBox title="توضیح کوتاه" value={detail.short_description} />
              <TextBox title="توضیح اصلی" value={detail.description} />
              <TextBox title="متن پاپ‌آپ" value={detail.popup_desc} />
            </div>
          </SectionCard>
        </div>
      </PageShell>
    </PermissionGuard>
  );
}

function InfoGrid({
  items,
}: {
  items: Array<{
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
  }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
        >
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {item.icon ? item.icon : null}
            <span>{item.label}</span>
          </div>
          <div className="mt-2 text-sm font-bold text-gray-900">
            {item.value || "-"}
          </div>
        </div>
      ))}
    </div>
  );
}

function TextBox({ title, value }: { title: string; value?: string | null }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="text-sm font-bold text-gray-900">{title}</div>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        {value?.trim() ? value : "-"}
      </p>
    </div>
  );
}
