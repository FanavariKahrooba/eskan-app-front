"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  ChevronDown,
  FileCheck2,
  FileSearch,
  HelpCircle,
  Home,
  Info,
  LifeBuoy,
  Map,
  MapPin,
  Phone,
  ShieldCheck,
  Siren,
  Sparkles,
  Users,
} from "lucide-react";

const primaryActions = [
  {
    title: "ثبت درخواست جدید",
    description:
      "اگر هنوز درخواست اسکان ثبت نکرده‌اید، از این بخش می‌توانید فرم ثبت درخواست را تکمیل کنید.",
    href: "/request/new",
    icon: FileCheck2,
    color:
      "border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/15",
    iconWrap:
      "bg-orange-100 text-orange-700 dark:bg-black/20 dark:text-orange-300",
    titleColor: "text-slate-950 dark:text-white",
    descColor: "text-slate-700 dark:text-zinc-300",
  },
  {
    title: "پیگیری درخواست",
    description:
      "اگر قبلاً درخواست ثبت کرده‌اید، با کد رهگیری آخرین وضعیت بررسی را مشاهده کنید.",
    href: "/track",
    icon: FileSearch,
    color:
      "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/15",
    iconWrap: "bg-sky-100 text-sky-700 dark:bg-black/20 dark:text-sky-300",
    titleColor: "text-slate-950 dark:text-white",
    descColor: "text-slate-700 dark:text-zinc-300",
  },
  {
    title: "مشاهده سراها",
    description:
      "برای بررسی موقعیت، ظرفیت، وضعیت و نوع پذیرش سراها از بخش فهرست یا نقشه استفاده کنید.",
    href: "/",
    icon: Map,
    color:
      "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15",
    iconWrap:
      "bg-emerald-100 text-emerald-700 dark:bg-black/20 dark:text-emerald-300",
    titleColor: "text-slate-950 dark:text-white",
    descColor: "text-slate-700 dark:text-zinc-300",
  },
];

const mapGuideItems = [
  {
    title: "نمایش سراها روی نقشه",
    description:
      "هر نشانگر روی نقشه نماینده یک سرا است. با انتخاب آن می‌توانید اطلاعات پایه، موقعیت و وضعیت آن را بررسی کنید.",
    icon: MapPin,
    color:
      "text-sky-700 bg-sky-50 border-sky-300 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-400/20",
  },
  {
    title: "اطلاعات سراها پویا است",
    description:
      "ظرفیت، وضعیت پذیرش و برخی جزئیات سراها ممکن است بر اساس داده‌های سامانه تغییر کند؛ بنابراین همیشه آخرین وضعیت را در سامانه بررسی کنید.",
    icon: Info,
    color:
      "text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-400/20",
  },
  {
    title: "ثبت درخواست = شروع بررسی",
    description:
      "ثبت فرم به معنی ثبت اولیه درخواست است و به‌تنهایی به منزله پذیرش نهایی یا رزرو قطعی نیست.",
    icon: ShieldCheck,
    color:
      "text-orange-700 bg-orange-50 border-orange-300 dark:text-orange-300 dark:bg-orange-500/10 dark:border-orange-400/20",
  },
  {
    title: "مدارک را آماده داشته باشید",
    description:
      "برای مراجعه حضوری و تکمیل فرآیند پذیرش، همراه داشتن مدارک هویتی معتبر متقاضی و همراهان ضروری است.",
    icon: BadgeCheck,
    color:
      "text-red-700 bg-red-50 border-red-300 dark:text-red-300 dark:bg-red-500/10 dark:border-red-400/20",
  },
];

const shelterGroups = [
  {
    title: "گروه پذیرش / نوع اسکان",
    icon: Users,
    color:
      "text-sky-700 bg-sky-50 border-sky-300 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-400/20",
    items: [
      { label: "آقایان", value: "men" },
      { label: "بانوان", value: "women" },
      { label: "خانواده", value: "family" },
      { label: "مشترک", value: "mixed" },
    ],
  },
  {
    title: "نوع پذیرش",
    icon: Siren,
    color:
      "text-orange-700 bg-orange-50 border-orange-300 dark:text-orange-300 dark:bg-orange-500/10 dark:border-orange-400/20",
    items: [
      { label: "عادی", value: "normal" },
      { label: "اضطراری", value: "emergency" },
      { label: "ارجاعی", value: "referral" },
    ],
  },
];

