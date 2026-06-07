"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Calendar from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  Bell,
  Building2,
  Home,
  MapPin,
  ShieldAlert,
  Activity,
  ArrowUpLeft,
  BarChart3,
  Database,
  Monitor,
  ClipboardList,
  Users,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Radar,
  Gauge,
  Siren,
  TrendingUp,
  ScanLine,
  Layers3,
  TimerReset,
} from "lucide-react";
import { useHallsOverview } from "./use-halls-overview";
import { useShelterOverview } from "./use-shelter-overview";

const quickActions = [
  {
    title: "مانیتورینگ سراها",
    desc: "پایش فعالیت، کیفیت داده، مختصات و زیرساخت مراکز",
    href: "/monitoring/halls",
    icon: Building2,
    color: "border-sky-200 bg-sky-50 text-sky-700",
  },
  {
    title: "مانیتورینگ اسکان",
    desc: "کنترل ظرفیت، نرخ اشغال و مراکز در آستانه بحران",
    href: "/monitoring/shelter",
    icon: Home,
    color: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    title: "Wallboard عملیاتی",
    desc: "نمایش تمام‌صفحه برای اتاق مانیتورینگ و شیفت عملیاتی",
    href: "/monitoring/shelter/wallboard",
    icon: Monitor,
    color: "border-violet-200 bg-violet-50 text-violet-700",
  },
];

function safeNumber(value?: number) {
  return Number(value ?? 0);
}

function toPercent(value?: number, total?: number) {
  if (!total || total <= 0) return 0;
  return Math.round((Number(value ?? 0) / total) * 100);
}

function clamp(num: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, num));
}

function severityLabel(count: number) {
  if (count >= 6) return "بحرانی";
  if (count >= 3) return "هشدار";
  return "پایدار";
}

function severityTone(count: number) {
  if (count >= 6) return "bg-rose-50 text-rose-600 border-rose-200";
  if (count >= 3) return "bg-amber-50 text-amber-600 border-amber-200";
  return "bg-emerald-50 text-emerald-600 border-emerald-200";
}

function getReadinessScore(params: {
  activityRate: number;
  geoCoverageRate: number;
  contactCoverageRate: number;
  occupancyRate: number;
  criticalShelters: number;
}) {
  const base =
    params.activityRate * 0.3 +
    params.geoCoverageRate * 0.2 +
    params.contactCoverageRate * 0.2 +
    (100 - params.occupancyRate) * 0.2 +
    (params.criticalShelters > 0
      ? Math.max(0, 100 - params.criticalShelters * 12)
      : 100) *
      0.1;

  return clamp(Math.round(base));
}

function getReadinessMeta(score: number) {
  if (score >= 85) {
    return {
      label: "بسیار مطلوب",
      tone: "text-emerald-600 bg-emerald-50",
      progress: "bg-emerald-500",
    };
  }

  if (score >= 65) {
    return {
      label: "قابل قبول",
      tone: "text-sky-600 bg-sky-50",
      progress: "bg-sky-500",
    };
  }

  if (score >= 45) {
    return {
      label: "نیازمند توجه",
      tone: "text-amber-600 bg-amber-50",
      progress: "bg-amber-500",
    };
  }

  return {
    label: "پرریسک",
    tone: "text-rose-600 bg-rose-50",
    progress: "bg-rose-500",
  };
}

