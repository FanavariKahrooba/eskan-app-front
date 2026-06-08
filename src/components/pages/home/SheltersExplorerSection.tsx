"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  LayoutGrid,
  Loader2,
  Map as MapIcon,
  MapPinned,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";

const SHELTERS_EXPLORER_PATH = "/shelters";

/** همان شکل خام آیتم‌های API که SheltersExplorer هم مصرف می‌کند */
type ApiHallItem = {
  id: number | string;
  name?: string;
  info?: {
    total_capacity?: number | null;
    free_capacity?: number | null;
  } | null;
};

type ApiResponse = {
  data: ApiHallItem[];
};

type ExplorerStats = {
  totalShelters: number;
  totalCapacity: number;
  totalFree: number;
  preview: { name: string; status: "فعال" | "ظرفیت محدود" }[];
};

const fa = (value: number) =>
  value.toLocaleString("fa-IR", { maximumFractionDigits: 0 });

const num = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

async function fetchExplorerStats(): Promise<ExplorerStats> {
  const { data } = await axios.get<ApiResponse>(
    "/api/neighborhood-halls/shelter-explorer",
  );

  const list: ApiHallItem[] = Array.isArray(data?.data) ? data.data : [];

  const totalCapacity = list.reduce(
    (sum, item) => sum + num(item.info?.total_capacity),
    0,
  );
  const totalFree = list.reduce(
    (sum, item) => sum + num(item.info?.free_capacity),
    0,
  );

  // سه سرای اول برای نمایش در کارت پیش‌نمایش
  const preview = list.slice(0, 3).map((item) => {
    const total = num(item.info?.total_capacity);
    const free = num(item.info?.free_capacity);
    const isLimited = total > 0 && free / total <= 0.15;

    return {
      name: item.name?.trim() || "سرای محله",
      status: (isLimited ? "ظرفیت محدود" : "فعال") as "فعال" | "ظرفیت محدود",
    };
  });

  return {
    totalShelters: list.length,
    totalCapacity,
    totalFree,
    preview,
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const features = [
  {
    title: "جستجو و فیلتر",
    desc: "بر اساس منطقه، محله، جنسیت و نوع پذیرش سراها را پیدا کنید.",
    icon: Search,
  },
  {
    title: "نمای لیست و نقشه",
    desc: "سراها را به‌صورت فهرستی یا روی نقشه شهر مشاهده کنید.",
    icon: LayoutGrid,
  },
  {
    title: "ظرفیت لحظه‌ای",
    desc: "ظرفیت کل و ظرفیت خالی هر سرا را همان لحظه ببینید.",
    icon: Users,
  },
];

export default function SheltersExplorerSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["shelter-explorer-stats"],
    queryFn: fetchExplorerStats,
    staleTime: 60_000,
  });

  const stats: { label: string; value: string }[] = [
    {
      label: "سراهای فعال",
      value: data ? fa(data.totalShelters) : "—",
    },
    {
      label: "ظرفیت کل",
      value: data ? fa(data.totalCapacity) : "—",
    },
    {
      label: "ظرفیت خالی",
      value: data ? fa(data.totalFree) : "—",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-slate-300 bg-slate-100 dark:border-white/10 dark:bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* متن و معرفی */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
              <MapPinned className="h-4 w-4" />
              مشاهده سراهای فعال
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight text-slate-950 dark:text-white md:text-4xl">
              نزدیک‌ترین سرای فعال را پیدا کنید
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-zinc-400">
              از این بخش می‌توانید فهرست سراهای فعال محله را همراه با موقعیت
              مکانی تقریبی، ظرفیت و امکانات هر سرا مشاهده کنید و بر اساس منطقه،
              محله و نوع اسکان موردنیاز فیلتر نمایید.
            </p>

            <div className="mt-8 space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-4 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm shadow-slate-300/30 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20"
                  >
                    <div className="inline-flex shrink-0 rounded-xl border border-orange-300 bg-orange-100 p-2.5 text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-950 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-zinc-400">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link
              href={SHELTERS_EXPLORER_PATH}
              className="group mt-8 inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-600 bg-orange-600 px-6 py-3 text-sm font-extrabold text-white shadow-sm shadow-orange-500/30 transition hover:border-orange-500 hover:bg-orange-500 dark:border-orange-500 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-400"
            >
              مشاهده سراهای فعال
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            </Link>
          </motion.div>

          {/* کارت پیش‌نمایش */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="rounded-[32px] border border-slate-300 bg-slate-50/90 p-5 shadow-xl shadow-slate-300/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20"
          >
            <div className="rounded-[28px] border border-slate-300 bg-white p-5 dark:border-white/10 dark:bg-zinc-950/80">
              <div className="flex items-center justify-between border-b border-slate-300 pb-5 dark:border-white/10">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-zinc-300">
                  <MapIcon className="h-5 w-5 text-orange-800 dark:text-orange-300" />
                  نقشه و فهرست سراها
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
                  {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  {isLoading
                    ? "در حال دریافت"
                    : isError
                      ? "داده‌ها در دسترس نیست"
                      : "داده زنده"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-300 bg-slate-50 p-3 text-center shadow-sm shadow-slate-300/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20"
                  >
                    {isLoading ? (
                      <div className="mx-auto h-6 w-10 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                    ) : (
                      <p className="text-lg font-black text-slate-950 dark:text-white">
                        {stat.value}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-2xl border border-slate-300 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10" />
                          <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                        </div>
                        <div className="h-5 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
                      </div>
                    ))
                  : (data?.preview ?? []).map((shelter) => {
                      const isLimited = shelter.status === "ظرفیت محدود";

                      return (
                        <div
                          key={shelter.name}
                          className="flex items-center justify-between rounded-2xl border border-slate-300 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-orange-300 bg-orange-100 text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                              {shelter.name}
                            </span>
                          </div>
                          <span
                            className={
                              isLimited
                                ? "rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300"
                                : "rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                            }
                          >
                            {shelter.status}
                          </span>
                        </div>
                      );
                    })}

                {!isLoading &&
                  !isError &&
                  (data?.preview?.length ?? 0) === 0 && (
                    <p className="rounded-2xl border border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400">
                      در حال حاضر سرای فعالی ثبت نشده است.
                    </p>
                  )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
