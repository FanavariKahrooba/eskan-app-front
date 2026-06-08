"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BedDouble,
  Building2,
  CheckCircle2,
  Circle,
  Clock3,
  FileSearch,
  Home,
  Info,
  Loader2,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type RequestStatus = "pending" | "approved" | "temporary-reserved" | "rejected";

type TrackingResult = {
  trackingCode: string;
  applicantName: string;
  nationalIdMasked: string;
  requestType: "آقایان" | "بانوان" | "خانواده";
  totalPeople: number;
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;
  statusDescription: string;
  shelter?: {
    name: string;
    region: string;
    district: string;
    neighborhood: string;
    address: string;
    phone: string;
    referralTime?: string;
  };
  rejectionReason?: string;
  notes?: string[];
};

const mockRequests: TrackingResult[] = [
  {
    trackingCode: "ASK-123456",
    applicantName: "علی احمدی",
    nationalIdMasked: "۰۰۱***۱۲۳۴",
    requestType: "خانواده",
    totalPeople: 4,
    createdAt: "۱۴۰۵/۰۳/۱۲ - ۱۰:۳۰",
    updatedAt: "۱۴۰۵/۰۳/۱۲ - ۱۲:۱۵",
    status: "temporary-reserved",
    statusDescription:
      "درخواست شما بررسی و یک ظرفیت به‌صورت موقت برای شما رزرو شده است.",
    shelter: {
      name: "سرای محله گلستان",
      region: "2",
      district: "1",
      neighborhood: "گلستان",
      address: "منطقه ۲، ناحیه ۱، خیابان نمونه، سرای محله گلستان",
      phone: "021-22220001",
      referralTime: "امروز تا ساعت ۱۸:۰۰",
    },
    notes: [
      "لطفاً اصل کارت ملی متقاضی اصلی را همراه داشته باشید.",
      "حضور تمام همراهان هنگام پذیرش الزامی است.",
      "رزرو موقت در صورت عدم مراجعه در زمان مقرر لغو خواهد شد.",
    ],
  },
  {
    trackingCode: "ASK-654321",
    applicantName: "زهرا محمدی",
    nationalIdMasked: "۰۰۸***۵۶۷۸",
    requestType: "بانوان",
    totalPeople: 2,
    createdAt: "۱۴۰۵/۰۳/۱۱ - ۱۶:۲۰",
    updatedAt: "۱۴۰۵/۰۳/۱۲ - ۰۹:۰۰",
    status: "approved",
    statusDescription:
      "درخواست شما تأیید شده و امکان مراجعه برای پذیرش وجود دارد.",
    shelter: {
      name: "سرای محله یاس",
      region: "3",
      district: "1",
      neighborhood: "یاس",
      address: "منطقه ۳، ناحیه ۱، خیابان شریعتی، سرای محله یاس",
      phone: "021-33330004",
      referralTime: "فردا از ساعت ۸ تا ۱۴",
    },
    notes: [
      "پذیرش نهایی پس از تطبیق مدارک انجام می‌شود.",
      "در صورت تغییر تعداد نفرات، قبل از مراجعه با سرا تماس بگیرید.",
    ],
  },
  {
    trackingCode: "ASK-111222",
    applicantName: "حسین رضایی",
    nationalIdMasked: "۰۰۳***۷۸۹۰",
    requestType: "آقایان",
    totalPeople: 1,
    createdAt: "۱۴۰۵/۰۳/۱۳ - ۰۸:۴۵",
    updatedAt: "۱۴۰۵/۰۳/۱۳ - ۰۸:۴۵",
    status: "pending",
    statusDescription: "درخواست شما ثبت شده و در صف بررسی کارشناسان قرار دارد.",
    notes: [
      "نتیجه بررسی از همین بخش قابل مشاهده خواهد بود.",
      "در صورت نیاز به مدارک تکمیلی، پیام اطلاع‌رسانی ثبت می‌شود.",
    ],
  },
  {
    trackingCode: "ASK-999888",
    applicantName: "مریم کریمی",
    nationalIdMasked: "۰۰۶***۴۴۵۵",
    requestType: "خانواده",
    totalPeople: 5,
    createdAt: "۱۴۰۵/۰۳/۱۰ - ۱۳:۱۰",
    updatedAt: "۱۴۰۵/۰۳/۱۱ - ۱۱:۳۰",
    status: "rejected",
    statusDescription: "درخواست شما پس از بررسی، امکان پذیرش نداشته است.",
    rejectionReason:
      "به دلیل ناقص بودن اطلاعات و عدم تطابق مدارک بارگذاری‌شده، درخواست رد شده است.",
    notes: [
      "می‌توانید پس از تکمیل اطلاعات، درخواست جدید ثبت کنید.",
      "در صورت اعتراض، با مرکز پشتیبانی تماس بگیرید.",
    ],
  },
];

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function normalizeTrackingCode(value: string) {
  return normalizeDigits(value)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^ASK/, "ASK-")
    .replace(/^ASK--/, "ASK-");
}

