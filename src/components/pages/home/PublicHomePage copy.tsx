"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  HelpCircle,
  Home,
  LogIn,
  MapPinned,
  Search,
  ShieldCheck,
  Users,
  Utensils,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const mainActions = [
  {
    title: "ثبت درخواست اسکان",
    desc: "اگر نیاز به اسکان موقت دارید، درخواست خود را ثبت کنید.",
    icon: ClipboardList,
    href: "/request/new",
    color: "orange",
    cta: "شروع ثبت درخواست",
  },
  {
    title: "پیگیری درخواست",
    desc: "با کد رهگیری، وضعیت درخواست ثبت‌شده خود را مشاهده کنید.",
    icon: Search,
    href: "/request/track",
    color: "blue",
    cta: "پیگیری وضعیت",
  },
  {
    title: "مشاهده سراهای فعال",
    desc: "سراهای دارای ظرفیت و موقعیت تقریبی آن‌ها را مشاهده کنید.",
    icon: MapPinned,
    href: "/shelters",
    color: "emerald",
    cta: "مشاهده سراها",
  },
  {
    title: "مدارک موردنیاز",
    desc: "پیش از مراجعه، مدارک لازم برای بررسی درخواست را آماده کنید.",
    icon: FileText,
    href: "/guide/documents",
    color: "purple",
    cta: "مشاهده راهنما",
  },
];

const capacityStats = [
  {
    title: "ظرفیت خالی آقایان",
    value: "۲۴۸ نفر",
    icon: Users,
  },
  {
    title: "ظرفیت خالی بانوان",
    value: "۱۸۶ نفر",
    icon: Users,
  },
  {
    title: "ظرفیت خالی خانواده",
    value: "۹۲ خانوار",
    icon: Home,
  },
  {
    title: "سراهای فعال",
    value: "۳۸ سرا",
    icon: Building2,
  },
];

const steps = [
  {
    title: "ثبت اطلاعات اولیه",
    desc: "اطلاعات فردی، تعداد نفرات و نوع نیاز اسکان را ثبت کنید.",
    icon: ClipboardList,
  },
  {
    title: "بررسی و تایید درخواست",
    desc: "درخواست توسط اپراتور یا مسئول مربوطه بررسی می‌شود.",
    icon: ShieldCheck,
  },
  {
    title: "رزرو موقت ظرفیت",
    desc: "در صورت تایید، ظرفیت به‌صورت موقت برای شما رزرو می‌شود.",
    icon: Clock3,
  },
  {
    title: "مراجعه و استقرار",
    desc: "با مدارک لازم مراجعه کرده و پذیرش نهایی انجام می‌شود.",
    icon: CheckCircle2,
  },
];

const notices = [
  "ثبت درخواست به معنی تخصیص قطعی اسکان نیست و نیازمند بررسی و تایید است.",
  "رزرو موقت ظرفیت پس از تایید، محدود به زمان اعلام‌شده در سامانه است.",
  "لطفاً هنگام مراجعه، مدارک هویتی تمام افراد همراه را به‌همراه داشته باشید.",
];

const faqs = [
  {
    q: "آیا ثبت درخواست اسکان به معنی پذیرش قطعی است؟",
    a: "خیر. پس از ثبت درخواست، اطلاعات شما بررسی می‌شود و در صورت وجود ظرفیت و تایید، امکان مراجعه و پذیرش نهایی فراهم می‌شود.",
  },
  {
    q: "چطور وضعیت درخواست خود را پیگیری کنم؟",
    a: "پس از ثبت درخواست، یک کد رهگیری دریافت می‌کنید. از بخش پیگیری درخواست می‌توانید وضعیت را مشاهده کنید.",
  },
  {
    q: "رزرو موقت ظرفیت چقدر اعتبار دارد؟",
    a: "در حالت معمول، رزرو موقت برای مدت محدود فعال است. در صورت عدم مراجعه در زمان مقرر، ظرفیت آزاد می‌شود.",
  },
];

