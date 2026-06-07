"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

const faqs = [
  {
    q: "این سامانه برای چه منظوری طراحی شده است؟",
    a: "این سامانه برای مدیریت متمرکز ظرفیت اسکان سراهای محله، ثبت درخواست، بررسی و تأیید اسکان، کنترل آنلاین ظرفیت و مدیریت خدمات مرتبط مانند وعده‌های غذایی طراحی شده است.",
  },
  {
    q: "آیا سراهای محله روی نقشه نمایش داده می‌شوند؟",
    a: "بله، موقعیت مکانی هر سرا، ظرفیت باقی‌مانده، ظرفیت اشغال‌شده، وضعیت فعال یا غیرفعال و اطلاعات پایه آن روی نقشه قابل مشاهده است.",
  },
  {
    q: "رزرو موقت ۳۰ دقیقه‌ای چگونه عمل می‌کند؟",
    a: "پس از تأیید اولیه درخواست، ظرفیت موردنیاز به مدت ۳۰ دقیقه رزرو می‌شود. اگر در این زمان تأیید نهایی انجام نشود، ظرفیت به‌صورت خودکار آزاد می‌شود.",
  },
  {
    q: "آیا امکان تفکیک اسکان آقایان، بانوان و خانواده‌ها وجود دارد؟",
    a: "بله، ظرفیت‌ها و درخواست‌ها می‌توانند بر اساس مجرد آقا، مجرد خانم، متأهل، خانواده و تعداد نفرات مدیریت شوند.",
  },
  {
    q: "چه نقش‌هایی در سامانه وجود دارد؟",
    a: "نقش‌هایی مانند مدیر کل، مدیر منطقه، مدیر محله، مسئول سرا، ناظر، کاربر پذیرش، مسئول تغذیه و کاربر متقاضی قابل تعریف هستند.",
  },
  {
    q: "آیا مدیریت وعده‌های غذایی هم در سامانه وجود دارد؟",
    a: "بله، امکان تعریف محل ارائه صبحانه، ناهار و شام، تعیین گروه‌های دریافت‌کننده و محاسبه تعداد وعده موردنیاز پیش‌بینی شده است.",
  },
  {
    q: "آیا گزارش مدیریتی و خروجی اکسل وجود دارد؟",
    a: "بله، سامانه قابلیت ارائه گزارش‌های آماری و مدیریتی در سطح محله، ناحیه، منطقه و ستاد همراه با خروجی اکسل را دارد.",
  },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;

        return (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
            >
              <span className="text-lg font-bold text-white">{item.q}</span>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown className="h-5 w-5 text-zinc-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 text-sm leading-7 text-zinc-400">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function FAQSectionView() {
  return (
    <section id="faq" className="border-t border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
        <SectionTitle
          badge="سوالات متداول"
          title="پاسخ به سوالات مهم درباره سامانه اسکان"
          desc="پرسش‌های رایج درباره مدیریت ظرفیت، رزرو موقت، نقش‌ها، گزارش‌ها و خدمات غذایی."
        />
        <FAQAccordion />
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
