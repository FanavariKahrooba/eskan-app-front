"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Sparkles,
  TriangleAlert,
  Workflow,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

const beforeItems = [
  "اطلاع نداشتن از ظرفیت واقعی و لحظه‌ای سراها",
  "ثبت درخواست‌ها به‌صورت تلفنی، دستی یا پراکنده",
  "نبود فرآیند شفاف برای بررسی و تأیید درخواست",
  "احتمال تداخل در تخصیص ظرفیت و ثبت اسکان",
  "نبود آمار متمرکز برای وعده‌های غذایی و گزارش‌ها",
];

const afterItems = [
  "نمایش آنلاین ظرفیت خالی، اشغال‌شده و رزرو شده",
  "ثبت یکپارچه درخواست‌ها و کارتابل بررسی",
  "رزرو موقت ۳۰ دقیقه‌ای و جلوگیری از تداخل",
  "ثبت نهایی ورود، خروج، انتقال و تمدید اسکان",
  "داشبورد مدیریتی و گزارش آماری در همه سطوح",
];

export default function BeforeAfterSection() {
  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
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
            تحول در فرآیند اسکان
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
            قبل و بعد از استقرار سامانه
          </h2>
          <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
            این سامانه فرایندهای پراکنده، دستی و غیرشفاف را به یک چرخه متمرکز،
            سریع و قابل رهگیری تبدیل می‌کند.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_120px_1fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-[32px] border border-red-400/10 bg-red-500/[0.04] p-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-red-300">
                <TriangleAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  قبل از سامانه
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  فرآیندهای دستی، پراکنده و پرخطا
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {beforeItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4 text-sm text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="hidden items-center justify-center lg:flex">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-orange-400/20 bg-orange-500/10 text-orange-300">
              <ArrowLeftRight className="h-8 w-8" />
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="rounded-[32px] border border-emerald-400/10 bg-emerald-500/[0.04] p-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-emerald-300">
                <Workflow className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  بعد از سامانه
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  فرآیند متمرکز، شفاف و هوشمند
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {afterItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4 text-sm text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
