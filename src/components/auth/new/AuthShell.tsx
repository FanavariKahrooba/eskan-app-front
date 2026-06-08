// components/auth/AuthShell.tsx
"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Home, ShieldCheck } from "lucide-react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AuthShell({
  badge,
  children,
}: {
  badge: string;
  children: ReactNode;
}) {
  return (
    <section
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-stone-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_32%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="hidden lg:block"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
              <Home className="h-4 w-4" />
              سامانه مدیریت ظرفیت اسکان سراهای محله
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">
              ورود به پنل مدیریت سامانه
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-700 dark:text-zinc-300">
              برای دسترسی به پنل، شماره موبایل ثبت‌شده خود را وارد کنید. کد
              یکبار مصرف از طریق پیامک برایتان ارسال می‌شود.
            </p>

            <div className="mt-8 flex max-w-lg items-start gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-500/10">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
              <p className="text-sm leading-7 text-slate-700 dark:text-zinc-300">
                ورود تنها برای کاربران دارای نقش مجاز امکان‌پذیر است. اطلاعات
                شما به‌صورت رمزنگاری‌شده منتقل می‌شود.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="mx-auto w-full max-w-md rounded-[32px] border border-slate-300 bg-slate-50/90 p-5 shadow-xl shadow-slate-300/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20"
          >
            <div className="rounded-[28px] border border-slate-300 bg-white p-6 dark:border-white/10 dark:bg-zinc-950/80">
              <span className="inline-flex rounded-full border border-orange-300 bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
                {badge}
              </span>
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