export default function TrackRequestPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const examples = useMemo(
    () => mockRequests.map((item) => item.trackingCode),
    [],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const normalizedCode = normalizeTrackingCode(trackingCode);

    setError("");
    setResult(null);
    setSearched(false);

    if (!normalizedCode) {
      setError("لطفاً کد رهگیری را وارد کنید.");
      return;
    }

    if (!/^ASK-\d{6}$/.test(normalizedCode)) {
      setError("فرمت کد رهگیری صحیح نیست. نمونه صحیح: ASK-123456");
      return;
    }

    setIsSearching(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const found =
      mockRequests.find((item) => item.trackingCode === normalizedCode) ?? null;

    setResult(found);
    setSearched(true);
    setIsSearching(false);
  };

  const handleExampleClick = (code: string) => {
    setTrackingCode(code);
    setError("");
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-100 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <Header />

      <section className="border-b border-slate-200 bg-gradient-to-b from-sky-50 via-slate-100 to-slate-100 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>

          <div className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-4 py-1.5 text-sm text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
              <FileSearch className="h-4 w-4" />
              پیگیری درخواست
            </span>

            <h1 className="mt-4 text-3xl font-black text-slate-950 md:text-5xl dark:text-white">
              پیگیری وضعیت درخواست اسکان
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-700 md:text-base dark:text-zinc-400">
              کد رهگیری دریافتی هنگام ثبت درخواست را وارد کنید تا آخرین وضعیت
              بررسی، نتیجه و اطلاعات مراجعه نمایش داده شود.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            <SearchBox
              trackingCode={trackingCode}
              setTrackingCode={setTrackingCode}
              error={error}
              isSearching={isSearching}
              onSubmit={handleSubmit}
            />

            {searched && !result && !isSearching && (
              <NotFoundBox trackingCode={normalizeTrackingCode(trackingCode)} />
            )}

            {result && (
              <>
                <StatusSummary result={result} />
                <ProcessTimeline status={result.status} />
                <RequestDetails result={result} />

                {(result.status === "approved" ||
                  result.status === "temporary-reserved") &&
                  result.shelter && <ReferralBox result={result} />}

                {result.status === "rejected" && (
                  <RejectedBox reason={result.rejectionReason} />
                )}

                {result.notes && result.notes.length > 0 && (
                  <NotesBox notes={result.notes} />
                )}
              </>
            )}
          </section>

          <aside className="space-y-6">
            <GuideBox />
            <ExamplesBox examples={examples} onSelect={handleExampleClick} />
            <SupportBox />
          </aside>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <Home className="h-6 w-6" />
          </div>

          <div>
            <div className="text-base font-black text-slate-950 dark:text-white">
              سامانه ثبت درخواست اسکان سرای های محله
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">
              پیگیری درخواست
            </div>
          </div>
        </Link>

        <Link
          href="/request/new"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          ثبت درخواست جدید
        </Link>
      </div>
    </header>
  );
}

