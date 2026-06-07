"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bed,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const capabilities = [
  {
    icon: MapPin,
    title: "نمایش سراها روی نقشه",
    desc: "مشاهده موقعیت سراهای محله، وضعیت فعال بودن و ظرفیت باقی‌مانده هر سرا به‌صورت مکانی.",
  },
  {
    icon: Users,
    title: "مدیریت متقاضیان و خانواده‌ها",
    desc: "ثبت اطلاعات مسافران، اعضای خانواده، نوع اسکان و سوابق ورود، خروج، تمدید و انتقال.",
  },
  {
    icon: Clock,
    title: "رزرو موقت ۳۰ دقیقه‌ای",
    desc: "رزرو ظرفیت پس از تأیید اولیه و آزادسازی خودکار در صورت عدم تأیید نهایی.",
  },
  {
    icon: ShieldCheck,
    title: "گردش کار تأیید",
    desc: "بررسی درخواست‌ها توسط ناظر، مدیر محله یا کاربران مجاز با ثبت کامل سوابق تصمیم‌گیری.",
  },
];

const workflow = [
  "مشاهده سراها",
  "ثبت درخواست",
  "بررسی مسئول",
  "رزرو موقت",
  "تأیید نهایی",
];

export default function HeroSection2() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-white/10 bg-zinc-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.13),transparent_32%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1 text-sm text-orange-300"
          >
            <Sparkles className="h-4 w-4" />
            پلتفرم متمرکز مدیریت اسکان محلی
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl"
          >
            مدیریت هوشمند ظرفیت اسکان
            <br />
            <span className="bg-gradient-to-l from-orange-300 to-orange-500 bg-clip-text text-transparent">
              در سراهای محله
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-8 text-zinc-400 md:text-lg"
          >
            سامانه‌ای مستقل برای نمایش سراهای محله روی نقشه، ثبت درخواست اسکان،
            کنترل آنلاین ظرفیت، رزرو موقت، تأیید نهایی، ثبت استقرار و مدیریت
            وعده‌های غذایی مسافران.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 grid gap-3 sm:grid-cols-2"
          >
            <MiniPoint text="کنترل لحظه‌ای ظرفیت خالی و اشغال‌شده" />
            <MiniPoint text="تفکیک آقایان، بانوان، متأهلین و خانواده‌ها" />
            <MiniPoint text="کارتابل بررسی و تأیید چندسطحی" />
            <MiniPoint text="گزارش مدیریتی منطقه، ناحیه، محله و ستاد" />
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,146,60,0.12),transparent_40%,rgba(255,255,255,0.04))]" />

            <div className="relative rounded-[28px] border border-white/10 bg-zinc-950/70 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Accommodation Console</p>
                  <h3 className="mt-1 text-xl font-black text-white">
                    نقشه ظرفیت سراهای محله
                  </h3>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300">
                  آنلاین
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      نمای مکانی سراها
                    </span>
                    <MapPin className="h-5 w-5 text-orange-300" />
                  </div>

                  <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:34px_34px]" />

                    <MapDot
                      top="18%"
                      right="18%"
                      label="سرای الف"
                      color="emerald"
                    />
                    <MapDot
                      top="45%"
                      right="52%"
                      label="سرای ب"
                      color="orange"
                    />
                    <MapDot top="65%" right="28%" label="سرای ج" color="red" />
                    <MapDot
                      top="32%"
                      right="75%"
                      label="سرای د"
                      color="emerald"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <StatusCard
                    icon={<Building2 className="h-5 w-5" />}
                    label="سراهای فعال"
                    value="۳۸ سرا"
                  />
                  <StatusCard
                    icon={<Bed className="h-5 w-5" />}
                    label="ظرفیت خالی"
                    value="۱,۲۴۰ نفر"
                  />
                  <StatusCard
                    icon={<Database className="h-5 w-5" />}
                    label="درخواست‌های امروز"
                    value="۲۸۶ درخواست"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">
                    فرآیند اصلی سامانه
                  </h4>
                  <ArrowRight className="h-4 w-4 text-orange-300" />
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  {workflow.map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-xs font-bold text-zinc-300">
                        {item}
                      </div>
                      {index !== workflow.length - 1 && (
                        <ArrowRight className="hidden h-4 w-4 text-zinc-600 md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 hidden rounded-3xl border border-orange-400/20 bg-orange-500/10 p-5 backdrop-blur-xl lg:block">
            <p className="text-sm font-bold text-orange-300">
              کنترل ظرفیت به‌صورت لحظه‌ای
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              هر سرا دارای ظرفیت، پرونده و وضعیت مستقل است.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:border-orange-400/30 hover:bg-white/[0.07]"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MiniPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-300" />
      {text}
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <div className="mb-3 inline-flex rounded-xl border border-orange-400/20 bg-orange-500/10 p-2 text-orange-300">
        {icon}
      </div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-white">{value}</p>
    </div>
  );
}

function MapDot({
  top,
  right,
  label,
  color,
}: {
  top: string;
  right: string;
  label: string;
  color: "emerald" | "orange" | "red";
}) {
  const colors = {
    emerald: "border-emerald-400/30 bg-emerald-500/20 text-emerald-300",
    orange: "border-orange-400/30 bg-orange-500/20 text-orange-300",
    red: "border-red-400/30 bg-red-500/20 text-red-300",
  };

  return (
    <div
      className={`absolute rounded-full border px-3 py-1 text-xs font-bold ${colors[color]}`}
      style={{ top, right }}
    >
      {label}
    </div>
  );
}
