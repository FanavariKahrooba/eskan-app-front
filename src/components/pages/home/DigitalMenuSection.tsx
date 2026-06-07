"use client";

import { motion } from "framer-motion";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  Clock3,
  Filter,
  MapPinned,
  Search,
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

const filters = [
  "منطقه",
  "ناحیه",
  "نوع متقاضی",
  "ظرفیت خالی",
  "وضعیت سرا",
  "خانواده / مجرد",
];

const shelters = [
  {
    name: "سرای محله گلستان",
    zone: "منطقه ۲",
    status: "فعال",
    capacity: "۴۸ نفر خالی",
    type: "خانواده و بانوان",
    color: "emerald",
  },
  {
    name: "سرای محله بهار",
    zone: "منطقه ۴",
    status: "ظرفیت محدود",
    capacity: "۱۲ نفر خالی",
    type: "آقایان مجرد",
    color: "orange",
  },
  {
    name: "سرای محله امید",
    zone: "منطقه ۱",
    status: "تکمیل ظرفیت",
    capacity: "۰ نفر",
    type: "خانواده",
    color: "red",
  },
];

export default function DigitalMenuSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-white/[0.02]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.08),transparent_30%)]" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col justify-center"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
            <Sparkles className="h-4 w-4" />
            جستجو و انتخاب سریع سرا
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
            پیدا کردن سرای مناسب
            <br />
            بر اساس ظرفیت و نوع اسکان
          </h2>

          <p className="mt-6 text-base leading-8 text-zinc-400 md:text-lg">
            کاربران و اپراتورها می‌توانند سراهای محله را بر اساس منطقه، نوع
            متقاضی، تعداد نفرات، وضعیت ظرفیت و فعال بودن سرا جستجو و فیلتر کنند
            تا مناسب‌ترین گزینه برای اسکان انتخاب شود.
          </p>

          <div className="mt-8 space-y-4">
            <Item
              icon={<Search className="h-5 w-5" />}
              title="جستجوی سریع"
              desc="جستجو بر اساس نام سرا، منطقه، ناحیه یا آدرس."
            />
            <Item
              icon={<Filter className="h-5 w-5" />}
              title="فیلترهای کاربردی"
              desc="فیلتر وضعیت ظرفیت، نوع متقاضی، خانواده یا مجرد و ظرفیت باقی‌مانده."
            />
            <Item
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="انتخاب آگاهانه"
              desc="نمایش وضعیت دقیق هر سرا پیش از ثبت درخواست اسکان."
            />
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.08 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="rounded-[28px] border border-white/10 bg-zinc-950/75 p-5">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-zinc-400">Shelter Finder</div>
                  <h3 className="mt-1 text-xl font-extrabold text-white">
                    جستجوی سراهای محله
                  </h3>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400">
                  <Search className="h-4 w-4" />
                  جستجوی نام یا منطقه...
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {filters.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {shelters.map((item) => (
                  <ShelterCard key={item.name} {...item} />
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <MiniStat
                  icon={<Building2 className="h-4 w-4" />}
                  title="سراهای قابل انتخاب"
                  value="۳۸"
                />
                <MiniStat
                  icon={<BedDouble className="h-4 w-4" />}
                  title="ظرفیت خالی"
                  value="۱,۲۴۰"
                />
                <MiniStat
                  icon={<Users className="h-4 w-4" />}
                  title="درخواست باز"
                  value="۴۲"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Item({
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

function ShelterCard({ name, zone, status, capacity, type, color }: any) {
  const colors: any = {
    emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    orange: "border-orange-400/20 bg-orange-500/10 text-orange-300",
    red: "border-red-400/20 bg-red-500/10 text-red-300",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-base font-extrabold text-white">{name}</h4>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1 text-zinc-300">
              {zone}
            </span>
            <span className="rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1 text-zinc-300">
              {type}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${colors[color]}`}
          >
            {status}
          </span>
          <span className="text-sm text-zinc-400">{capacity}</span>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
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
      <div className="mb-2 flex items-center gap-2 text-orange-300">{icon}</div>
      <div className="text-xs text-zinc-500">{title}</div>
      <div className="mt-2 text-sm font-bold text-white">{value}</div>
    </div>
  );
}