function SearchBox({
  trackingCode,
  setTrackingCode,
  error,
  isSearching,
  onSubmit,
}: {
  trackingCode: string;
  setTrackingCode: (value: string) => void;
  error: string;
  isSearching: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
        <div className="rounded-2xl border border-sky-300 bg-sky-50 p-3 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
          <Search className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
            جستجوی کد رهگیری
          </h2>
          <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-zinc-400">
            کد رهگیری را با فرمت ASK-123456 وارد کنید.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-800 dark:text-zinc-200">
            کد رهگیری
          </span>

          <input
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="مثلاً ASK-123456"
            dir="ltr"
            className={`w-full rounded-2xl border bg-slate-50 px-4 py-4 text-left text-sm font-bold tracking-wider text-slate-900 outline-none transition placeholder:text-slate-400 dark:bg-zinc-950/70 dark:text-white dark:placeholder:text-zinc-500 ${
              error
                ? "border-red-400/60 focus:border-red-500"
                : "border-slate-300 focus:border-sky-400 dark:border-white/10 dark:focus:border-sky-400/40"
            }`}
          />

          {error && (
            <p className="mt-2 text-right text-xs leading-6 text-red-600 dark:text-red-300">
              {error}
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={isSearching}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-4 text-sm font-extrabold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-sky-400"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              در حال جستجو...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              پیگیری درخواست
            </>
          )}
        </button>
      </form>
    </section>
  );
}

function StatusSummary({ result }: { result: TrackingResult }) {
  const config = getStatusConfig(result.status);

  return (
    <section className={`rounded-[28px] border p-5 md:p-6 ${config.boxClass}`}>
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold ${config.badgeClass}`}
          >
            {config.icon}
            {config.label}
          </div>

          <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
            {result.statusDescription}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-zinc-300">
            آخرین بروزرسانی: {result.updatedAt}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-zinc-950/40">
          <div className="text-xs text-slate-500 dark:text-zinc-400">
            کد رهگیری
          </div>
          <div className="mt-2 text-xl font-black tracking-wider text-slate-950 dark:text-white">
            {result.trackingCode}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessTimeline({ status }: { status: RequestStatus }) {
  const steps = getTimelineSteps(status);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Clock3 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
            مراحل بررسی
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            وضعیت درخواست در فرآیند بررسی و پذیرش
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`relative rounded-[24px] border p-4 ${
              step.done
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                : step.active
                  ? "border-orange-300 bg-orange-50 dark:border-orange-400/20 dark:bg-orange-500/10"
                  : step.failed
                    ? "border-red-300 bg-red-50 dark:border-red-400/20 dark:bg-red-500/10"
                    : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-zinc-950/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  step.done
                    ? "bg-emerald-500 text-white"
                    : step.active
                      ? "bg-orange-500 text-white"
                      : step.failed
                        ? "bg-red-500 text-white"
                        : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-zinc-500"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : step.failed ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-black">
                    {(index + 1).toLocaleString("fa-IR")}
                  </span>
                )}
              </div>

              <div>
                <div className="font-extrabold text-slate-950 dark:text-white">
                  {step.title}
                </div>
                <div className="mt-2 text-xs leading-6 text-slate-600 dark:text-zinc-400">
                  {step.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RequestDetails({ result }: { result: TrackingResult }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
        <div className="rounded-2xl border border-orange-300 bg-orange-50 p-3 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
          <Info className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
            جزئیات درخواست
          </h2>
          <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-zinc-400">
            اطلاعات کلی ثبت‌شده برای درخواست اسکان
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailItem label="نام متقاضی" value={result.applicantName} />
        <DetailItem label="کد ملی" value={result.nationalIdMasked} />
        <DetailItem label="نوع درخواست" value={result.requestType} />
        <DetailItem
          label="تعداد نفرات"
          value={`${result.totalPeople.toLocaleString("fa-IR")} نفر`}
        />
        <DetailItem label="تاریخ ثبت" value={result.createdAt} />
        <DetailItem label="آخرین بروزرسانی" value={result.updatedAt} />
      </div>
    </section>
  );
}

function ReferralBox({ result }: { result: TrackingResult }) {
  if (!result.shelter) return null;

  return (
    <section className="rounded-[28px] border border-emerald-300 bg-emerald-50 p-5 md:p-6 dark:border-emerald-400/20 dark:bg-emerald-500/10">
      <div className="mb-5 flex items-start gap-3 border-b border-emerald-200 pb-4 dark:border-emerald-300/10">
        <div className="rounded-2xl border border-emerald-300 bg-white p-3 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/20 dark:text-emerald-300">
          <Building2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
            اطلاعات مراجعه
          </h2>
          <p className="mt-1 text-sm leading-7 text-emerald-800 dark:text-emerald-100/80">
            برای پذیرش نهایی طبق اطلاعات زیر مراجعه کنید.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-black text-slate-950 dark:text-white">
          {result.shelter.name}
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <DetailItem
            label="محدوده"
            value={`منطقه ${result.shelter.region}، ناحیه ${result.shelter.district}، محله ${result.shelter.neighborhood}`}
          />
          <DetailItem label="زمان مراجعه" value={result.shelter.referralTime} />
          <DetailItem label="شماره تماس" value={result.shelter.phone} />
          <DetailItem label="وضعیت" value="آماده مراجعه" />
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-950/30">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            نشانی
          </div>

          <p className="text-sm leading-7 text-emerald-900 dark:text-emerald-50">
            {result.shelter.address}
          </p>
        </div>

        <Link
          href={`tel:${result.shelter.phone}`}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-600 dark:hover:bg-emerald-400"
        >
          <Phone className="h-4 w-4" />
          تماس با سرا
        </Link>
      </div>
    </section>
  );
}

function RejectedBox({ reason }: { reason?: string }) {
  return (
    <section className="rounded-[28px] border border-red-300 bg-red-50 p-5 md:p-6 dark:border-red-400/20 dark:bg-red-500/10">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-red-100 p-3 text-red-700 dark:bg-red-500/20 dark:text-red-300">
          <ShieldAlert className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
            علت عدم پذیرش
          </h2>

          <p className="mt-3 text-sm leading-7 text-red-900 dark:text-red-100">
            {reason || "علت رد درخواست توسط کارشناس ثبت نشده است."}
          </p>

          <Link
            href="/request/new"
            className="mt-4 inline-flex rounded-2xl bg-red-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-600 dark:hover:bg-red-400"
          >
            ثبت درخواست جدید
          </Link>
        </div>
      </div>
    </section>
  );
}

function NotesBox({ notes }: { notes: string[] }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-white/[0.04]">
      <h2 className="mb-4 text-lg font-extrabold text-slate-950 dark:text-white">
        پیام‌ها و نکات
      </h2>

      <ul className="space-y-3">
        {notes.map((note) => (
          <li
            key={note}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300"
          >
            <Circle className="mt-2 h-2 w-2 shrink-0 fill-orange-500 text-orange-500 dark:fill-orange-400 dark:text-orange-400" />
            {note}
          </li>
        ))}
      </ul>
    </section>
  );
}

