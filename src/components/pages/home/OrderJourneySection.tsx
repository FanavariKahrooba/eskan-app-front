"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Clock,
  FileCheck,
  MapPin,
  Sparkles,
  UserCheck,
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

const steps = [
  {
    title: "مشاهده سراها روی نقشه",
    desc: "کاربر سراهای محله، موقعیت مکانی، ظرفیت خالی، نوع ظرفیت‌ها و وضعیت فعال بودن سرا را مشاهده می‌کند.",
    icon: MapPin,
  },
  {
    title: "اعمال فیلتر و انتخاب سرا",
    desc: "فیلترهایی مانند مجرد آقا، مجرد خانم، متأهل، خانواده، تعداد نفرات، منطقه و ناحیه اعمال می‌شود.",
    icon: Users,
  },
  {
    title: "ثبت درخواست اسکان",
    desc: "مشخصات متقاضی، نوع درخواست، تعداد نفرات، توضیحات و مدارک احتمالی ثبت می‌شود.",
    icon: ClipboardCheck,
  },
  {
    title: "بررسی توسط ناظر یا مدیر",
    desc: "درخواست در کارتابل بررسی قرار گرفته و امکان تأیید اولیه، رد یا ارجاع برای بررسی بیشتر وجود دارد.",
    icon: UserCheck,
  },
  {
    title: "رزرو موقت ۳۰ دقیقه‌ای",
    desc: "پس از تأیید اولیه، ظرفیت موردنظر به مدت ۳۰ دقیقه رزرو می‌شود.",
    icon: Clock,
  },
  {
    title: "ثبت اسکان نهایی",
    desc: "با تأیید نهایی، اسکان قطعی شده و ظرفیت از موجودی قابل استفاده کسر می‌شود.",
    icon: FileCheck,
  },
];

export default function OrderJourneySection() {
  return (
    <section id="workflow" className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionTitle
          badge="فرآیند اجرایی سامانه"
          title="از مشاهده ظرفیت تا ثبت نهایی اسکان"
          desc="فرآیند سامانه به‌گونه‌ای طراحی شده که درخواست‌ها، بررسی‌ها، رزروهای موقت و اسکان‌های نهایی به‌صورت شفاف و قابل رهگیری مدیریت شوند."
        />

        <div className="relative mt-14">
          <div className="absolute right-6 top-0 hidden h-full w-px bg-white/10 md:block" />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.06 }}
                  className="relative grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:grid-cols-[72px_1fr]"
                >
                  <div className="relative flex items-start justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-orange-300">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <div>
                    <span className="rounded-full border border-white/10 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-400">
                      مرحله {index + 1}
                    </span>
                    <h3 className="mt-3 text-xl font-extrabold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