function getRiskSummary(
  occupancyRate: number,
  alertsCount: number,
  criticalShelters: number,
) {
  if (occupancyRate >= 90 || criticalShelters >= 3 || alertsCount >= 6) {
    return {
      title: "ریسک عملیاتی بالا",
      desc: "ظرفیت اسکان در محدوده فشرده قرار دارد و نیاز به مداخله سریع عملیاتی دیده می‌شود.",
      tone: "border-rose-200 bg-rose-50 text-rose-700",
    };
  }

  if (occupancyRate >= 75 || criticalShelters >= 1 || alertsCount >= 3) {
    return {
      title: "ریسک متوسط",
      desc: "بخشی از مراکز به آستانه هشدار نزدیک شده‌اند و باید پایش فشرده‌تری انجام شود.",
      tone: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    title: "ریسک کنترل‌شده",
    desc: "در حال حاضر فشار بحرانی روی شبکه اسکان و وضعیت مراکز مشاهده نمی‌شود.",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
}

function getActionRecommendation(params: {
  geoCoverageRate: number;
  contactCoverageRate: number;
  occupancyRate: number;
  criticalShelters: number;
  availableCapacity: number;
}) {
  if (params.availableCapacity <= 0) {
    return "فوراً ظرفیت جایگزین برای اسکان فعال شود؛ در حال حاضر ظرفیت آزاد گزارش نشده است.";
  }

  if (params.occupancyRate >= 90) {
    return "اولویت با بازتوزیع پذیرش میان مراکز و آزادسازی ظرفیت پشتیبان است.";
  }

  if (params.criticalShelters > 0) {
    return "مراکز بحرانی ظرفیت باید در شیفت جاری به‌صورت تلفنی و میدانی پایش شوند.";
  }

  if (params.geoCoverageRate < 85) {
    return "تکمیل مختصات جغرافیایی مراکز در اولویت عملیات داده قرار گیرد.";
  }

  if (params.contactCoverageRate < 85) {
    return "اطلاعات تماس مراکز ناقص است؛ تیم داده باید فهرست مراکز ناقص را تکمیل کند.";
  }

  return "وضعیت فعلی پایدار است؛ تمرکز بر نگهداشت کیفیت داده و بازبینی دوره‌ای مراکز کافی است.";
}

function MetricCard({
  title,
  value,
  desc,
  icon: Icon,
  tone,
  loading,
}: {
  title: string;
  value: string | number;
  desc: string;
  icon: React.ElementType;
  tone: string;
  loading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-500">{title}</p>
          <h3 className="mt-3 text-2xl font-black text-slate-900">
            {loading ? "..." : value}
          </h3>
        </div>

        <div className={`rounded-xl p-2.5 ${tone}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-6 text-slate-500">{desc}</p>
    </motion.div>
  );
}

function InsightRow({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  tone: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2 ${tone}`}>
          <Icon size={16} />
        </div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
}

export default function DashboardLayout() {
  const now = new DateObject({ calendar: persian, locale: persian_fa });
  const nowLabel = now.format("dddd DD MMMM YYYY");
  const nowTime = now.format("HH:mm");

  const {
    data: hallsData,
    isLoading: hallsLoading,
    isError: hallsError,
  } = useHallsOverview({ top: 5 });

  const {
    data: shelterData,
    isLoading: shelterLoading,
    isError: shelterError,
  } = useShelterOverview({ top: 5 });

  const alertsCount =
    safeNumber(hallsData?.alerts?.length) +
    safeNumber(shelterData?.alerts?.length);

  const totalHalls = safeNumber(hallsData?.summary.total_halls);
  const activeHalls = safeNumber(hallsData?.summary.active_halls);
  const activityRate = safeNumber(hallsData?.summary.activity_rate);

  const geoCovered = safeNumber(hallsData?.data_quality.with_coordinates);
  const contactCovered = safeNumber(hallsData?.data_quality.with_contact);

  const geoCoverageRate = toPercent(geoCovered, totalHalls);
  const contactCoverageRate = toPercent(contactCovered, totalHalls);

  const shelterEnabled = safeNumber(
    shelterData?.operational_summary.shelter_enabled_halls,
  );
  const activeShelters = safeNumber(
    shelterData?.operational_summary.active_shelters,
  );
  const criticalShelters = safeNumber(
    shelterData?.operational_summary.critical_capacity_halls,
  );
  const occupancyRate = safeNumber(
    shelterData?.capacity_summary.occupancy_rate,
  );
  const availableCapacity = safeNumber(
    shelterData?.capacity_summary.available_capacity,
  );
  const totalCapacity = safeNumber(
    shelterData?.capacity_summary.total_capacity,
  );
  const occupiedCapacity = safeNumber(
    shelterData?.capacity_summary.occupied_capacity,
  );

  const topHall = hallsData?.top_halls?.[0];
  const topShelter = shelterData?.top_shelters?.[0];

  const readinessScore = getReadinessScore({
    activityRate,
    geoCoverageRate,
    contactCoverageRate,
    occupancyRate,
    criticalShelters,
  });

  const readinessMeta = getReadinessMeta(readinessScore);
  const riskSummary = getRiskSummary(
    occupancyRate,
    alertsCount,
    criticalShelters,
  );
  const recommendation = getActionRecommendation({
    geoCoverageRate,
    contactCoverageRate,
    occupancyRate,
    criticalShelters,
    availableCapacity,
  });

  const serviceHealthy = !hallsError && !shelterError;
  const loading = hallsLoading || shelterLoading;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#f8fafc_32%,_#f8fafc_100%)] p-4 md:p-8"
    >
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <Radar size={14} />
                پایش زنده سامانه
              </div>

              <h1 className="text-2xl font-black text-slate-900 md:text-3xl">
                داشبورد فرماندهی مانیتورینگ
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                نمای یکپارچه‌ی وضعیت سراهای محله، ظرفیت اسکان، کیفیت داده و
                هشدارهای عملیاتی
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-bold text-slate-500">
                  تاریخ
                </div>
                <div className="mt-1 text-sm font-black text-slate-900">
                  {nowLabel}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-bold text-slate-500">
                  آخرین زمان مشاهده
                </div>
                <div className="mt-1 text-sm font-black text-slate-900">
                  {nowTime}
                </div>
              </div>

              <button className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition-colors hover:text-sky-600">
                <Bell size={20} />
                {alertsCount > 0 ? (
                  <span className="absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
                    {alertsCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 border-t border-slate-100 md:grid-cols-4">
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
                <ScanLine size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500">وضعیت سرویس</div>
                <div className="text-sm font-black text-slate-900">
                  {serviceHealthy ? "پایدار" : "ناپایدار"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 p-4 md:border-t-0 md:border-r">
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                <Activity size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500">نرخ فعالیت سراها</div>
                <div className="text-sm font-black text-slate-900">
                  {loading ? "..." : `${activityRate}%`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 p-4 md:border-t-0 md:border-r">
              <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
                <Gauge size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500">نرخ اشغال اسکان</div>
                <div className="text-sm font-black text-slate-900">
                  {loading ? "..." : `${occupancyRate}%`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 p-4 md:border-t-0 md:border-r">
              <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
                <Siren size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500">سطح هشدار</div>
                <div className="text-sm font-black text-slate-900">
                  {severityLabel(alertsCount)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-slate-700">
                <ClipboardList size={18} className="text-sky-500" />
                مسیرهای کلیدی عملیات
              </h2>

              <Link
                href="/monitoring/halls/wallboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:text-sky-600"
              >
                <Monitor size={16} />
                Wallboard سراها
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {quickActions.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      className={`group block rounded-2xl border p-5 text-right transition-all hover:-translate-y-0.5 hover:shadow-sm ${item.color}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Icon size={22} />
                          <h3 className="mt-4 text-sm font-black">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-xs leading-6 opacity-80">
                            {item.desc}
                          </p>
                        </div>

                        <ArrowUpLeft
                          size={18}
                          className="shrink-0 opacity-60 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="کل سراها"
              value={totalHalls}
              desc="تعداد مراکز ثبت‌شده در لایه پایش"
              icon={Building2}
              tone="bg-sky-50 text-sky-600"
              loading={hallsLoading}
            />

            <MetricCard
              title="سراهای فعال"
              value={activeHalls}
              desc={`${activityRate}% نرخ فعالیت جاری`}
              icon={Activity}
              tone="bg-emerald-50 text-emerald-600"
              loading={hallsLoading}
            />

            <MetricCard
              title="ظرفیت آزاد اسکان"
              value={availableCapacity}
              desc={`${occupiedCapacity} اشغال‌شده از ${totalCapacity} ظرفیت`}
              icon={Home}
              tone="bg-violet-50 text-violet-600"
              loading={shelterLoading}
            />

            <MetricCard
              title="هشدارهای فعال"
              value={alertsCount}
              desc={
                criticalShelters > 0
                  ? `${criticalShelters} مرکز دارای فشار بحرانی`
                  : "مرکز بحرانی ظرفیت ثبت نشده است"
              }
              icon={ShieldAlert}
              tone={
                alertsCount > 0
                  ? "bg-rose-50 text-rose-600"
                  : "bg-slate-100 text-slate-600"
              }
              loading={loading}
            />
          </div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold text-slate-700">شاخص آمادگی عملیاتی</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${readinessMeta.tone}`}
              >
                {readinessMeta.label}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
              <div className="xl:col-span-2">
                <div className="flex items-end gap-3">
                  <div className="text-5xl font-black text-slate-900">
                    {loading ? "..." : readinessScore}
                  </div>
                  <div className="pb-2 text-sm font-bold text-slate-500">
                    از ۱۰۰
                  </div>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${readinessMeta.progress}`}
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  این شاخص از ترکیب نرخ فعالیت سراها، کیفیت پوشش داده، فشار
                  ظرفیت اسکان و تعداد مراکز بحرانی محاسبه شده است.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 xl:col-span-3 md:grid-cols-2">
                <InsightRow
                  label="پوشش مختصات"
                  value={`${geoCoverageRate}%`}
                  icon={MapPin}
                  tone="bg-sky-50 text-sky-600"
                />
                <InsightRow
                  label="پوشش اطلاعات تماس"
                  value={`${contactCoverageRate}%`}
                  icon={Phone}
                  tone="bg-cyan-50 text-cyan-600"
                />
                <InsightRow
                  label="آمادگی مراکز اسکان"
                  value={`${shelterEnabled > 0 ? toPercent(activeShelters, shelterEnabled) : 0}%`}
                  icon={Users}
                  tone="bg-emerald-50 text-emerald-600"
                />
                <InsightRow
                  label="تراکم ظرفیت"
                  value={`${occupancyRate}%`}
                  icon={Gauge}
                  tone={
                    occupancyRate >= 90
                      ? "bg-rose-50 text-rose-600"
                      : occupancyRate >= 75
                        ? "bg-amber-50 text-amber-600"
                        : "bg-violet-50 text-violet-600"
                  }
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.22 }}
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <div
              className={`rounded-2xl border p-5 shadow-sm ${riskSummary.tone}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle size={18} />
                <h3 className="text-sm font-black">{riskSummary.title}</h3>
              </div>
              <p className="text-sm leading-7">{riskSummary.desc}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-slate-700">
                <TrendingUp size={18} className="text-indigo-500" />
                <h3 className="text-sm font-black">اولویت اقدام فوری</h3>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                {recommendation}
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.26 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold text-slate-700">خلاصه مراکز برجسته</h2>
              <Link
                href="/monitoring/shelter"
                className="rounded-2xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600"
              >
                مشاهده جزئیات اسکان
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={17} className="text-sky-600" />
                  مرکز برتر سراها
                </div>
                <div className="mt-3 text-lg font-black text-slate-900">
                  {hallsLoading
                    ? "..."
                    : (topHall?.name ?? "اطلاعاتی ثبت نشده")}
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {topHall
                    ? `امتیاز ${safeNumber(topHall.score)} | منطقه ${topHall.region_name ?? "-"} | ناحیه ${topHall.district_name ?? "-"}`
                    : "در حال حاضر داده‌ای برای رتبه‌بندی مراکز سرا در دسترس نیست."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <AlertTriangle size={17} className="text-rose-600" />
                  مرکز حساس اسکان
                </div>
                <div className="mt-3 text-lg font-black text-slate-900">
                  {shelterLoading
                    ? "..."
                    : (topShelter?.name ?? "اطلاعاتی ثبت نشده")}
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {topShelter
                    ? `${safeNumber(topShelter.occupancy_rate)}% نرخ اشغال | ${safeNumber(topShelter.available_capacity)} ظرفیت آزاد | منطقه ${topShelter.region_name ?? "-"}`
                    : "در حال حاضر داده‌ای برای رتبه‌بندی مراکز اسکان در دسترس نیست."}
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-slate-700">
              <Layers3 size={18} className="text-violet-500" />
              <h3 className="text-sm font-bold">تقویم عملیاتی کامل</h3>
            </div>

            <div className="mb-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500">امروز</div>
              <div className="mt-1 text-lg font-black text-slate-900">
                {nowLabel}
              </div>
              <div className="mt-1 text-sm text-slate-500">ساعت {nowTime}</div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-3">
              <Calendar
                value={new Date()}
                calendar={persian}
                locale={persian_fa}
                readOnly
                shadow={false}
                weekStartDayIndex={6}
                numberOfMonths={1}
                className="w-full"
                style={{
                  width: "100%",
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <div className="text-xs font-bold text-slate-500">ماه جاری</div>
                <div className="mt-1 text-sm font-black text-slate-900">
                  {now.format("MMMM")}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <div className="text-xs font-bold text-slate-500">روز هفته</div>
                <div className="mt-1 text-sm font-black text-slate-900">
                  {now.format("dddd")}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-slate-700">
              <ShieldAlert size={18} className="text-rose-500" />
              <h3 className="text-sm font-bold">تحلیل هشدارها</h3>
            </div>

            <div
              className={`rounded-2xl border px-4 py-3 ${severityTone(alertsCount)}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">وضعیت کلی هشدار</span>
                <span className="text-xs font-black">
                  {severityLabel(alertsCount)}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <InsightRow
                label="هشدارهای ثبت‌شده"
                value={`${alertsCount} مورد`}
                icon={Bell}
                tone="bg-rose-50 text-rose-600"
              />
              <InsightRow
                label="مراکز بحرانی ظرفیت"
                value={`${criticalShelters} مرکز`}
                icon={Siren}
                tone="bg-amber-50 text-amber-600"
              />
              <InsightRow
                label="ظرفیت آزاد شبکه"
                value={`${availableCapacity} نفر`}
                icon={Home}
                tone="bg-emerald-50 text-emerald-600"
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.24 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-slate-700">
              <TimerReset size={18} className="text-sky-500" />
              <h3 className="text-sm font-bold">جمع‌بندی مدیریتی</h3>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {serviceHealthy
                ? "جریان داده‌های مانیتورینگ پایدار است و تصمیم‌گیری می‌تواند بر اساس شاخص‌های جاری انجام شود."
                : "در دریافت داده از یکی از سرویس‌های مانیتورینگ اختلال مشاهده شده و لازم است وضعیت API بررسی شود."}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/monitoring/halls/wallboard"
                className="rounded-2xl border border-slate-200 px-3 py-2 text-center text-xs font-bold text-slate-600 hover:text-sky-600"
              >
                Wallboard سراها
              </Link>

              <Link
                href="/monitoring/shelter/wallboard"
                className="rounded-2xl border border-slate-200 px-3 py-2 text-center text-xs font-bold text-slate-600 hover:text-emerald-600"
              >
                Wallboard اسکان
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