function NotFoundBox({ trackingCode }: { trackingCode: string }) {
  return (
    <section className="rounded-[28px] border border-red-300 bg-red-50 p-5 md:p-6 dark:border-red-400/20 dark:bg-red-500/10">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-red-100 p-3 text-red-700 dark:bg-red-500/20 dark:text-red-300">
          <XCircle className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">
            درخواستی با این کد یافت نشد
          </h2>

          <p className="mt-2 text-sm leading-7 text-red-900 dark:text-red-100">
            برای کد رهگیری{" "}
            <span
              dir="ltr"
              className="font-bold text-slate-950 dark:text-white"
            >
              {trackingCode}
            </span>{" "}
            نتیجه‌ای ثبت نشده است. لطفاً کد را بررسی کرده و دوباره تلاش کنید.
          </p>
        </div>
      </div>
    </section>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-zinc-950/40">
      <div className="text-xs text-slate-500 dark:text-zinc-500">{label}</div>
      <div className="mt-2 text-sm font-bold leading-7 text-slate-950 dark:text-white">
        {value || "ثبت نشده"}
      </div>
    </div>
  );
}

function GuideBox() {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl border border-sky-300 bg-sky-50 p-3 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
          <Info className="h-5 w-5" />
        </div>

        <h3 className="font-extrabold text-slate-950 dark:text-white">
          راهنمای پیگیری
        </h3>
      </div>

      <ul className="space-y-3 text-sm leading-7 text-slate-700 dark:text-zinc-300">
        <li>کد رهگیری پس از ثبت درخواست نمایش داده می‌شود.</li>
        <li>کد رهگیری با عبارت ASK شروع می‌شود.</li>
        <li>وضعیت درخواست ممکن است پس از بررسی کارشناسان تغییر کند.</li>
        <li>در صورت تأیید، اطلاعات مراجعه در همین صفحه نمایش داده می‌شود.</li>
      </ul>
    </aside>
  );
}

