"use client";

import Link from "next/link";
import { GiTallBridge } from "react-icons/gi";
import {
  ArrowRight,
  Home,
  Search,
  Database,
  Radar,
  Cuboid,
  Activity,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

const CONTENT = {
  title: "404",
  headline: "این مسیر در مدل دیجیتال پل پیدا نشد",
  description:
    "احتمالاً آدرس واردشده اشتباه است، صفحه جابه‌جا شده یا این بخش هنوز در چارچوب دوقلوی دیجیتال تعریف نشده است. می‌توانید به صفحه اصلی برگردید و مسیرهای اصلی سامانه را بررسی کنید.",
  searchPlaceholder:
    "جستجو در اجزای پل، داده‌های بازرسی، حسگرها یا گزارش‌ها...",
  buttons: {
    home: "بازگشت به صفحه اصلی",
    back: "صفحه قبلی",
  },
  cards: [
    {
      title: "مدل سه‌بعدی پل",
      desc: "نمایش و بررسی اجزای سازه‌ای در محیط دیجیتال",
      icon: Cuboid,
    },
    {
      title: "داده‌های بازرسی",
      desc: "ثبت و مرور اطلاعات Visual، IRT و GPR",
      icon: Radar,
    },
    {
      title: "پایش و تصمیم‌سازی",
      desc: "تحلیل وضعیت، هشدارها و برنامه‌ریزی نگهداری",
      icon: Activity,
    },
  ],
  footer: "DIGITAL TWIN FRAMEWORK FOR BRIDGES",
};

const floatingVariants: Variants = {
  animate: {
    y: [0, -12, 0],
    rotate: [0, 2, -2, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050506] text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.05]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-soft-light" />

      {/* Glows */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[120px]" />

      {/* Floating Icons */}
      {[GiTallBridge, Database, Radar].map((Icon, i) => (
        <motion.div
          key={i}
          variants={floatingVariants}
          animate="animate"
          className="absolute hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:block"
          style={{
            top: `${20 + i * 15}%`,
            left: i === 1 ? "auto" : `${10 + i * 5}%`,
            right: i === 1 ? "12%" : "auto",
          }}
        >
          <Icon className="h-8 w-8 text-orange-300" />
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-20 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-3"
        >
          <div className="rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 p-3 shadow-2xl shadow-orange-500/30">
            <GiTallBridge className="h-6 w-6 text-white" />
          </div>

          <div>
            <p className="text-right text-sm font-bold">Bridge Digital Twin</p>
            <p className="text-xs text-white/50">
              Framework for Bridge Management
            </p>
          </div>
        </motion.div>

        {/* 404 Glitch */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative text-[120px] font-black leading-none tracking-[-8px] md:text-[220px]"
        >
          <span className="absolute left-2 top-1 text-red-500/40 blur-sm">
            404
          </span>

          <span className="relative bg-gradient-to-b from-white via-orange-200 to-red-400 bg-clip-text text-transparent">
            {CONTENT.title}
          </span>
        </motion.h1>

        <h2 className="mt-2 text-3xl font-black md:text-5xl">
          {CONTENT.headline}
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          {CONTENT.description}
        </p>

        {/* Search Bar */}
        <div className="mt-10 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-2xl">
          <Search className="h-5 w-5 text-orange-300" />
          <span className="flex-1 text-right text-sm text-zinc-500">
            {CONTENT.searchPlaceholder}
          </span>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid w-full max-w-4xl gap-4 md:grid-cols-3">
          {CONTENT.cards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-orange-500/30 hover:bg-white/[0.06]"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-orange-300">
                  <Icon className="h-7 w-7" />
                </div>

                <div className="mt-5 text-lg font-bold text-white">
                  {item.title}
                </div>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 font-bold text-white transition hover:scale-[1.03]"
          >
            <Home className="h-5 w-5" />
            {CONTENT.buttons.home}
          </Link>

          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-bold text-white transition hover:bg-white/10"
          >
            {CONTENT.buttons.back}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-16 text-xs uppercase tracking-[0.3em] text-zinc-600">
          {CONTENT.footer}
        </p>
      </div>
    </main>
  );
}
