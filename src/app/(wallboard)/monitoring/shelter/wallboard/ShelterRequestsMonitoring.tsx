"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  Siren,
  TimerReset,
  Zap,
} from "lucide-react";
import { useShelterOverview } from "./use-shelter-overview";

function safeNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function toPercent(value: number, digits = 0) {
  return `${safeNumber(value).toFixed(digits)}%`;
}

function getRequestPressureLevel(score: number) {
  if (score >= 75) {
    return {
      label: "فشار بالا",
      tone: "bg-rose-50 text-rose-700 border-rose-200",
      bar: "bg-rose-500",
      desc: "حجم درخواست‌ها یا سطح اولویت‌ها در وضعیت فشرده قرار دارد.",
    };
  }

  if (score >= 45) {
    return {
      label: "فشار متوسط",
      tone: "bg-amber-50 text-amber-700 border-amber-200",
      bar: "bg-amber-500",
      desc: "وضعیت درخواست‌ها قابل مدیریت است اما نیازمند پایش نزدیک است.",
    };
  }

  return {
    label: "فشار کنترل‌شده",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    desc: "درخواست‌ها در سطح پایدار و قابل کنترل قرار دارند.",
  };
}

function getRequestsRecommendation(params: {
  activeRequests: number;
  activeReservations: number;
  pendingCount: number;
  emergencyCount: number;
  highPriorityCount: number;
  availableCapacity: number;
  alertsCount: number;
}) {
  const {
    activeRequests,
    activeReservations,
    pendingCount,
    emergencyCount,
    highPriorityCount,
    availableCapacity,
    alertsCount,
  } = params;

  if (emergencyCount >= 5) {
    return "درخواست‌های اضطراری در سطح بالایی قرار دارند؛ مسیر رسیدگی سریع و تخصیص فوری ظرفیت باید فعال شود.";
  }

  if (highPriorityCount >= 10) {
    return "تعداد درخواست‌های با اولویت بالا زیاد است؛ بازبینی فوری صف بررسی و تخصیص اپراتور بیشتر پیشنهاد می‌شود.";
  }

  if (pendingCount >= 15) {
    return "حجم درخواست‌های در انتظار بررسی بالاست؛ فرایند تأیید و تعیین تکلیف باید تسریع شود.";
  }

  if (activeRequests > availableCapacity && availableCapacity > 0) {
    return "تعداد درخواست‌های فعال از ظرفیت آزاد جلو زده است؛ بازتوزیع ظرفیت و اولویت‌بندی مراکز ضروری است.";
  }

  if (alertsCount > 0) {
    return "هشدارهای فعال مرتبط با اسکان باید هم‌زمان با پردازش درخواست‌ها مرور و تعیین تکلیف شوند.";
  }

  if (activeReservations > activeRequests) {
    return "حجم رزروهای فعال از درخواست‌های فعال بیشتر است؛ کنترل نسبت رزرو به تخصیص واقعی پیشنهاد می‌شود.";
  }

  return "وضعیت درخواست‌ها پایدار است؛ پایش روندها و کنترل SLA بررسی درخواست‌ها ادامه یابد.";
}

function findBreakdownValue(
  items: Array<{ label: string; value: number }> | undefined,
  possibleLabels: string[],
) {
  if (!Array.isArray(items)) return 0;

  const normalizedLabels = possibleLabels.map((x) => x.trim().toLowerCase());

  const found = items.find((item) =>
    normalizedLabels.includes(String(item.label).trim().toLowerCase()),
  );

  return safeNumber(found?.value);
}

function BreakdownBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total > 0 ? clamp((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-bold text-slate-800">
          {value} <span className="text-slate-400">({toPercent(percent)})</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  tone,
  subtitle,
  loading,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number }>;
  tone: string;
  subtitle?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500">{title}</div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {loading ? "..." : value}
          </div>
          {subtitle ? (
            <div className="mt-2 text-xs text-slate-400">{subtitle}</div>
          ) : null}
        </div>
        <div className={`rounded-xl p-2.5 ${tone}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function ShelterRequestsMonitoring() {
  const { data, isLoading } = useShelterOverview();

  const kpis: any = data?.data?.kpis ?? {};
  const statusBreakdown = data?.data?.request_status_breakdown ?? [];
  const priorityBreakdown = data?.data?.request_priority_breakdown ?? [];
  const alerts = Array.isArray(data?.data?.alerts) ? data.data.alerts : [];

  const activeRequests = safeNumber(kpis.active_requests);
  const activeReservations = safeNumber(kpis.active_reservations);
  const availableCapacity = safeNumber(kpis.available_capacity);
  const occupiedCapacity = safeNumber(kpis.occupied_capacity);
  const totalCapacity = safeNumber(kpis.total_capacity);
  const occupancyRate = clamp(safeNumber(kpis.occupancy_rate));
  const alertsCount = alerts.length;

  const pendingCount = findBreakdownValue(statusBreakdown, [
    "pending",
    "در انتظار",
    "در انتظار بررسی",
  ]);

  const approvedCount = findBreakdownValue(statusBreakdown, [
    "approved",
    "تایید شده",
    "تأیید شده",
  ]);

  const rejectedCount = findBreakdownValue(statusBreakdown, [
    "rejected",
    "رد شده",
  ]);

  const emergencyCount = findBreakdownValue(statusBreakdown, [
    "emergency",
    "اضطراری",
  ]);

  const highPriorityCount = findBreakdownValue(priorityBreakdown, [
    "high",
    "high priority",
    "اولویت بالا",
  ]);

  const normalPriorityCount = findBreakdownValue(priorityBreakdown, [
    "normal",
    "اولویت عادی",
    "متوسط",
  ]);

  const lowPriorityCount = findBreakdownValue(priorityBreakdown, [
    "low",
    "اولویت پایین",
  ]);

  const totalStatusCount =
    pendingCount + approvedCount + rejectedCount + emergencyCount;

  const totalPriorityCount =
    highPriorityCount + normalPriorityCount + lowPriorityCount;

  const requestPressureScore = clamp(
    activeRequests * 1.2 +
      pendingCount * 1.5 +
      emergencyCount * 6 +
      highPriorityCount * 3 +
      alertsCount * 4 -
      Math.min(availableCapacity * 0.15, 20),
    0,
    100,
  );

  const pressureMeta = getRequestPressureLevel(requestPressureScore);

  const requestToCapacityRate =
    availableCapacity > 0
      ? clamp((activeRequests / availableCapacity) * 100)
      : activeRequests > 0
        ? 100
        : 0;

  const recommendation = getRequestsRecommendation({
    activeRequests,
    activeReservations,
    pendingCount,
    emergencyCount,
    highPriorityCount,
    availableCapacity,
    alertsCount,
  });

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="bg-gradient-to-l from-violet-900 via-fuchsia-800 to-violet-900 p-6 text-white md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-slate-100">
                <FileText size={14} />
                مانیتورینگ اختصاصی درخواست‌های اسکان
              </div>

              <h1 className="mt-4 text-2xl font-black md:text-4xl">
                مرکز پایش درخواست‌ها و رزروهای اسکان
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                نمای تخصصی برای پایش درخواست‌های فعال، صف بررسی، اولویت‌ها،
                هشدارها و فشار عملیاتی مرتبط با فرایند اسکان.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-slate-300">درخواست‌های فعال</div>
                <div className="mt-2 text-2xl font-black">
                  {isLoading ? "..." : activeRequests}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-slate-300">رزروهای فعال</div>
                <div className="mt-2 text-2xl font-black">
                  {isLoading ? "..." : activeReservations}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-slate-300">فشار عملیاتی</div>
                <div className="mt-2 text-2xl font-black">
                  {isLoading
                    ? "..."
                    : `${Math.round(requestPressureScore)}/100`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="درخواست‌های فعال"
          value={activeRequests}
          icon={FileText}
          tone="bg-sky-50 text-sky-600"
          subtitle="تعداد درخواست‌های باز در چرخه رسیدگی"
          loading={isLoading}
        />
        <StatCard
          title="رزروهای فعال"
          value={activeReservations}
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-600"
          subtitle="رزروهای فعال در مراکز اسکان"
          loading={isLoading}
        />
        <StatCard
          title="در انتظار بررسی"
          value={pendingCount}
          icon={Clock3}
          tone="bg-amber-50 text-amber-700"
          subtitle="درخواست‌هایی که هنوز تعیین تکلیف نشده‌اند"
          loading={isLoading}
        />
        <StatCard
          title="درخواست‌های اضطراری"
          value={emergencyCount}
          icon={Siren}
          tone="bg-rose-50 text-rose-700"
          subtitle="مواردی که نیازمند رسیدگی سریع هستند"
          loading={isLoading}
        />
        <StatCard
          title="اولویت بالا"
          value={highPriorityCount}
          icon={Zap}
          tone="bg-fuchsia-50 text-fuchsia-700"
          subtitle="درخواست‌های دارای حساسیت عملیاتی بیشتر"
          loading={isLoading}
        />
        <StatCard
          title="هشدارهای فعال"
          value={alertsCount}
          icon={Bell}
          tone="bg-rose-50 text-rose-700"
          subtitle="تعداد هشدارهای ثبت‌شده در سامانه"
          loading={isLoading}
        />
        <StatCard
          title="نسبت درخواست به ظرفیت آزاد"
          value={toPercent(requestToCapacityRate)}
          icon={Layers3}
          tone="bg-cyan-50 text-cyan-700"
          subtitle="نسبت فشار صف درخواست‌ها به ظرفیت آزاد"
          loading={isLoading}
        />
        <StatCard
          title="نرخ اشغال ظرفیت"
          value={toPercent(occupancyRate)}
          icon={TimerReset}
          tone="bg-violet-50 text-violet-700"
          subtitle="اثر مستقیم ظرفیت بر توان پاسخ‌گویی"
          loading={isLoading}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.04 }}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                توزیع وضعیت درخواست‌ها
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                مشاهده سهم هر وضعیت از کل درخواست‌های ثبت‌شده در breakdown
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
              مجموع: {totalStatusCount}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <BreakdownBar
              label="در انتظار بررسی"
              value={pendingCount}
              total={totalStatusCount}
              color="bg-amber-500"
            />
            <BreakdownBar
              label="تأیید شده"
              value={approvedCount}
              total={totalStatusCount}
              color="bg-emerald-500"
            />
            <BreakdownBar
              label="رد شده"
              value={rejectedCount}
              total={totalStatusCount}
              color="bg-slate-500"
            />
            <BreakdownBar
              label="اضطراری"
              value={emergencyCount}
              total={totalStatusCount}
              color="bg-rose-500"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                توزیع اولویت درخواست‌ها
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                تحلیل تمرکز درخواست‌ها بر اساس سطح اهمیت عملیاتی
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
              مجموع: {totalPriorityCount}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <BreakdownBar
              label="اولویت بالا"
              value={highPriorityCount}
              total={totalPriorityCount}
              color="bg-rose-500"
            />
            <BreakdownBar
              label="اولویت عادی"
              value={normalPriorityCount}
              total={totalPriorityCount}
              color="bg-sky-500"
            />
            <BreakdownBar
              label="اولویت پایین"
              value={lowPriorityCount}
              total={totalPriorityCount}
              color="bg-emerald-500"
            />
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                شاخص فشار عملیاتی
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                ترکیبی از درخواست فعال، صف انتظار، اولویت بالا و هشدارها
              </p>
            </div>
            <div
              className={`rounded-2xl border px-3 py-2 text-xs font-black ${pressureMeta.tone}`}
            >
              {pressureMeta.label}
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div className="text-4xl font-black text-slate-900">
              {Math.round(requestPressureScore)}
            </div>
            <div className="text-sm text-slate-500">از 100</div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${pressureMeta.bar}`}
              style={{ width: `${requestPressureScore}%` }}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            {pressureMeta.desc}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={18} />
            <h3 className="text-base font-black text-slate-900">
              توصیه عملیاتی
            </h3>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {recommendation}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">ظرفیت کل</div>
              <div className="mt-2 text-xl font-black text-slate-900">
                {isLoading ? "..." : totalCapacity}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">ظرفیت اشغال‌شده</div>
              <div className="mt-2 text-xl font-black text-slate-900">
                {isLoading ? "..." : occupiedCapacity}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">ظرفیت آزاد</div>
              <div className="mt-2 text-xl font-black text-slate-900">
                {isLoading ? "..." : availableCapacity}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