function ExamplesBox({
  examples,
  onSelect,
}: {
  examples: string[];
  onSelect: (code: string) => void;
}) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h3 className="mb-3 font-extrabold text-slate-950 dark:text-white">
        کدهای نمونه تست
      </h3>

      <div className="space-y-2">
        {examples.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => onSelect(code)}
            dir="ltr"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-bold tracking-wider text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            {code}
          </button>
        ))}
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
        اگر کد رهگیری را در اختیار ندارید یا نتیجه‌ای مشاهده نمی‌کنید، با مرکز
        پشتیبانی تماس بگیرید.
      </p>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-950 dark:border-white/10 dark:bg-zinc-950/30 dark:text-white">
        ۰۲۱-۰۰۰۰۰۰۰۰
      </div>
    </aside>
  );
}

function getStatusConfig(status: RequestStatus) {
  switch (status) {
    case "pending":
      return {
        label: "در انتظار بررسی",
        icon: <Clock3 className="h-4 w-4" />,
        boxClass:
          "border-orange-300 bg-orange-50 dark:border-orange-400/20 dark:bg-orange-500/10",
        badgeClass:
          "border-orange-300 bg-white text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300",
      };

    case "approved":
      return {
        label: "تأیید شده",
        icon: <BadgeCheck className="h-4 w-4" />,
        boxClass:
          "border-emerald-300 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10",
        badgeClass:
          "border-emerald-300 bg-white text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300",
      };

    case "temporary-reserved":
      return {
        label: "رزرو موقت",
        icon: <BedDouble className="h-4 w-4" />,
        boxClass:
          "border-sky-300 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-500/10",
        badgeClass:
          "border-sky-300 bg-white text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300",
      };

    case "rejected":
      return {
        label: "رد شده",
        icon: <XCircle className="h-4 w-4" />,
        boxClass:
          "border-red-300 bg-red-50 dark:border-red-400/20 dark:bg-red-500/10",
        badgeClass:
          "border-red-300 bg-white text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300",
      };

    default:
      return {
        label: "نامشخص",
        icon: <Info className="h-4 w-4" />,
        boxClass:
          "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5",
        badgeClass:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300",
      };
  }
}

function getTimelineSteps(status: RequestStatus) {
  const base = [
    {
      title: "ثبت درخواست",
      description: "اطلاعات اولیه درخواست در سامانه ثبت شده است.",
      done: true,
      active: false,
      failed: false,
    },
    {
      title: "بررسی کارشناسی",
      description: "اطلاعات و شرایط متقاضی توسط کارشناس بررسی می‌شود.",
      done: false,
      active: false,
      failed: false,
    },
    {
      title: "اعلام نتیجه",
      description: "نتیجه بررسی و وضعیت پذیرش مشخص می‌شود.",
      done: false,
      active: false,
      failed: false,
    },
    {
      title: "مراجعه و پذیرش",
      description: "در صورت تأیید، متقاضی برای پذیرش نهایی مراجعه می‌کند.",
      done: false,
      active: false,
      failed: false,
    },
  ];

  if (status === "pending") {
    return base.map((step, index) => ({
      ...step,
      done: index === 0,
      active: index === 1,
    }));
  }

  if (status === "approved" || status === "temporary-reserved") {
    return base.map((step, index) => ({
      ...step,
      done: index <= 2,
      active: index === 3,
    }));
  }

  if (status === "rejected") {
    return base.map((step, index) => ({
      ...step,
      done: index <= 1,
      failed: index === 2,
      active: false,
    }));
  }

  return base;
}
