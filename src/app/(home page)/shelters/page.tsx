import type { Metadata } from "next";
import { Suspense } from "react";
import SheltersExplorer from "./SheltersExplorer";

export const metadata: Metadata = {
  title: "سراهای قابل اسکان | سامانه اسکان سراهای محله",
  description:
    "در این صفحه می‌توانید سراها و پناهگاه‌های قابل اسکان را مشاهده کنید، ظرفیت کل و ظرفیت خالی را بررسی کنید، وضعیت پذیرش را ببینید و برای اسکان درخواست ثبت کنید.",
  keywords: [
    "پناهگاه های اسکان",
    "سراهای قابل اسکان",
    "ظرفیت خالی اسکان",
    "ثبت درخواست پناهگاه",
    "اسکان خانواده",
    "اسکان بانوان",
    "اسکان آقایان",
    "سامانه سراهای محله",
  ],
  applicationName: "سامانه اسکان سراهای محله",
  openGraph: {
    title: "پناهگاه‌ها و سراهای قابل اسکان",
    description:
      "مشاهده مراکز قابل اسکان، بررسی ظرفیت، وضعیت پذیرش و ثبت درخواست به‌صورت آنلاین.",
    type: "website",
    locale: "fa_IR",
    siteName: "سامانه اسکان سراهای محله",
  },
  twitter: {
    card: "summary_large_image",
    title: "پناهگاه‌ها و سراهای قابل اسکان",
    description:
      "فهرست مراکز قابل اسکان به همراه ظرفیت، وضعیت پذیرش و امکان ثبت درخواست.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  category: "housing",
};

export default function SheltersPage() {
  return (
    <Suspense fallback={<SheltersPageFallback />}>
      <SheltersExplorer />
    </Suspense>
  );
}

function SheltersPageFallback() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-100 p-6 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
          در حال بارگذاری اطلاعات سراها ...
        </div>
      </div>
    </main>
  );
}
