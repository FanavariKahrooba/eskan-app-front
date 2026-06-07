"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bed,
  ClipboardCheck,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const stats = [
  { label: "مدیریت سراها", value: "نقشه، ظرفیت، وضعیت فعال/غیرفعال" },
  { label: "فرآیند اسکان", value: "درخواست، بررسی، رزرو، تأیید نهایی" },
  { label: "خدمات تکمیلی", value: "وعده غذایی، گزارش و داشبورد مدیریتی" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_30%)]" />

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
            سامانه مستقل و داده‌مبنا
          </span>

          <h2 className="mt-6 text-3xl font-black leading-tight text-white md:text-5xl">
            از ثبت درخواست تا استقرار نهایی،
            <br />
            همه‌چیز در یک سامانه
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
            این سامانه امکان مشاهده سراهای محله، بررسی ظرفیت، ثبت درخواست، رزرو
            موقت ۳۰ دقیقه‌ای، تأیید نهایی، ثبت ورود و خروج مسافران و گزارش‌گیری
            مدیریتی را در یک بستر یکپارچه فراهم می‌کند.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#cta"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-orange-400"
            >
              درخواست دمو
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/10"
            >
              مشاهده امکانات
            </Link>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-xs text-zinc-500">{item.label}</div>
                <div className="mt-2 text-sm font-bold text-white">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
            <div className="relative rounded-[28px] border border-white/10 bg-zinc-900/80 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-sm text-zinc-400">
                    Shelter Capacity Dashboard
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-white">
                    کنترل ظرفیت و وضعیت استقرار
                  </div>
                </div>
                <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-300">
                  Live
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="relative min-h-[360px] rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <PanelStat title="ظرفیت کل" value="۳,۸۰۰ نفر" />
                    <PanelStat title="ظرفیت باقی‌مانده" value="۱,۲۴۰ نفر" />
                    <PanelStat title="در حال استقرار" value="۲,۵۶۰ نفر" />
                    <PanelStat title="رزروهای موقت" value="۸۶ مورد" />
                  </div>

                  <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="mb-4 text-sm font-bold text-white">
                      تفکیک ظرفیت
                    </div>
                    <Progress label="آقایان" value={72} />
                    <Progress label="بانوان" value={58} />
                    <Progress label="خانواده‌ها" value={81} />
                  </div>
                </div>

                <div className="space-y-4">
                  <InfoCard icon={<MapPin />} title="سراهای فعال" value="۳۸" />
                  <InfoCard
                    icon={<Users />}
                    title="مسافران ثبت‌شده"
                    value="۲,۵۶۰"
                  />
                  <InfoCard
                    icon={<Clock />}
                    title="رزرو موقت"
                    value="۳۰ دقیقه"
                  />
                  <InfoCard
                    icon={<ClipboardCheck />}
                    title="در انتظار بررسی"
                    value="۴۲"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-orange-400/20 bg-orange-500/10 p-2 text-orange-300">
          {icon}
        </div>
        <div>
          <div className="text-sm text-zinc-400">{title}</div>
          <div className="mt-1 text-sm font-bold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

function PanelStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-zinc-500">{title}</div>
      <div className="mt-2 text-xl font-black text-white">{value}</div>
    </div>
  );
}

function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-zinc-300">{label}</span>
        <span className="text-zinc-500">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
