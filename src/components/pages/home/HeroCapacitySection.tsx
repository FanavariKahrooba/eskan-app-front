// components/home/HeroCapacitySection.tsx
"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Home,
  Search,
  Users,
} from "lucide-react";
import { fetchShelters, type Shelter } from "@/lib/shelters";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fmt = (n: number) => n.toLocaleString("fa-IR");

type CapacityStat = {
  title: string;
  value: string;
  icon: typeof Users;
};

function buildCapacityStats(shelters: Shelter[]): CapacityStat[] {
  const sumFreeBy = (g: Shelter["genderType"]) =>
    shelters
      .filter((s) => s.genderType === g)
      .reduce((acc, s) => acc + s.freeCapacity, 0);

  const menFree = sumFreeBy("men");
  const womenFree = sumFreeBy("women");
  const familyFree = sumFreeBy("family");
  const activeCount = shelters.filter((s) => s.status === "active").length;

  return [
    { title: "ظرفیت خالی آقایان", value: `${fmt(menFree)} نفر`, icon: Users },
    { title: "ظرفیت خالی بانوان", value: `${fmt(womenFree)} نفر`, icon: Users },
    {
      title: "ظرفیت خالی خانواده",
      value: `${fmt(familyFree)} خانوار`,
      icon: Home,
    },
    { title: "سراهای فعال", value: `${fmt(activeCount)} سرا`, icon: Building2 },
  ];
}

export default function HeroCapacitySection() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["shelters", "hero-summary"],
    queryFn: () => fetchShelters(),
    staleTime: 60_000,
  });

  const capacityStats = useMemo(() => buildCapacityStats(data ?? []), [data]);

  return (
    <section className="relative overflow-hidden border-b border-slate-300 bg-gradient-to-br from-slate-100 via-stone-100 to-orange-50 dark:border-white/10 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
              <Home className="h-4 w-4" />
              سامانه مدیریت ظرفیت اسکان سراهای محله
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-6xl">
              ثبت، بررسی و پیگیری درخواست اسکان موقت
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 dark:text-zinc-300 md:text-lg">
              این سامانه برای مدیریت ظرفیت سراهای محله، ثبت درخواست اسکان، بررسی
              وضعیت ظرفیت و پیگیری مراحل پذیرش طراحی شده است. مراجعه‌کنندگان
              می‌توانند درخواست خود را ثبت کرده و وضعیت آن را به‌صورت آنلاین
              مشاهده کنند.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request/new"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-600 bg-orange-600 px-6 py-3 text-sm font-extrabold text-white shadow-sm shadow-orange-500/30 transition hover:border-orange-500 hover:bg-orange-500 dark:border-orange-500 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-400"
              >
                ثبت درخواست اسکان
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <Link
                href="/request/track"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-extrabold text-slate-800 shadow-sm shadow-slate-300/40 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-black/20 dark:hover:bg-white/10 dark:hover:text-orange-300"
              >
                پیگیری درخواست
                <Search className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-orange-300 bg-white/90 p-4 text-sm leading-7 text-slate-700 shadow-sm shadow-slate-300/30 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:shadow-black/20">
              <strong className="text-orange-800 dark:text-orange-300">
                توجه:
              </strong>{" "}
              برای ثبت درخواست، وارد کردن اطلاعات هویتی، تعداد افراد همراه و نوع
              اسکان موردنیاز الزامی است.
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="rounded-[32px] border border-slate-300 bg-slate-50/90 p-5 shadow-xl shadow-slate-300/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20"
          >
            <div className="rounded-[28px] border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-zinc-950/80">
              <div className="flex items-center justify-between border-b border-slate-300 pb-5 dark:border-white/10">
                <div>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    وضعیت امروز
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold text-slate-950 dark:text-white">
                    خلاصه ظرفیت سراها
                  </h2>
                </div>
                <div className="rounded-2xl border border-orange-300 bg-orange-100 p-3 text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>

              {isError ? (
                <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-rose-300 bg-rose-50/60 p-6 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    دریافت آمار ظرفیت ناموفق بود.
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="rounded-full border border-rose-300 px-4 py-1.5 text-sm text-rose-600 transition hover:bg-rose-100 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    تلاش دوباره
                  </button>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {(isLoading
                    ? (Array.from({ length: 4 }) as undefined[])
                    : capacityStats
                  ).map((item, i) => {
                    if (isLoading || !item) {
                      return (
                        <div
                          key={i}
                          className="animate-pulse rounded-2xl border border-slate-300 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                        >
                          <div className="mb-4 h-9 w-9 rounded-xl bg-slate-200 dark:bg-white/10" />
                          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
                          <div className="mt-2 h-5 w-16 rounded bg-slate-200 dark:bg-white/10" />
                        </div>
                      );
                    }

                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-slate-300 bg-slate-50 p-4 shadow-sm shadow-slate-300/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20"
                      >
                        <div className="mb-4 inline-flex rounded-xl border border-orange-300 bg-orange-100 p-2 text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          {item.title}
                        </p>
                        <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-500/10">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-300">
                      ظرفیت‌ها به‌صورت دوره‌ای به‌روزرسانی می‌شوند
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-zinc-300">
                      ظرفیت نمایش‌داده‌شده ممکن است پس از بررسی درخواست‌ها و
                      پذیرش نهایی تغییر کند.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
