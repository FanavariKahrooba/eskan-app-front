"use client";

import { motion } from "framer-motion";
import { BarChart3, Database, MapPin, Route, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function DualExperienceSection() {
  return (
    <section
      id="map"
      className="relative overflow-hidden border-b border-white/10 bg-zinc-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.08),transparent_35%)]" />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-2 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
            <Sparkles className="h-4 w-4" />
            نقشه و داده در یک سامانه
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
            هم مشاهده مکانی سراها،
            <br />
            هم مدیریت عملیاتی ظرفیت‌ها
          </h2>

          <p className="mt-6 text-base leading-8 text-zinc-400 md:text-lg">
            سامانه علاوه بر نمایش سراهای محله روی نقشه، وضعیت ظرفیت کل، ظرفیت
            خالی، ظرفیت اشغال‌شده، گروه‌های قابل پذیرش و وضعیت فعال یا غیرفعال
            هر سرا را به‌صورت آنلاین نمایش می‌دهد.
          </p>

          <div className="mt-8 space-y-4">
            <FeatureRow
              icon={<MapPin className="h-5 w-5" />}
              title="لایه مکانی سراها"
              desc="ثبت موقعیت جغرافیایی، آدرس، منطقه، ناحیه و نمایش رنگی وضعیت ظرفیت روی نقشه."
            />
            <FeatureRow
              icon={<Database className="h-5 w-5" />}
              title="لایه داده ظرفیت"
              desc="تعریف ظرفیت تفکیکی برای آقایان، بانوان، متأهلین، مجردها و خانواده‌ها."
            />
            <FeatureRow
              icon={<Route className="h-5 w-5" />}
              title="جریان درخواست تا استقرار"
              desc="از ثبت درخواست تا بررسی، رزرو موقت، تأیید نهایی و ثبت رسمی اسکان."
            />
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.1 }}
          className="grid gap-5"
        >
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  پنل کنترل ظرفیت
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  مناسب برای مشاهده لحظه‌ای وضعیت سراها و تعداد افراد مستقر
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MiniCard title="ظرفیت کل" value="۳,۸۰۰ نفر" />
              <MiniCard title="ظرفیت خالی" value="۱,۲۴۰ نفر" />
              <MiniCard title="سراهای فعال" value="۳۸ سرا" />
              <MiniCard title="درخواست‌های باز" value="۴۲ درخواست" />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-xl font-extrabold text-white">
              نمایش وضعیت روی نقشه
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              رنگ‌بندی وضعیت سراها بر اساس ظرفیت باقی‌مانده و تکمیل ظرفیت
            </p>

            <div className="relative mt-5 min-h-[220px] rounded-3xl border border-white/10 bg-zinc-950/70 p-4">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:34px_34px]" />
              <Dot top="20%" right="20%" text="خالی" color="emerald" />
              <Dot top="45%" right="55%" text="محدود" color="orange" />
              <Dot top="66%" right="32%" text="تکمیل" color="red" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mt-1 rounded-xl border border-orange-400/20 bg-orange-500/10 p-2 text-orange-300">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-zinc-400">{desc}</p>
      </div>
    </div>
  );
}

function MiniCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <div className="text-sm text-zinc-500">{title}</div>
      <div className="mt-2 text-sm font-bold text-white">{value}</div>
    </div>
  );
}

function Dot({
  top,
  right,
  text,
  color,
}: {
  top: string;
  right: string;
  text: string;
  color: "emerald" | "orange" | "red";
}) {
  const colors = {
    emerald: "bg-emerald-500/10 border-emerald-400/20 text-emerald-300",
    orange: "bg-orange-500/10 border-orange-400/20 text-orange-300",
    red: "bg-red-500/10 border-red-400/20 text-red-300",
  };

  return (
    <div
      className={`absolute rounded-full border px-4 py-2 text-xs font-bold ${colors[color]}`}
      style={{ top, right }}
    >
      {text}
    </div>
  );
}
