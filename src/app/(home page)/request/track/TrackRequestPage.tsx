"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BedDouble,
  Building2,
  CheckCircle2,
  Circle,
  Clock3,
  FileSearch,
  Info,
  Loader2,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type RequestStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "reserved"
  | "rejected"
  | "admitted"
  | "completed"
  | "cancelled";

type ApiResponse = {
  message?: string;
  data?: {
    id: number;
    request_number: string;
    applicant_type?: string;
    request_type?: string;
    status: RequestStatus;
    rejection_reason?: string | null;
    review_note?: string | null;
    created_at?: string;
    updated_at?: string;
    applicant?: {
      name?: string;
      national_code?: string;
      mobile?: string;
    };
    household?: {
      size?: number;
    };
    dates?: {
      reviewed_at?: string | null;
      requested_from?: string | null;
      requested_until?: string | null;
    };
    neighborhood_hall?: {
      id?: number;
      name?: string;
      slug?: string;
      address?: string;
      phone?: string;
    } | null;
    latest_reservation?: {
      id?: number;
      status?: string;
    } | null;
    meta?: Record<string, any>;
  };
};

type TrackingResult = {
  trackingCode: string;
  applicantName: string;
  nationalIdMasked: string;
  requestType: string;
  totalPeople: number;
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;
  statusDescription: string;
  shelter?: {
    name: string;
    address: string;
    phone?: string;
    referralTime?: string;
  };
  rejectionReason?: string;
  notes?: string[];
};

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function normalizeTrackingCode(value: string) {
  return normalizeDigits(value).trim().toUpperCase().replace(/\s+/g, "");
}

function maskNationalCode(value?: string) {
  if (!value) return "ثبت نشده";
  if (value.length < 6) return value;
  return `${value.slice(0, 3)}***${value.slice(-4)}`;
}

