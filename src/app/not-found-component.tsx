"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
  ClipboardList,
  MapPinned,
  FileText,
  Building2,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

const CONTENT = {
  title: "404",
  eyebrow: "سامانه ثبت درخواست اسکان سراهای محله",
  headline: "صفحه موردنظر پیدا نشد",
  description:
    "ممکن است آدرس واردشده اشتباه باشد، صفحه جابه‌جا شده باشد یا این بخش در حال حاضر در سامانه فعال نباشد. می‌توانید به صفحه اصلی بازگردید یا از مسیرهای پرکاربرد زیر استفاده کنید.",
  searchPlaceholder: "جستجو در ثبت درخواست، پیگیری، سراهای فعال یا راهنما...",
  buttons: {
    home: "بازگشت به صفحه اصلی",
    back: "بازگشت به صفحه قبل",
  },
  cards: [
    {
      title: "ثبت درخواست اسکان",
      desc: "اگر نیاز به اسکان موقت دارید، درخواست جدید خود را ثبت کنید.",
      icon: ClipboardList,
      href: "/request/new",
    },
    {
      title: "پیگیری درخواست",
      desc: "با کد رهگیری، وضعیت درخواست ثبت‌شده خود را مشاهده کنید.",
      icon: Search,
      href: "/request/track",
    },
    {
      title: "سراهای فعال",
      desc: "فهرست سراهای فعال و اطلاعات ظرفیت آن‌ها را مشاهده کنید.",
      icon: MapPinned,
      href: "/shelters",
    },
    {
      title: "راهنمای مدارک",
      desc: "مدارک لازم و اطلاعات موردنیاز پیش از مراجعه را بررسی کنید.",
      icon: FileText,
      href: "/guide/documents",
    },
  ],
  footer: "سامانه مدیریت ظرفیت، درخواست و پذیرش",
};

const floatingVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 2, -2, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 text-slate-900 dark:bg-zinc-950 dark:text-white"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:72px_72px] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_28%)]" />

      {/* Glows */}
      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-400/15 blur-[110px]" />
      <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-sky-400/10 blur-[110px]" />

      {/* Floating Icons */}
      {[Building2, ClipboardList, MapPinned].map((Icon, i) => (
        <motion.div
          key={i}
          variants={floatingVariants}
          animate="animate"
          className="absolute hidden rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:block"
          style={{
            top: `${18 + i * 16}%`,
            left: i === 1 ? "auto" : `${8 + i * 6}%`,
            right: i === 1 ? "10%" : "auto",
          }}
        >
          <Icon className="h-8 w-8 text-orange-700 dark:text-orange-300" />
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="rounded-2xl border border-orange-600 bg-orange-600 p-3 text-white shadow-sm shadow-orange-500/30">
            <Home className="h-6 w-6" />
          </div>

          <div className="text-right">
            <p className="text-sm font-black text-slate-950 dark:text-white">
              {CONTENT.eyebrow}
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              مدیریت ظرفیت، درخواست و پذیرش
            </p>
          </div>
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative text-[110px] font-black leading-none tracking-[-6px] text-slate-200 dark:text-white/10 md:text-[200px]"
        >
          <span className="absolute left-2 top-1 text-orange-300/40 blur-sm dark:text-orange-500/30">
            404
          </span>

          <span className="relative bg-gradient-to-b from-slate-950 via-orange-700 to-orange-500 bg-clip-text text-transparent dark:from-white dark:via-orange-200 dark:to-orange-400">
            {CONTENT.title}
          </span>
        </motion.h1>

        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-5xl">
          {CONTENT.headline}
        </h2>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-zinc-400 md:text-lg">
          {CONTENT.description}
        </p>

        {/* Search style box */}
        <div className="mt-10 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
          <Search className="h-5 w-5 text-orange-700 dark:text-orange-300" />
          <span className="flex-1 text-right text-sm text-slate-500 dark:text-zinc-500">
            {CONTENT.searchPlaceholder}
          </span>
        </div>

        {/* Cards */}
        <div className="mt-12 grid w-full max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {CONTENT.cards.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-3xl border border-slate-300 bg-white p-6 text-right shadow-sm shadow-slate-300/30 transition hover:-translate-y-1 hover:border-orange-300 hover:bg-orange-50 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20 dark:hover:bg-white/[0.07]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-300 bg-orange-100 text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
                  <Icon className="h-7 w-7" />
                </div>

                <div className="mt-5 text-lg font-extrabold text-slate-950 dark:text-white">
                  {item.title}
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-zinc-400">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-orange-600 bg-orange-600 px-7 py-4 font-extrabold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-500"
          >
            <Home className="h-5 w-5" />
            {CONTENT.buttons.home}
          </Link>

          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 py-4 font-bold text-slate-800 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:text-orange-300"
          >
            {CONTENT.buttons.back}
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-16 text-xs tracking-[0.2em] text-slate-400 dark:text-zinc-600">
          {CONTENT.footer}
        </p>
      </div>
    </main>
  );
}
