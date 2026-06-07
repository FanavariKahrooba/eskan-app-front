"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Bed,
  Building2,
  Clock,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function LiveDashboardSection() {
  return (
    <section
      id="dashboard"
      className="relative overflow-hidden border-b border-white/10 bg-zinc-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.12),transparent_30%)]" />

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionTitle
          badge="داشبورد مدیریتی"
          title="نمای زنده از ظرفیت، استقرار و خدمات اسکان"
          desc="مدیران می‌توانند وضعیت ظرفیت‌ها، تعداد افراد مستقر، درخواست‌های باز، رزروهای موقت و نیاز وعده‌های غذایی را به‌صورت لحظه‌ای مشاهده کنند."
        />

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          >
            <div className="rounded-[28px] border border-white/10 bg-zinc-950/70 p-5">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-zinc-400">
                    Operational Dashboard
                  </div>
                  <h3 className="mt-1 text-2xl font-extrabold text-white">
                    وضعیت آنلاین سراهای محله
                  </h3>
                </div>
                <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-300">
                  به‌روزرسانی لحظه‌ای
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="سراهای فعال"
                  value="۳۸"
                  icon={<Building2 className="h-5 w-5" />}
                />
                <StatCard
                  title="افراد مستقر"
                  value="۲,۵۶۰"
                  icon={<Users className="h-5 w-5" />}
                />
                <StatCard
                  title="ظرفیت خالی"
                  value="۱,۲۴۰"
                  icon={<Bed className="h-5 w-5" />}
                />
                <StatCard
                  title="رزرو موقت"
                  value="۸۶"
                  icon={<Clock className="h-5 w-5" />}
                />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-zinc-400">
                        Occupancy Trend
                      </div>
                      <div className="mt-1 text-lg font-bold text-white">
                        روند استقرار در ۷ دوره اخیر
                      </div>
                    </div>
                    <BarChart3 className="h-5 w-5 text-orange-300" />
                  </div>

                  <div className="mt-6 flex h-48 items-end gap-3">
                    {[44, 52, 61, 58, 73, 68, 82].map((h, i) => (
                      <div key={i} className="flex-1">
                        <div
                          className="rounded-t-2xl bg-gradient-to-t from-orange-500 to-orange-300"
                          style={{ height: `${h * 1.6}px` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                    <span>۷ بازه اخیر</span>
                    <span>قابل استفاده برای تصمیم‌گیری ظرفیت</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-zinc-400">Capacity Usage</div>
                      <div className="mt-1 text-lg font-bold text-white">
                        درصد اشغال بر اساس گروه
                      </div>
                    </div>
                    <Users className="h-5 w-5 text-orange-300" />
                  </div>

                  <div className="mt-6 space-y-4">
                    <ProgressRow label="آقایان" value={72} />
                    <ProgressRow label="بانوان" value={58} />
                    <ProgressRow label="خانواده‌ها" value={81} />
                    <ProgressRow label="رزروهای موقت" value={36} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.08 }}
            className="space-y-4"
          >
            <SideCard
              title="هشدارهای فعال"
              icon={<AlertTriangle className="h-5 w-5 text-orange-300" />}
              items={[
                "ظرفیت سرای منطقه ۲ در حال تکمیل است",
                "۱۲ رزرو موقت کمتر از ۱۰ دقیقه تا انقضا دارند",
                "نیاز به افزایش محل توزیع شام برای ۳ سرا",
              ]}
            />
            <SideCard
              title="آخرین فعالیت‌ها"
              icon={<Clock className="h-5 w-5 text-orange-300" />}
              items={[
                "ثبت ورود ۲۴ مسافر در سرای محله الف",
                "تأیید نهایی ۱۸ درخواست توسط مدیر محله",
                "آزادسازی خودکار ۶ رزرو منقضی‌شده",
              ]}
            />
            <SideCard
              title="وعده‌های غذایی امروز"
              icon={<Utensils className="h-5 w-5 text-orange-300" />}
              items={[
                "صبحانه: ۲,۱۲۰ نفر",
                "ناهار: ۲,۴۸۰ نفر",
                "شام: ۲,۵۶۰ نفر",
              ]}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">{title}</div>
        <div className="text-orange-300">{icon}</div>
      </div>
      <div className="mt-3 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
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

function SideCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-extrabold text-white">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({
  badge,
  title,
  desc,
}: {
  badge: string;
  title: string;
  desc?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto mb-14 max-w-3xl text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
        <Sparkles className="h-4 w-4" />
        {badge}
      </span>
      <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
        {title}
      </h2>
      {desc && (
        <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
          {desc}
        </p>
      )}
    </motion.div>
  );
}