export default function PublicHomePage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen  bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white"
    >
      <Header />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-300">
                <Home className="h-4 w-4" />
                سامانه مدیریت ظرفیت اسکان سراهای محله
              </span>

              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
                ثبت، بررسی و پیگیری درخواست اسکان موقت
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
                این سامانه برای مدیریت ظرفیت سراهای محله، ثبت درخواست اسکان،
                بررسی وضعیت ظرفیت و پیگیری مراحل پذیرش طراحی شده است.
                مراجعه‌کنندگان می‌توانند درخواست خود را ثبت کرده و وضعیت آن را
                به‌صورت آنلاین مشاهده کنند.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/request/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-orange-400"
                >
                  ثبت درخواست اسکان
                  <ArrowLeft className="h-4 w-4" />
                </a>

                <a
                  href="/request/track"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
                >
                  پیگیری درخواست
                  <Search className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-zinc-300">
                <strong className="text-orange-300">توجه:</strong> برای ثبت
                درخواست، وارد کردن اطلاعات هویتی، تعداد افراد همراه و نوع اسکان
                موردنیاز الزامی است.
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.1 }}
              className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <div className="rounded-[28px] border border-white/10 bg-zinc-950/80 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm text-zinc-400">وضعیت امروز</p>
                    <h2 className="mt-1 text-xl font-extrabold text-white">
                      خلاصه ظرفیت سراها
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {capacityStats.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <div className="mb-4 inline-flex rounded-xl border border-orange-400/20 bg-orange-500/10 p-2 text-orange-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-zinc-400">{item.title}</p>
                        <p className="mt-2 text-xl font-black text-white">
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="font-bold text-emerald-300">
                        ظرفیت‌ها به‌صورت دوره‌ای به‌روزرسانی می‌شوند
                      </p>
                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        ظرفیت نمایش‌داده‌شده ممکن است پس از بررسی درخواست‌ها و
                        پذیرش نهایی تغییر کند.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <MainActionsSection />

      <HowItWorksSection />

      <CapacityOverviewSection />

      <NoticesSection />

      <FAQSection />

      <FooterCTA />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <div className="text-base font-black text-white">
              سامانه ثبت درخواست اسکان سرای های محله
            </div>
            <div className="text-xs text-zinc-400">
              مدیریت ظرفیت، درخواست و پذیرش
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <a href="/shelters" className="transition hover:text-white">
            سراهای فعال
          </a>
          <a href="/guide" className="transition hover:text-white">
            راهنما
          </a>
          <a href="/request/track" className="transition hover:text-white">
            پیگیری درخواست
          </a>
        </nav>

        <ThemeToggle />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex"
          >
            <LogIn className="h-4 w-4" />
            ورود
          </Link>

          <a
            href="/request/new"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-orange-400"
          >
            ثبت درخواست
          </a>
        </div>
      </div>
    </header>
  );
}

function MainActionsSection() {
  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionTitle
          eyebrow="خدمات اصلی سامانه"
          title="چه کاری می‌خواهید انجام دهید؟"
          desc="از طریق گزینه‌های زیر می‌توانید درخواست جدید ثبت کنید، وضعیت درخواست را پیگیری کنید یا اطلاعات موردنیاز را مشاهده نمایید."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {mainActions.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.title}
                href={item.href}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.04 }}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/[0.08]"
              >
                <div className="mb-5 inline-flex rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-extrabold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 min-h-[56px] text-sm leading-7 text-zinc-400">
                  {item.desc}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-300">
                  {item.cta}
                  <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionTitle
          eyebrow="مراحل دریافت خدمت"
          title="فرآیند ثبت و بررسی درخواست اسکان"
          desc="برای استفاده از ظرفیت سراهای محله، درخواست شما در چند مرحله بررسی و نهایی می‌شود."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="inline-flex rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-4xl font-black text-white/10">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CapacityOverviewSection() {
  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1.5 text-sm text-orange-300">
            <Building2 className="h-4 w-4" />
            ظرفیت‌های قابل مشاهده
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-4xl">
            وضعیت کلی ظرفیت سراها
          </h2>

          <p className="mt-4 text-base leading-8 text-zinc-400">
            مراجعه‌کنندگان می‌توانند وضعیت کلی ظرفیت را مشاهده کنند. تخصیص نهایی
            ظرفیت پس از بررسی درخواست و تایید مسئول مربوطه انجام می‌شود.
          </p>

          <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4 text-sm leading-7 text-orange-100">
            ظرفیت‌های نمایش‌داده‌شده صرفاً برای اطلاع‌رسانی هستند و ممکن است در
            زمان بررسی درخواست تغییر کنند.
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <CapacityCard
            title="آقایان مجرد"
            total="۵۸۰"
            free="۲۴۸"
            reserved="۷۴"
          />
          <CapacityCard title="بانوان" total="۴۲۰" free="۱۸۶" reserved="۵۲" />
          <CapacityCard title="خانواده" total="۲۱۰" free="۹۲" reserved="۳۱" />
          <CapacityCard title="اضطراری" total="۱۲۰" free="۴۰" reserved="۱۸" />
        </div>
      </div>
    </section>
  );
}