const processSteps = [
  {
    title: "بررسی سراها",
    description:
      "ابتدا سراها را از نظر موقعیت، نوع پذیرش، گروه پذیرش و وضعیت کلی بررسی کنید.",
  },
  {
    title: "تکمیل فرم درخواست",
    description:
      "اطلاعات متقاضی، همراهان و شرایط خاص را با دقت در فرم وارد کنید.",
  },
  {
    title: "دریافت کد رهگیری",
    description:
      "پس از ثبت موفق درخواست، یک کد رهگیری دریافت می‌کنید که برای استعلام‌های بعدی لازم است.",
  },
  {
    title: "پیگیری نتیجه بررسی",
    description:
      "از صفحه پیگیری می‌توانید وضعیت نهایی یا موقت درخواست و اطلاعات مراجعه را مشاهده کنید.",
  },
];

const importantNotes = [
  "ثبت درخواست به معنی پذیرش قطعی نیست و نتیجه نهایی پس از بررسی مشخص می‌شود.",
  "برای پذیرش نهایی، مدارک هویتی معتبر لازم است.",
  "در صورت نمایش اطلاعات مراجعه، بهتر است پیش از حضور با محل مربوطه هماهنگ کنید.",
  "اگر برای کد رهگیری شما نتیجه‌ای پیدا نشد، صحت کد را دوباره بررسی کنید.",
];

