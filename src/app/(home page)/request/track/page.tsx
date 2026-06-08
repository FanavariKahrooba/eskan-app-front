import type { Metadata } from "next";
import { Suspense } from "react";
import TrackRequestPage from "./TrackRequestPage";

export const metadata: Metadata = {
  title: "پیگیری درخواست اسکان |  سامانه ثبت درخواست اسکان سرای های محله",
  description:
    "پیگیری وضعیت درخواست اسکان با استفاده از کد رهگیری، مشاهده نتیجه بررسی و اطلاعات مراجعه.",
  keywords: [
    "پیگیری درخواست اسکان",
    "کد رهگیری اسکان",
    "وضعیت درخواست اسکان",
    "اسکان موقت",
    "سرای محله",
  ],
  openGraph: {
    title: "پیگیری درخواست اسکان",
    description:
      "مشاهده وضعیت درخواست اسکان و اطلاعات مراجعه با استفاده از کد رهگیری.",
    type: "website",
    locale: "fa_IR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RequestTrackPage() {
  return (
    <Suspense fallback={<RequestTrackPageFallback />}>
      <TrackRequestPage />
    </Suspense>
  );
}

function RequestTrackPageFallback() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-100 p-6 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <div className="mx-auto max-w-7xl">در حال بارگذاری صفحه پیگیری...</div>
    </main>
  );
}
