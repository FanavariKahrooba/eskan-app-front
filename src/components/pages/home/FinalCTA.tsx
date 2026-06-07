"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3, MapPin, Sparkles, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function FinalCTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.14),transparent_35%)]" />

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-14"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,146,60,0.08),transparent_45%,rgba(255,255,255,0.03))]" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
              <Sparkles className="h-4 w-4" />
              آماده راه‌اندازی سامانه مدیریت اسکان؟
            </span>

            <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">
              یک بستر متمرکز برای مدیریت ظرفیت،
              <br />
              استقرار و خدمات سراهای محله
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
              با این سامانه، فرآیند ثبت درخواست، تخصیص ظرفیت، تأیید نهایی، کنترل
              آنلاین استقرار، مدیریت وعده‌های غذایی و گزارش‌گیری مدیریتی در یک
              پلتفرم واحد انجام می‌شود.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#home"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
              >
                مشاهده معرفی سامانه
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                مشاهده امکانات
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <InfoMiniCard
                icon={<MapPin className="h-5 w-5" />}
                title="نقشه سراهای محله"
                desc="نمایش موقعیت، ظرفیت و وضعیت هر سرا به‌صورت آنلاین."
              />
              <InfoMiniCard
                icon={<Users className="h-5 w-5" />}
                title="مدیریت مسافران"
                desc="ثبت درخواست، خانواده، ورود، خروج، تمدید و انتقال."
              />
              <InfoMiniCard
                icon={<BarChart3 className="h-5 w-5" />}
                title="داشبورد مدیریتی"
                desc="گزارش‌های لحظه‌ای برای محله، ناحیه، منطقه و ستاد."
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoMiniCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-4 text-right">
      <div className="mb-3 inline-flex rounded-xl border border-orange-400/20 bg-orange-500/10 p-2 text-orange-300">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-zinc-400">{desc}</p>
    </div>
  );
}