const faqs = [
  {
    question: "برای شروع استفاده از سامانه چه کاری انجام دهم؟",
    answer:
      "اگر هنوز درخواستی ثبت نکرده‌اید، ابتدا سراها را بررسی کرده و سپس وارد بخش «ثبت درخواست جدید» شوید. اگر قبلاً ثبت کرده‌اید، از صفحه «پیگیری درخواست» استفاده کنید.",
  },
  {
    question: "آیا قبل از ثبت درخواست می‌توانم سراها را ببینم؟",
    answer:
      "بله. می‌توانید فهرست یا نقشه سراها را بررسی کنید و سپس متناسب با شرایط، درخواست خود را ثبت نمایید.",
  },
  {
    question: "آیا ثبت درخواست به معنای رزرو نهایی است؟",
    answer:
      "خیر. ثبت درخواست صرفاً شروع فرآیند بررسی است و پذیرش نهایی پس از ارزیابی شرایط انجام می‌شود.",
  },
  {
    question: "اگر کد رهگیری را گم کنم چه باید بکنم؟",
    answer:
      "در این شرایط لازم است از طریق پشتیبانی یا راه ارتباطی تعریف‌شده، درخواست راهنمایی برای بازیابی یا بررسی وضعیت خود را ثبت کنید.",
  },
  {
    question: "آیا می‌توانم برای یک سرای مشخص درخواست ثبت کنم؟",
    answer:
      "بله. در صورتی که سامانه با شناسه یا لینک مشخص یک سرا شما را به فرم هدایت کند، امکان ثبت درخواست برای همان سرا وجود دارد.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function GuidePage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-100 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <Header />
      <HeroSection />

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <motion.section
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="space-y-6"
          >
            <MotionBlock>
              <PrimaryActionsSection />
            </MotionBlock>

            <MotionBlock>
              <ProcessSection />
            </MotionBlock>

            <MotionBlock>
              <MapGuideSection />
            </MotionBlock>

            <MotionBlock>
              <ShelterGroupsSection />
            </MotionBlock>

            <MotionBlock>
              <ImportantNotesSection />
            </MotionBlock>

            <MotionBlock>
              <FaqSection />
            </MotionBlock>
          </motion.section>

          <motion.aside
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="space-y-6 lg:sticky lg:top-24 lg:h-fit"
          >
            <QuickHelpBox />
            <NavigationBox />
            <SupportBox />
          </motion.aside>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
            <Home className="h-5 w-5" />
          </div>

          <div>
            <div className="text-base font-black text-slate-950 dark:text-white">
              سامانه ثبت درخواست اسکان سرای های محله
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">
              راهنمای استفاده
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/track"
            className="hidden rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 md:inline-flex dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            پیگیری درخواست
          </Link>

          <Link
            href="/request/new"
            className="rounded-xl border border-orange-600 bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            ثبت درخواست
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-stone-100 via-slate-100 to-slate-100 dark:border-white/10 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_28%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.14),transparent_28%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-4 py-2 text-sm text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
            <Sparkles className="h-4 w-4" />
            راهنمای کامل استفاده از سامانه
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight text-slate-950 md:text-5xl dark:text-white">
            از بررسی سراها تا ثبت و پیگیری درخواست، همه‌چیز را اینجا ببینید
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-700 md:text-base dark:text-zinc-300">
            این صفحه برای آشنایی سریع و دقیق با مسیر استفاده از سامانه طراحی شده
            است؛ از مشاهده سراها و نقشه گرفته تا ثبت درخواست، دریافت کد رهگیری و
            پیگیری نتیجه.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/request/new"
              className="inline-flex items-center gap-2 rounded-2xl border border-orange-600 bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <FileCheck2 className="h-4 w-4" />
              شروع ثبت درخواست
            </Link>

            <Link
              href="/track"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <FileSearch className="h-4 w-4" />
              پیگیری درخواست
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PrimaryActionsSection() {
  return (
    <GlassSection
      title="اقدامات اصلی"
      description="برای استفاده از سامانه معمولاً از یکی از این سه مسیر شروع می‌کنید."
      icon={
        <IconBadge color="border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
          <Building2 className="h-5 w-5" />
        </IconBadge>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {primaryActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group rounded-[24px] border p-4 transition duration-200 ${item.color}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition group-hover:scale-105 ${item.iconWrap}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <h3
                className={`mt-4 text-base font-extrabold ${item.titleColor}`}
              >
                {item.title}
              </h3>

              <p className={`mt-2 text-sm leading-7 ${item.descColor}`}>
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </GlassSection>
  );
}

function ProcessSection() {
  return (
    <GlassSection
      title="مراحل کلی استفاده از سامانه"
      description="اگر برای اولین بار وارد سامانه شده‌اید، این ترتیب بهترین مسیر را به شما نشان می‌دهد."
      icon={
        <IconBadge color="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Info className="h-5 w-5" />
        </IconBadge>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {processSteps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950/50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-black text-white shadow-lg shadow-sky-500/20">
              {(index + 1).toLocaleString("fa-IR")}
            </div>

            <h3 className="mt-4 text-base font-extrabold text-slate-950 dark:text-white">
              {step.title}
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-zinc-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </GlassSection>
  );
}

function MapGuideSection() {
  return (
    <GlassSection
      title="راهنمای نقشه"
      description="نقشه یکی از سریع‌ترین روش‌ها برای بررسی بصری سراها و مقایسه موقعیت آن‌ها است."
      icon={
        <IconBadge color="border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
          <Map className="h-5 w-5" />
        </IconBadge>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {mapGuideItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950/50"
            >
              <div
                className={`inline-flex rounded-2xl border p-3 ${item.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-extrabold text-slate-950 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </GlassSection>
  );
}

function ShelterGroupsSection() {
  return (
    <GlassSection
      title="دسته‌بندی سراها"
      description="سراها ممکن است بر اساس گروه پذیرش و نوع خدمت‌رسانی دسته‌بندی شوند."
      icon={
        <IconBadge color="border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
          <Users className="h-5 w-5" />
        </IconBadge>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {shelterGroups.map((group) => {
          const Icon = group.icon;

          return (
            <div
              key={group.title}
              className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950/50"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className={`rounded-2xl border p-3 ${group.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                  {group.title}
                </h3>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                  >
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                    <span
                      dir="ltr"
                      className="text-xs text-slate-500 dark:text-zinc-400"
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </GlassSection>
  );
}

function ImportantNotesSection() {
  return (
    <section className="rounded-[28px] border border-red-300 bg-red-50 p-5 shadow-sm md:p-6 dark:border-red-400/20 dark:bg-red-500/10">
      <SectionTitle
        title="نکات مهم قبل از ثبت یا مراجعه"
        description="این نکات برای جلوگیری از خطا یا برداشت نادرست از فرآیند پذیرش مهم هستند."
        icon={
          <IconBadge color="border-red-300 bg-red-100 text-red-700 dark:border-red-400/20 dark:bg-red-500/20 dark:text-red-300">
            <ShieldCheck className="h-5 w-5" />
          </IconBadge>
        }
      />

      <ul className="space-y-3">
        {importantNotes.map((note) => (
          <li
            key={note}
            className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm leading-7 text-red-900 dark:border-white/10 dark:bg-zinc-950/30 dark:text-red-50"
          >
            {note}
          </li>
        ))}
      </ul>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <GlassSection
      title="پرسش‌های پرتکرار"
      description="اگر سوال مشابهی دارید، احتمالاً پاسخ آن را در این بخش پیدا می‌کنید."
      icon={
        <IconBadge color="border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
          <HelpCircle className="h-5 w-5" />
        </IconBadge>
      }
    >
      <div className="space-y-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-[22px] border border-slate-200 bg-white dark:border-white/10 dark:bg-zinc-950/50"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-right"
              >
                <span className="text-sm font-extrabold text-slate-950 md:text-base dark:text-white">
                  {item.question}
                </span>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-500 transition dark:text-zinc-400 ${
                    isOpen ? "rotate-180 text-slate-900 dark:text-white" : ""
                  }`}
                />
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="border-t border-slate-200 px-4 py-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:text-zinc-400">
                  {item.answer}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </GlassSection>
  );
}

function QuickHelpBox() {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-center gap-3">
        <IconBadge color="border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
          <LifeBuoy className="h-5 w-5" />
        </IconBadge>

        <h3 className="font-extrabold text-slate-950 dark:text-white">
          راهنمای سریع
        </h3>
      </div>

      <ul className="space-y-3 text-sm leading-7 text-slate-700 dark:text-zinc-300">
        <li>۱. ابتدا سراها را بررسی کنید.</li>
        <li>۲. فرم درخواست را با دقت تکمیل کنید.</li>
        <li>۳. کد رهگیری را ذخیره یا یادداشت کنید.</li>
        <li>۴. نتیجه را از صفحه پیگیری بررسی کنید.</li>
      </ul>
    </aside>
  );
}

function NavigationBox() {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h3 className="mb-4 font-extrabold text-slate-950 dark:text-white">
        دسترسی سریع
      </h3>

      <div className="space-y-3">
        <QuickLink
          href="/"
          icon={
            <Home className="h-4 w-4 text-orange-600 dark:text-orange-300" />
          }
        >
          صفحه اصلی
        </QuickLink>

        <QuickLink
          href="/request/new"
          icon={
            <FileCheck2 className="h-4 w-4 text-orange-600 dark:text-orange-300" />
          }
        >
          ثبت درخواست
        </QuickLink>

        <QuickLink
          href="/track"
          icon={
            <FileSearch className="h-4 w-4 text-sky-600 dark:text-sky-300" />
          }
        >
          پیگیری درخواست
        </QuickLink>
      </div>
    </aside>
  );
}

function SupportBox() {
  return (
    <aside className="rounded-[28px] border border-orange-300 bg-orange-50 p-5 shadow-sm dark:border-orange-400/20 dark:bg-orange-500/10">
      <div className="mb-3 text-lg font-extrabold text-slate-950 dark:text-white">
        پشتیبانی
      </div>

      <p className="text-sm leading-7 text-orange-900 dark:text-orange-100">
        اگر در ثبت درخواست، مشاهده اطلاعات سراها یا پیگیری نتیجه با مشکلی
        روبه‌رو شدید، از راه ارتباطی زیر استفاده کنید.
      </p>

      <a
        href="tel:02100000000"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-orange-100 dark:border-white/10 dark:bg-zinc-950/40 dark:text-white dark:hover:bg-zinc-950/60"
      >
        <Phone className="h-4 w-4" />
        ۰۲۱-۰۰۰۰۰۰۰۰
      </a>
    </aside>
  );
}

function MotionBlock({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
}

function GlassSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <SectionTitle title={title} description={description} icon={icon} />
      {children}
    </section>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
      {icon}
      <div>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function IconBadge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return <div className={`rounded-2xl border p-3 ${color}`}>{children}</div>;
}

function QuickLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-white/10"
    >
      {icon}
      {children}
    </Link>
  );
}
