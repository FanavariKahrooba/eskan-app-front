"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  Activity,
  AlertTriangle,
  ArrowUpLeft,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  Gauge,
  Home,
  MapPin,
  Phone,
  Radar,
  ShieldCheck,
  Siren,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { useHallsOverview } from "./use-halls-overview";
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

function severityLabel(score: number) {
  if (score >= 85) return "بسیار مطلوب";
  if (score >= 70) return "قابل قبول";
  if (score >= 50) return "نیازمند توجه";
  return "پرریسک";
}

function severityTone(score: number) {
  if (score >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 70) return "bg-sky-50 text-sky-700 border-sky-200";
  if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function getReadinessMeta(score: number) {
  if (score >= 85) {
    return {
      title: "آمادگی عملیاتی بسیار مطلوب",
      desc: "زیرساخت داده و ظرفیت عملیاتی در وضعیت پایدار قرار دارد.",
    };
  }
  if (score >= 70) {
    return {
      title: "آمادگی عملیاتی قابل قبول",
      desc: "عملکرد سامانه مناسب است اما چند شاخص برای بهبود نیاز به بررسی دارند.",
    };
  }
  if (score >= 50) {
    return {
      title: "آمادگی عملیاتی نیازمند توجه",
      desc: "بخشی از شاخص‌های داده و ظرفیت نیازمند اقدام اصلاحی در کوتاه‌مدت هستند.",
    };
  }
  return {
    title: "آمادگی عملیاتی پرریسک",
    desc: "سامانه برای تصمیم‌گیری پایدار نیازمند رسیدگی فوری در چند بخش کلیدی است.",
  };
}

function getRiskSummary(
  occupancyRate: number,
  geoCoverageRate: number,
  contactCoverageRate: number,
  criticalShelters: number,
  alertsCount: number,
) {
  const riskScore =
    occupancyRate * 0.35 +
    (100 - geoCoverageRate) * 0.2 +
    (100 - contactCoverageRate) * 0.15 +
    Math.min(criticalShelters * 8, 20) +
    Math.min(alertsCount * 4, 10);

  if (riskScore >= 70) {
    return {
      label: "ریسک عملیاتی بالا",
      tone: "bg-rose-50 text-rose-700 border-rose-200",
      desc: "تراکم ظرفیت و سطح هشدارها بالا است و بخشی از داده‌های پایه نیز نیاز به تکمیل دارند.",
    };
  }
  if (riskScore >= 45) {
    return {
      label: "ریسک عملیاتی متوسط",
      tone: "bg-amber-50 text-amber-700 border-amber-200",
      desc: "وضعیت کلی تحت کنترل است اما برخی مراکز یا شاخص‌ها نیازمند پایش نزدیک هستند.",
    };
  }
  return {
    label: "ریسک عملیاتی کنترل‌شده",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "سطح اشغال، کیفیت داده و هشدارها در محدوده قابل قبول قرار دارند.",
  };
}

function getActionRecommendation(params: {
  occupancyRate: number;
  geoCoverageRate: number;
  contactCoverageRate: number;
  criticalShelters: number;
  alertsCount: number;
}) {
  const {
    occupancyRate,
    geoCoverageRate,
    contactCoverageRate,
    criticalShelters,
    alertsCount,
  } = params;

  if (occupancyRate >= 85) {
    return "ظرفیت اسکان در آستانه اشباع است؛ بازتوزیع ظرفیت و فعال‌سازی مراکز جایگزین در اولویت قرار گیرد.";
  }
  if (criticalShelters > 0) {
    return "چند مرکز اسکان در وضعیت حساس قرار دارند؛ تیم پایش باید بررسی میدانی و کنترل ظرفیت را در اولویت بگذارد.";
  }
  if (geoCoverageRate < 80) {
    return "پوشش مختصات مراکز هنوز کامل نیست؛ تکمیل اطلاعات مکانی برای دقت مانیتورینگ ضروری است.";
  }
  if (contactCoverageRate < 85) {
    return "اطلاعات تماس برخی مراکز ناقص است؛ بازبینی پرونده مراکز و تکمیل راه‌های ارتباطی پیشنهاد می‌شود.";
  }
  if (alertsCount > 0) {
    return "هشدارهای فعال نیازمند مرور و تعیین وضعیت هستند تا از انباشت موارد باز جلوگیری شود.";
  }
  return "وضعیت عملیاتی پایدار است؛ تمرکز روی بهبود مستمر کیفیت داده و پایش روندها پیشنهاد می‌شود.";
}

function PersianMonthCalendar() {
  const today = new DateObject({ calendar: persian, locale: persian_fa });
  const currentMonth = today.month.index;
  const currentYear = today.year;

  const firstDayOfMonth = new DateObject({
    calendar: persian,
    locale: persian_fa,
    year: currentYear,
    month: currentMonth + 1,
    day: 1,
  });

  const daysInMonth = firstDayOfMonth.month.length;
  const firstWeekDay = firstDayOfMonth.weekDay.index;
  const weekDays = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];

  const normalizedFirstDay = (firstWeekDay + 1) % 7;

  const cells: {
    day: number | null;
    isToday?: boolean;
    isCurrentMonth: boolean;
    label?: string;
    tone?: string;
  }[] = [];

  for (let i = 0; i < normalizedFirstDay; i++) {
    cells.push({ day: null, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.day;
    let label = "";
    let tone = "";

    if (isToday) {
      label = "امروز";
      tone = "bg-sky-100 text-sky-700";
    } else if (day % 7 === 0) {
      label = "پایش";
      tone = "bg-emerald-100 text-emerald-700";
    } else if (day % 5 === 0) {
      label = "بازبینی";
      tone = "bg-amber-100 text-amber-700";
    }

    cells.push({
      day,
      isToday,
      isCurrentMonth: true,
      label,
      tone,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, isCurrentMonth: false });
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-800">
            تقویم عملیاتی ماه
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {today.format("MMMM YYYY")}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
          {today.format("dddd DD MMMM")}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="rounded-xl bg-slate-50 py-2 text-center text-xs font-black text-slate-600"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, index) => (
          <div
            key={index}
            className={`min-h-[88px] rounded-2xl border p-2 transition-all ${
              cell.isCurrentMonth
                ? cell.isToday
                  ? "border-sky-300 bg-sky-50 shadow-sm"
                  : "border-slate-100 bg-slate-50"
                : "border-transparent bg-slate-50/40 opacity-40"
            }`}
          >
            {cell.day ? (
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-sm font-black ${
                      cell.isToday ? "text-sky-700" : "text-slate-800"
                    }`}
                  >
                    {cell.day}
                  </span>

                  {cell.isToday ? (
                    <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-black text-white">
                      امروز
                    </span>
                  ) : null}
                </div>

                {cell.label ? (
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${cell.tone}`}
                    >
                      {cell.label}
                    </span>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsGrid({
  hallsLoading,
  shelterLoading,
  totalHalls,
  activeHalls,
  geoCovered,
  contactCovered,
  shelterEnabled,
  activeShelters,
  criticalShelters,
  totalCapacity,
  occupiedCapacity,
  availableCapacity,
  occupancyRate,
  alertsCount,
}: {
  hallsLoading: boolean;
  shelterLoading: boolean;
  totalHalls: number;
  activeHalls: number;
  geoCovered: number;
  contactCovered: number;
  shelterEnabled: number;
  activeShelters: number;
  criticalShelters: number;
  totalCapacity: number;
  occupiedCapacity: number;
  availableCapacity: number;
  occupancyRate: number;
  alertsCount: number;
}) {
  const inactiveHalls = Math.max(totalHalls - activeHalls, 0);
  const loading = hallsLoading || shelterLoading;

  const items = [
    {
      title: "کل سراها",
      value: totalHalls,
      icon: Building2,
      tone: "bg-sky-50 text-sky-600",
    },
    {
      title: "سراهای فعال",
      value: activeHalls,
      icon: Activity,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "سراهای غیرفعال",
      value: inactiveHalls,
      icon: AlertTriangle,
      tone: "bg-slate-100 text-slate-600",
    },
    {
      title: "دارای مختصات",
      value: geoCovered,
      icon: MapPin,
      tone: "bg-cyan-50 text-cyan-600",
    },
    {
      title: "دارای اطلاعات تماس",
      value: contactCovered,
      icon: Phone,
      tone: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "سراهای دارای اسکان",
      value: shelterEnabled,
      icon: Home,
      tone: "bg-violet-50 text-violet-600",
    },
    {
      title: "اسکان‌های فعال",
      value: activeShelters,
      icon: Users,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "مراکز بحرانی",
      value: criticalShelters,
      icon: Siren,
      tone: "bg-rose-50 text-rose-600",
    },
    {
      title: "ظرفیت کل",
      value: totalCapacity,
      icon: Gauge,
      tone: "bg-slate-100 text-slate-700",
    },
    {
      title: "ظرفیت اشغال‌شده",
      value: occupiedCapacity,
      icon: TrendingUp,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "ظرفیت آزاد",
      value: availableCapacity,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "نرخ اشغال",
      value: `${occupancyRate}%`,
      icon: Radar,
      tone: "bg-fuchsia-50 text-fuchsia-700",
    },
    {
      title: "هشدارهای فعال",
      value: alertsCount,
      icon: Bell,
      tone: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-500">
                  {item.title}
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  {loading ? "..." : item.value}
                </div>
              </div>
              <div className={`rounded-xl p-2.5 ${item.tone}`}>
                <Icon size={18} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function DashboardLayout() {
  const { data: hallsData, isLoading: hallsLoading } = useHallsOverview();
  const { data: shelterData, isLoading: shelterLoading } = useShelterOverview();

  const hallsKpis: any = hallsData?.data?.kpis ?? {};
  const shelterKpis: any = shelterData?.data?.kpis ?? {};

  const totalHalls: any = safeNumber(hallsKpis.total_halls);
  const activeHalls = safeNumber(hallsKpis.active_halls);
  const inactiveHalls = safeNumber(hallsKpis.inactive_halls);

  const geoCovered = safeNumber(hallsKpis.halls_with_geo);
  const geoMissing = safeNumber(hallsKpis.halls_with_missing_geo);

  const contactCovered = safeNumber(hallsKpis.halls_with_contact);
  const contactMissing = safeNumber(hallsKpis.halls_with_missing_contact);

  const hallsWithManager = safeNumber(hallsKpis.halls_with_manager);
  const hallsWithoutManager = safeNumber(hallsKpis.halls_without_manager);

  const activityRate =
    totalHalls > 0 ? clamp((activeHalls / totalHalls) * 100) : 0;

  const geoCoverageRate =
    totalHalls > 0 ? clamp((geoCovered / totalHalls) * 100) : 0;

  const contactCoverageRate =
    totalHalls > 0 ? clamp((contactCovered / totalHalls) * 100) : 0;

  const shelterEnabled = safeNumber(shelterKpis.total_halls);
  const activeShelters = safeNumber(shelterKpis.active_halls);
  const criticalShelters = safeNumber(shelterKpis.critical_shelters);

  const totalCapacity = safeNumber(shelterKpis.total_capacity);
  const occupiedCapacity = safeNumber(shelterKpis.occupied_capacity);
  const availableCapacity = safeNumber(shelterKpis.available_capacity);
  const occupancyRate = clamp(safeNumber(shelterKpis.occupancy_rate));

  const alertsCount = Array.isArray(shelterData?.data?.alerts)
    ? shelterData.data.alerts.length
    : safeNumber(shelterKpis.alerts_count);

  const topHall = hallsData?.data?.top_halls?.[0] || null;
  const topShelter = shelterData?.data?.top_shelters?.[0] || null;

  const readinessScore = clamp(
    activityRate * 0.3 +
      geoCoverageRate * 0.2 +
      contactCoverageRate * 0.15 +
      (100 - occupancyRate) * 0.2 +
      (criticalShelters === 0 ? 15 : Math.max(0, 15 - criticalShelters * 5)),
  );

  const readinessMeta = getReadinessMeta(readinessScore);
  const riskSummary = getRiskSummary(
    occupancyRate,
    geoCoverageRate,
    contactCoverageRate,
    criticalShelters,
    alertsCount,
  );

  const actionRecommendation = getActionRecommendation({
    occupancyRate,
    geoCoverageRate,
    contactCoverageRate,
    criticalShelters,
    alertsCount,
  });

  const quickActions = [
    {
      title: "مانیتورینگ سراها",
      description: "بررسی وضعیت فعالیت، داده‌های پایه و مراکز برتر",
      href: "/console/monitoring/halls",
      icon: Building2,
      color: "from-sky-500 to-cyan-500",
    },
    // {
    //   title: "مانیتورینگ اسکان",
    //   description: "پایش ظرفیت، وضعیت بحرانی و مراکز فعال اسکان",
    //   href: "/console/monitoring/shelter",
    //   icon: Home,
    //   color: "from-violet-500 to-fuchsia-500",
    // },
    {
      title: "Wallboard عملیاتی",
      description: "نمای لحظه‌ای برای نمایش در اتاق پایش و مانیتور ",
      href: "/monitoring/halls/wallboard",
      icon: BarChart3,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "نقشه سراها",
      description: "بررسی وضعیت فعالیت،  بر روی نقشه",
      href: "/console/monitoring/shelters",
      icon: Building2,
      color: "from-sky-500 to-cyan-500",
    },
    {
      title: "نقشه سراها نسخه wallboard",
      description: "بررسی وضعیت فعالیت،  بر روی نقشه",
      href: "/monitoring/shelters/wallboard",
      icon: Building2,
      color: "from-sky-200 to-cyan-700",
    },
    {
      title: "نقشه سراها Wallboard",
      description: "بررسی وضعیت فعالیت،  بر روی نقشه",
      href: "/monitoring/maps/wallboard",
      icon: Building2,
      color: "from-sky-200 to-cyan-700",
    },
  ];

  const today = new DateObject({ calendar: persian, locale: persian_fa });
  const currentTime = new Date().toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="space-y-6 p-4 md:p-6 xl:p-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 p-6 text-white md:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-slate-100">
                  <Sparkles size={14} />
                  داشبورد فرماندهی مانیتورینگ
                </div>

                <h1 className="mt-4 text-2xl font-black md:text-4xl">
                  مرکز پایش سامانه سراها و اسکان
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  نمای یکپارچه برای مشاهده وضعیت عملیاتی سراها، اسکان، ظرفیت‌ها،
                  هشدارهای فعال و کیفیت داده‌ها در یک نگاه مدیریتی.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300 md:text-sm">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    {today.format("dddd DD MMMM YYYY")}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    ساعت {currentTime}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[540px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-300">نرخ فعالیت سراها</div>
                  <div className="mt-2 text-2xl font-black">
                    {toPercent(activityRate)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-300">نرخ اشغال اسکان</div>
                  <div className="mt-2 text-2xl font-black">
                    {toPercent(occupancyRate)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-300">سطح هشدار</div>
                  <div className="mt-2 text-2xl font-black">{alertsCount}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <StatsGrid
          hallsLoading={hallsLoading}
          shelterLoading={shelterLoading}
          totalHalls={totalHalls}
          activeHalls={activeHalls}
          geoCovered={geoCovered}
          contactCovered={contactCovered}
          shelterEnabled={shelterEnabled}
          activeShelters={activeShelters}
          criticalShelters={criticalShelters}
          totalCapacity={totalCapacity}
          occupiedCapacity={occupiedCapacity}
          availableCapacity={availableCapacity}
          occupancyRate={Math.round(occupancyRate)}
          alertsCount={alertsCount}
        />

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    اقدامات سریع عملیاتی
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    دسترسی سریع به بخش‌های کلیدی مانیتورینگ سامانه
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.08 + index * 0.04,
                      }}
                    >
                      <Link
                        href={action.href}
                        className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                      >
                        <div
                          className={`h-1.5 bg-gradient-to-r ${action.color}`}
                        />
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={`rounded-2xl bg-gradient-to-r p-3 text-white ${action.color}`}
                            >
                              <Icon size={20} />
                            </div>

                            <ArrowUpLeft
                              size={18}
                              className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:text-slate-700"
                            />
                          </div>

                          <h3 className="mt-4 text-base font-black text-slate-900">
                            {action.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {action.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      شاخص آمادگی عملیاتی
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      ترکیبی از فعالیت، کیفیت داده، ظرفیت و وضعیت مراکز حساس
                    </p>
                  </div>
                  <div
                    className={`rounded-2xl border px-3 py-2 text-xs font-black ${severityTone(
                      readinessScore,
                    )}`}
                  >
                    {severityLabel(readinessScore)}
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div className="text-4xl font-black text-slate-900">
                    {Math.round(readinessScore)}
                  </div>
                  <div className="text-sm text-slate-500">از 100</div>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      readinessScore >= 85
                        ? "bg-emerald-500"
                        : readinessScore >= 70
                          ? "bg-sky-500"
                          : readinessScore >= 50
                            ? "bg-amber-500"
                            : "bg-rose-500"
                    }`}
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-black text-slate-800">
                    {readinessMeta.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {readinessMeta.desc}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      تحلیل ریسک
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      بر پایه نرخ اشغال، پوشش داده و هشدارهای فعال
                    </p>
                  </div>
                  <div
                    className={`rounded-2xl border px-3 py-2 text-xs font-black ${riskSummary.tone}`}
                  >
                    {riskSummary.label}
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  {riskSummary.desc}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">پوشش مکانی</div>
                    <div className="mt-2 text-xl font-black text-slate-900">
                      {toPercent(geoCoverageRate)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">پوشش تماس</div>
                    <div className="mt-2 text-xl font-black text-slate-900">
                      {toPercent(contactCoverageRate)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">مراکز بحرانی</div>
                    <div className="mt-2 text-xl font-black text-slate-900">
                      {criticalShelters}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">هشدار فعال</div>
                    <div className="mt-2 text-xl font-black text-slate-900">
                      {alertsCount}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Zap className="text-amber-500" size={18} />
                  <h3 className="text-base font-black text-slate-900">
                    اولویت اقدام فوری
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {actionRecommendation}
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-amber-50 p-4">
                    <div className="text-xs font-bold text-amber-700">
                      نرخ اشغال
                    </div>
                    <div className="mt-2 text-xl font-black text-amber-800">
                      {toPercent(occupancyRate)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-4">
                    <div className="text-xs font-bold text-cyan-700">
                      ظرفیت آزاد
                    </div>
                    <div className="mt-2 text-xl font-black text-cyan-800">
                      {availableCapacity}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500" size={18} />
                  <h3 className="text-base font-black text-slate-900">
                    خلاصه مراکز برجسته
                  </h3>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">
                      مرکز برتر سراها
                    </div>
                    <div className="mt-2 text-sm font-black text-slate-900">
                      {topHall?.name || "داده‌ای ثبت نشده است"}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">
                      مرکز حساس اسکان
                    </div>
                    <div className="mt-2 text-sm font-black text-slate-900">
                      {topShelter?.name || "داده‌ای ثبت نشده است"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="text-sky-500" size={18} />
                <h3 className="text-base font-black text-slate-900">
                  دسترسی مستقیم به Wallboard
                </h3>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Link
                  href="/monitoring/halls/wallboard"
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50"
                >
                  <div className="text-sm font-black text-slate-900">
                    Wallboard سراها
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    نمای لحظه‌ای وضعیت فعالیت سراها و شاخص‌های پایه
                  </p>
                </Link>

                <Link
                  href="/monitoring/shelter/wallboard"
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-200 hover:bg-violet-50"
                >
                  <div className="text-sm font-black text-slate-900">
                    Wallboard اسکان
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    نمای لحظه‌ای ظرفیت، اشغال و مراکز حساس اسکان
                  </p>
                </Link>
              </div>
            </motion.section>
          </div>

          <div className="space-y-6 xl:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              <PersianMonthCalendar />
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Bell className="text-rose-500" size={18} />
                <h3 className="text-base font-black text-slate-900">
                  تحلیل هشدارها
                </h3>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-rose-50 p-4">
                  <div className="text-xs font-bold text-rose-700">
                    هشدارهای فعال
                  </div>
                  <div className="mt-2 text-2xl font-black text-rose-800">
                    {alertsCount}
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <div className="text-xs font-bold text-amber-700">
                    مراکز بحرانی
                  </div>
                  <div className="mt-2 text-2xl font-black text-amber-800">
                    {criticalShelters}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                  {alertsCount > 0
                    ? "چند هشدار فعال در سامانه ثبت شده است. پیشنهاد می‌شود وضعیت آن‌ها مرور و موارد بحرانی تعیین تکلیف شوند."
                    : "در حال حاضر هشدار فعال قابل توجهی ثبت نشده و وضعیت از منظر هشدارها پایدار است."}
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="text-violet-500" size={18} />
                <h3 className="text-base font-black text-slate-900">
                  جمع‌بندی مدیریتی
                </h3>
              </div>

              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  سامانه در حال حاضر{" "}
                  <span className="font-black text-slate-900">
                    {activeHalls}
                  </span>{" "}
                  سراي فعال و{" "}
                  <span className="font-black text-slate-900">
                    {activeShelters}
                  </span>{" "}
                  مرکز اسکان فعال را در پایش دارد.
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  ظرفیت کل ثبت‌شده برابر با{" "}
                  <span className="font-black text-slate-900">
                    {totalCapacity}
                  </span>{" "}
                  بوده که از این مقدار{" "}
                  <span className="font-black text-slate-900">
                    {occupiedCapacity}
                  </span>{" "}
                  مورد اشغال شده و{" "}
                  <span className="font-black text-slate-900">
                    {availableCapacity}
                  </span>{" "}
                  ظرفیت آزاد باقی مانده است.
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  شاخص آمادگی عملیاتی در سطح{" "}
                  <span className="font-black text-slate-900">
                    {severityLabel(readinessScore)}
                  </span>{" "}
                  قرار دارد و برای مدیریت بهتر، پایش کیفیت داده و کنترل مراکز
                  حساس باید ادامه یابد.
                </div>
              </div>
            </motion.section>
          </div>
        </section>
      </main>
    </div>
  );
}
