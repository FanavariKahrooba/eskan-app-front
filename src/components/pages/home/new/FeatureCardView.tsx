"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Bed,
  Building2,
  ClipboardCheck,
  Clock,
  Database,
  FileSpreadsheet,
  MapPin,
  ShieldCheck,
  Sparkles,
  Utensils,
  Users,
} from "lucide-react";

const features = [
  {
    title: "نمایش سراها روی نقشه",
    desc: "مشاهده موقعیت مکانی سراها، آدرس، منطقه، ناحیه و وضعیت ظرفیت هر سرا روی نقشه.",
    icon: MapPin,
  },
  {
    title: "مدیریت سراهای محله",
    desc: "ثبت مشخصات سرا، ظرفیت کل، ظرفیت تفکیکی، وضعیت فعال یا غیرفعال و اطلاعات مسئول سرا.",
    icon: Building2,
  },
  {
    title: "تعریف ظرفیت تفکیکی",
    desc: "مدیریت ظرفیت برای آقایان، بانوان، مجردها، متأهلین و خانواده‌ها بر اساس نیاز عملیاتی.",
    icon: Bed,
  },
  {
    title: "ثبت درخواست اسکان",
    desc: "ثبت مشخصات متقاضی، گروه متقاضی، تعداد نفرات، توضیحات و مدارک احتمالی.",
    icon: ClipboardCheck,
  },
  {
    title: "گردش کار تأیید",
    desc: "بررسی درخواست توسط ناظر، مدیر محله یا کاربر مجاز و ثبت تصمیم‌ها به‌صورت قابل رهگیری.",
    icon: ShieldCheck,
  },
  {
    title: "رزرو موقت ۳۰ دقیقه‌ای",
    desc: "رزرو خودکار ظرفیت پس از تأیید اولیه و آزادسازی خودکار در صورت عدم تأیید نهایی.",
    icon: Clock,
  },
  {
    title: "مدیریت مسافران و خانواده‌ها",
    desc: "ثبت اطلاعات مسافران، اعضای خانواده، ورود، خروج، تمدید، انتقال و سوابق اسکان.",
    icon: Users,
  },
  {
    title: "کنترل آنلاین ظرفیت",
    desc: "نمایش لحظه‌ای ظرفیت خالی، اشغال‌شده، رزرو شده و هشدار تکمیل ظرفیت.",
    icon: Database,
  },
  {
    title: "مدیریت وعده‌های غذایی",
    desc: "تعریف محل توزیع صبحانه، ناهار و شام و محاسبه تعداد وعده موردنیاز برای هر گروه.",
    icon: Utensils,
  },
  {
    title: "داشبورد مدیریتی",
    desc: "نمایش شاخص‌های کلیدی ظرفیت، استقرار، درخواست‌ها، هشدارها و وضعیت سراها.",
    icon: Bell,
  },
  {
    title: "گزارش و خروجی اکسل",
    desc: "گزارش‌گیری آماری در سطح محله، ناحیه، منطقه و ستاد همراه با خروجی اکسل.",
    icon: FileSpreadsheet,
  },
  {
    title: "امنیت و ثبت رویدادها",
    desc: "کنترل سطح دسترسی، ثبت سوابق اقدامات کاربران، حفاظت از داده‌ها و پشتیبان‌گیری.",
    icon: ShieldCheck,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

function FeatureCard({
  item,
  index,
}: {
  item: (typeof features)[number];
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.18),transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-5 inline-flex rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-white">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-zinc-400">{item.desc}</p>
      </div>
    </motion.div>
  );
}

export default function FeatureCardView() {
  return (
    <section id="features" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionTitle
          badge="امکانات کلیدی سامانه"
          title="همه ابزارهای لازم برای مدیریت هوشمند اسکان"
          desc="از نمایش مکانی سراها و ثبت درخواست تا کنترل ظرفیت، ثبت استقرار، مدیریت غذا و گزارش‌گیری مدیریتی."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((item, index) => (
            <FeatureCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
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
