"use client";

import { motion } from "framer-motion";
import {
  Clock3,
  MapPin,
  Sparkles,
  Utensils,
  Users,
  Warehouse,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

const mealRows = [
  { meal: "صبحانه", location: "سرای محله گلستان", count: "۸۴۰ نفر" },
  { meal: "ناهار", location: "سالن توزیع ناحیه ۲", count: "۲,۱۸۰ نفر" },
  { meal: "شام", location: "سرای محله بهار", count: "۲,۵۶۰ نفر" },
];

export default function KitchenSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.08),transparent_30%)]" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="order-2 lg:order-1"
        >
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="rounded-[28px] border border-white/10 bg-zinc-950/75 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <div className="text-sm text-zinc-400">Meal Management</div>
                  <h3 className="mt-1 text-xl font-extrabold text-white">
                    برنامه‌ریزی وعده‌های غذایی
                  </h3>
                </div>
                <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
                  <Utensils className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {mealRows.map((row) => (
                  <div
                    key={row.meal}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-white">
                          {row.meal}
                        </h4>
                        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                          <MapPin className="h-4 w-4 text-orange-300" />
                          {row.location}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm font-bold text-white">
                        {row.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <MealStat
                  icon={<Users className="h-4 w-4" />}
                  title="جمع وعده امروز"
                  value="۷,۵۸۰"
                />
                <MealStat
                  icon={<Warehouse className="h-4 w-4" />}
                  title="محل‌های توزیع"
                  value="۱۴"
                />
                <MealStat
                  icon={<Clock3 className="h-4 w-4" />}
                  title="بازه‌های سرویس"
                  value="۳ وعده"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="order-1 flex flex-col justify-center lg:order-2"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
            <Sparkles className="h-4 w-4" />
            تغذیه و خدمات جانبی اسکان
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
            مدیریت وعده‌های غذایی
            <br />
            بر اساس تعداد افراد مستقر
          </h2>

          <p className="mt-6 text-base leading-8 text-zinc-400 md:text-lg">
            سامانه علاوه بر مدیریت ظرفیت و استقرار، امکان تعریف محل توزیع
            صبحانه، ناهار و شام، محاسبه تعداد وعده موردنیاز و پایش خدمات تغذیه
            برای سراهای مختلف را نیز فراهم می‌کند.
          </p>

          <div className="mt-8 space-y-4">
            <Feature
              icon={<Utensils className="h-5 w-5" />}
              title="تعریف محل توزیع غذا"
              desc="انتخاب محل سرویس‌دهی برای هر وعده و هر سرا یا ناحیه."
            />
            <Feature
              icon={<Users className="h-5 w-5" />}
              title="محاسبه خودکار تعداد وعده"
              desc="محاسبه بر اساس افراد مستقر، رزروهای قطعی و گروه‌های هدف."
            />
            <Feature
              icon={<Clock3 className="h-5 w-5" />}
              title="پایش روزانه خدمات"
              desc="کنترل وعده‌های مصرف‌شده و برنامه‌ریزی بهتر برای روزهای بعد."
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Feature({
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

function MealStat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <div className="mb-2 text-orange-300">{icon}</div>
      <div className="text-xs text-zinc-500">{title}</div>
      <div className="mt-2 text-sm font-bold text-white">{value}</div>
    </div>
  );
}
