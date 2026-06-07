import type { Metadata } from "next";
import { Suspense } from "react";
import NewShelterRequestPage from "./NewShelterRequestPage";

export const metadata: Metadata = {
  title: "ثبت درخواست اسکان موقت | سامانه اسکان سراهای محله",
  description:
    "ثبت درخواست اسکان موقت، انتخاب سرای محله، ثبت اطلاعات متقاضی، همراهان، شرایط خاص و دریافت کد رهگیری.",
  keywords: [
    "ثبت درخواست اسکان",
    "اسکان موقت",
    "سرای محله",
    "درخواست اسکان",
    "پیگیری اسکان",
  ],
  openGraph: {
    title: "ثبت درخواست اسکان موقت",
    description: "فرم ثبت درخواست اسکان موقت در سامانه اسکان سراهای محله.",
    type: "website",
    locale: "fa_IR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RequestNewPage() {
  return (
    <Suspense fallback={<RequestNewPageFallback />}>
      <NewShelterRequestPage />
    </Suspense>
  );
}

function RequestNewPageFallback() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-100 p-6 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <div className="mx-auto max-w-7xl">در حال بارگذاری فرم درخواست...</div>
    </main>
  );
}
