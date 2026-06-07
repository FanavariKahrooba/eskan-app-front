"use client";

import { motion } from "framer-motion";
import {
  Building2,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

const roles = [
  {
    title: "مدیر کل / ستاد",
    desc: "مشاهده گزارش‌های جامع، پایش ظرفیت کل شهر، تعریف سیاست‌ها و نظارت عالی.",
    icon: Building2,
  },
  {
    title: "مدیر منطقه / ناحیه",
    desc: "کنترل سراهای زیرمجموعه، بررسی آمار منطقه‌ای و مدیریت توزیع ظرفیت.",
    icon: ClipboardList,
  },
  {
    title: "مدیر محله / مسئول سرا",
    desc: "مدیریت ظرفیت سرا، ثبت وضعیت، پذیرش نهایی، ورود و خروج افراد و خدمات داخلی.",
    icon: UserCog,
  },
  {
    title: "ناظر / تاییدکننده",
    desc: "بررسی درخواست‌های اسکان، تأیید اولیه، رد درخواست یا ارجاع برای پیگیری بیشتر.",
    icon: ShieldCheck,
  },
  {
    title: "کاربر پذیرش / اپراتور",
    desc: "ثبت درخواست، جستجو در سراها، رزرو ظرفیت، تکمیل پرونده و پیگیری وضعیت متقاضی.",
    icon: Users,
  },
  {
    title: "مسئول تغذیه",
    desc: "برنامه‌ریزی وعده‌های غذایی، مدیریت محل توزیع و محاسبه تعداد وعده مورد نیاز.",
    icon: UtensilsCrossed,
  },
];

export default function BusinessTypesSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.08),transparent_30%)]" />

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
            <Sparkles className="h-4 w-4" />
            نقش‌ها و ذی‌نفعان سامانه
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
            طراحی شده برای همه نقش‌های عملیاتی و مدیریتی
          </h2>
          <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
            سامانه به‌گونه‌ای طراحی می‌شود که هر نقش، متناسب با سطح دسترسی خود،
            بتواند فرآیندهای مرتبط با اسکان، ظرفیت، نظارت و خدمات را مدیریت کند.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = role.icon;

            return (
              <motion.div
                key={role.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="mb-5 inline-flex rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {role.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {role.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