function formatFaDate(value?: string | null) {
  if (!value) return "ثبت نشده";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function mapRequestType(applicantType?: string, requestType?: string) {
  if (applicantType === "men") return "آقایان";
  if (applicantType === "women") return "بانوان";
  if (applicantType === "family") return "خانواده";

  if (requestType === "family") return "خانواده";
  if (requestType === "temporary") return "موقت";
  if (requestType === "emergency") return "اضطراری";
  if (requestType === "referral") return "ارجاعی";

  return "ثبت نشده";
}

function getStatusDescription(status: RequestStatus) {
  switch (status) {
    case "submitted":
      return "درخواست شما ثبت شده و در صف بررسی کارشناسان قرار دارد.";
    case "under_review":
      return "درخواست شما در حال بررسی توسط کارشناسان است.";
    case "approved":
      return "درخواست شما تأیید شده و منتظر تخصیص یا مراجعه است.";
    case "reserved":
      return "برای درخواست شما ظرفیت رزرو شده است.";
    case "rejected":
      return "درخواست شما پس از بررسی رد شده است.";
    case "admitted":
      return "پذیرش شما نهایی شده است.";
    case "completed":
      return "فرآیند درخواست شما تکمیل شده است.";
    case "cancelled":
      return "درخواست شما لغو شده است.";
    default:
      return "وضعیت درخواست نامشخص است.";
  }
}

function mapApiToTrackingResult(item: ApiResponse["data"]): TrackingResult {
  const notes: string[] = [];

  if (item?.review_note) notes.push(item.review_note);
  if (item?.meta?.current_status) {
    notes.push(`وضعیت فعلی ثبت‌شده: ${item.meta.current_status}`);
  }

  return {
    trackingCode: item?.request_number || "-",
    applicantName: item?.applicant?.name || "ثبت نشده",
    nationalIdMasked: maskNationalCode(item?.applicant?.national_code),
    requestType: mapRequestType(item?.applicant_type, item?.request_type),
    totalPeople: Number(item?.household?.size || 0),
    createdAt: formatFaDate(item?.created_at),
    updatedAt: formatFaDate(item?.updated_at),
    status: item?.status || "submitted",
    statusDescription: getStatusDescription(item?.status || "submitted"),
    shelter: item?.neighborhood_hall
      ? {
          name: item.neighborhood_hall.name || "سرای تخصیص‌یافته",
          address: item.neighborhood_hall.address || "ثبت نشده",
          phone: item.neighborhood_hall.phone || undefined,
        }
      : undefined,
    rejectionReason: item?.rejection_reason || undefined,
    notes,
  };
}

function getStatusConfig(status: RequestStatus) {
  switch (status) {
    case "submitted":
      return {
        label: "ثبت شده",
        icon: <Clock3 className="h-4 w-4" />,
        boxClass:
          "border-orange-300 bg-orange-50 dark:border-orange-400/20 dark:bg-orange-500/10",
        badgeClass:
          "border-orange-300 bg-white text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300",
      };

    case "under_review":
      return {
        label: "در حال بررسی",
        icon: <FileSearch className="h-4 w-4" />,
        boxClass:
          "border-sky-300 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-500/10",
        badgeClass:
          "border-sky-300 bg-white text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300",
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

    case "reserved":
      return {
        label: "رزرو شده",
        icon: <BedDouble className="h-4 w-4" />,
        boxClass:
          "border-sky-300 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-500/10",
        badgeClass:
          "border-sky-300 bg-white text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300",
      };

    case "admitted":
      return {
        label: "پذیرش شده",
        icon: <CheckCircle2 className="h-4 w-4" />,
        boxClass:
          "border-emerald-300 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10",
        badgeClass:
          "border-emerald-300 bg-white text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300",
      };

    case "completed":
      return {
        label: "تکمیل شده",
        icon: <CheckCircle2 className="h-4 w-4" />,
        boxClass:
          "border-slate-300 bg-slate-50 dark:border-white/10 dark:bg-white/5",
        badgeClass:
          "border-slate-300 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300",
      };

    case "cancelled":
      return {
        label: "لغو شده",
        icon: <XCircle className="h-4 w-4" />,
        boxClass:
          "border-slate-300 bg-slate-50 dark:border-white/10 dark:bg-white/5",
        badgeClass:
          "border-slate-300 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300",
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

  if (status === "submitted") {
    return base.map((step, index) => ({
      ...step,
      done: index === 0,
      active: index === 1,
    }));
  }

  if (status === "under_review") {
    return base.map((step, index) => ({
      ...step,
      done: index === 0,
      active: index === 1,
    }));
  }

  if (status === "approved") {
    return base.map((step, index) => ({
      ...step,
      done: index <= 2,
      active: index === 3,
    }));
  }

  if (status === "reserved" || status === "admitted") {
    return base.map((step, index) => ({
      ...step,
      done: index <= 3,
      active: false,
    }));
  }

  if (status === "rejected" || status === "cancelled") {
    return base.map((step, index) => ({
      ...step,
      done: index <= 1,
      failed: index === 2,
      active: false,
    }));
  }

  if (status === "completed") {
    return base.map((step) => ({
      ...step,
      done: true,
      active: false,
      failed: false,
    }));
  }

  return base;
}

export default function TrackRequestPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

    if (!/^REQ-\d{8}-[A-Z0-9]{6}$/.test(normalizedCode)) {
      setError("فرمت کد رهگیری صحیح نیست. نمونه صحیح: REQ-20260609-ABC123");
      return;
    }

    try {
      setIsSearching(true);

      const response = await fetch(
        `/api/shelter-requests/track/${encodeURIComponent(normalizedCode)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        setError(data?.message || "درخواستی با این کد یافت نشد.");
        setSearched(true);
        return;
      }

      if (!data?.data) {
        setError("اطلاعات درخواست قابل دریافت نیست.");
        setSearched(true);
        return;
      }

      setResult(mapApiToTrackingResult(data.data));
      setSearched(true);
    } catch {
      setError("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
      setSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-100 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
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
                  result.status === "reserved" ||
                  result.status === "admitted") &&
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
            <SupportBox />
          </aside>
        </div>
      </section>
    </main>
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
            کد رهگیری را با فرمت REQ-20260609-ABC123 وارد کنید.
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
            placeholder="مثلاً REQ-20260609-ABC123"
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
    <section
      className={`rounded-[28px] border p-5 shadow-sm md:p-6 dark:border-white/10 ${config.boxClass}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${config.badgeClass}`}
          >
            {config.icon}
            {config.label}
          </div>

          <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
            وضعیت درخواست: {config.label}
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-zinc-300">
            {result.statusDescription}
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm dark:bg-black/20">
          <p className="text-slate-500 dark:text-zinc-400">کد رهگیری</p>
          <p className="mt-1 font-extrabold tracking-wider text-slate-900 dark:text-white">
            {result.trackingCode}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProcessTimeline({ status }: { status: RequestStatus }) {
  const steps = getTimelineSteps(status);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-white/[0.04]">
      <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
        روند بررسی درخواست
      </h3>

      <div className="mt-6 space-y-5">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              {step.done ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : step.failed ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : step.active ? (
                <Clock3 className="h-5 w-5 text-sky-500" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300 dark:text-zinc-600" />
              )}

              {index < steps.length - 1 && (
                <div className="mt-2 h-10 w-px bg-slate-200 dark:bg-white/10" />
              )}
            </div>

            <div className="pb-2">
              <h4 className="font-bold text-slate-900 dark:text-white">
                {step.title}
              </h4>
              <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-zinc-400">
                {step.description}
              </p>
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
      <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
        اطلاعات درخواست
      </h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <DetailItem label="نام متقاضی" value={result.applicantName} />
        <DetailItem label="کد ملی" value={result.nationalIdMasked} />
        <DetailItem label="نوع درخواست" value={result.requestType} />
        <DetailItem label="تعداد نفرات" value={String(result.totalPeople)} />
        <DetailItem label="زمان ثبت درخواست" value={result.createdAt} />
        <DetailItem label="آخرین بروزرسانی" value={result.updatedAt} />
      </div>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-zinc-950/50">
      <p className="text-xs text-slate-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function ReferralBox({ result }: { result: TrackingResult }) {
  return (
    <section className="rounded-[28px] border border-emerald-300 bg-emerald-50 p-5 shadow-sm md:p-6 dark:border-emerald-400/20 dark:bg-emerald-500/10">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-emerald-300 bg-white p-3 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Building2 className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
            اطلاعات محل مراجعه
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-zinc-300">
            <div className="flex items-start gap-2">
              <Building2 className="mt-0.5 h-4 w-4" />
              <span>{result.shelter?.name}</span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4" />
              <span>{result.shelter?.address}</span>
            </div>

            {result.shelter?.phone && (
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4" />
                <span>{result.shelter.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RejectedBox({ reason }: { reason?: string }) {
  return (
    <section className="rounded-[28px] border border-red-300 bg-red-50 p-5 shadow-sm md:p-6 dark:border-red-400/20 dark:bg-red-500/10">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-red-300 bg-white p-3 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
          <ShieldAlert className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
            دلیل رد درخواست
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-zinc-300">
            {reason || "دلیلی برای رد درخواست ثبت نشده است."}
          </p>
        </div>
      </div>
    </section>
  );
}

function NotesBox({ notes }: { notes: string[] }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-white/[0.04]">
      <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
        توضیحات تکمیلی
      </h3>

      <ul className="mt-4 space-y-3">
        {notes.map((note, index) => (
          <li
            key={index}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-300"
          >
            {note}
          </li>
        ))}
      </ul>
    </section>
  );
}

function NotFoundBox({ trackingCode }: { trackingCode: string }) {
  return (
    <section className="rounded-[28px] border border-red-300 bg-red-50 p-5 shadow-sm md:p-6 dark:border-red-400/20 dark:bg-red-500/10">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-red-300 bg-white p-3 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
          <XCircle className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
            درخواستی یافت نشد
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-zinc-300">
            برای کد رهگیری {trackingCode || "واردشده"} اطلاعاتی پیدا نشد. لطفاً
            کد را بررسی کرده و دوباره تلاش کنید.
          </p>
        </div>
      </div>
    </section>
  );
}

function GuideBox() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
        راهنمای پیگیری
      </h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-zinc-400">
        <li>• کد رهگیری را دقیقاً مطابق پیام ثبت درخواست وارد کنید.</li>
        <li>• حروف انگلیسی کد به صورت خودکار بزرگ می‌شوند.</li>
        <li>• در صورت عدم یافتن نتیجه، با پشتیبانی تماس بگیرید.</li>
      </ul>
    </section>
  );
}

function SupportBox() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
        پشتیبانی
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-zinc-400">
        در صورت وجود مشکل در مشاهده وضعیت درخواست، با واحد پشتیبانی سامانه تماس
        بگیرید.
      </p>
    </section>
  );
}