function CapacityCard({
  title,
  total,
  free,
  reserved,
}: {
  title: string;
  total: string;
  free: string;
  reserved: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-white">{title}</h3>
        <Users className="h-5 w-5 text-orange-300" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3 text-center">
          <p className="text-xs text-zinc-500">کل</p>
          <p className="mt-2 font-black text-white">{total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-center">
          <p className="text-xs text-emerald-300">خالی</p>
          <p className="mt-2 font-black text-white">{free}</p>
        </div>
        <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-center">
          <p className="text-xs text-orange-300">رزرو</p>
          <p className="mt-2 font-black text-white">{reserved}</p>
        </div>
      </div>
    </div>
  );
}

function NoticesSection() {
  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1.5 text-sm text-orange-300">
              <Bell className="h-4 w-4" />
              اطلاعیه‌ها
            </span>

            <h2 className="mt-5 text-3xl font-black text-white">
              نکات مهم پیش از ثبت درخواست
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-400">
              لطفاً قبل از ثبت درخواست، موارد زیر را با دقت مطالعه کنید.
            </p>
          </div>

          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <Bell className="mt-1 h-5 w-5 shrink-0 text-orange-300" />
                <p className="text-sm leading-7 text-zinc-300">{notice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <SectionTitle
          eyebrow="پرسش‌های متداول"
          title="سوالات پرتکرار مراجعه‌کنندگان"
          desc="پاسخ چند سوال رایج درباره ثبت درخواست، پیگیری و تخصیص ظرفیت."
        />

        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-1 h-5 w-5 shrink-0 text-orange-300" />
                <div>
                  <h3 className="font-extrabold text-white">{faq.q}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[32px] border border-orange-400/20 bg-orange-500/10 p-8 text-center">
          <h2 className="text-3xl font-black text-white">
            آماده ثبت درخواست اسکان هستید؟
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
            در صورت نیاز به اسکان موقت، درخواست خود را ثبت کنید. پس از بررسی،
            نتیجه از طریق سامانه قابل پیگیری خواهد بود.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/request/new"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-orange-400"
            >
              ثبت درخواست اسکان
              <ArrowLeft className="h-4 w-4" />
            </a>

            <a
              href="/request/track"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
            >
              پیگیری درخواست
              <Search className="h-4 w-4" />
            </a>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 md:flex-row">
          <p>سامانه مدیریت ظرفیت اسکان سراهای محله</p>
          <div className="flex items-center gap-4">
            <a href="/guide" className="hover:text-white">
              راهنما
            </a>
            <a href="/contact" className="hover:text-white">
              تماس با پشتیبانی
            </a>
            <a href="/login" className="hover:text-white">
              ورود کاربران
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto max-w-3xl text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1.5 text-sm text-orange-300">
        {eyebrow}
      </span>

      <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">
        {desc}
      </p>
    </motion.div>
  );
}
