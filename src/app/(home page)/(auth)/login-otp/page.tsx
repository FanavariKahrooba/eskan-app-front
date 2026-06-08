// app/(auth)/login-otp/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { ArrowLeft, Loader2, Phone, RotateCcw } from "lucide-react";
import AuthShell from "@/components/auth/new/AuthShell";
import OtpInput from "@/components/auth/new/OtpInput";
import { useAuth } from "@/hooks/auth/auth";

const noop = () => {};

export default function LoginOtpPage() {
  const router = useRouter();
  const { registerOtp, VerifyOtp } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/console/dashboard",
  });
  const noop = () => {};
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  function normalizePhone(raw: string): string {
    let d = raw.replace(/\D/g, ""); // فقط ارقام
    if (d.startsWith("0098"))
      d = d.slice(4); // 0098... -> ...
    else if (d.startsWith("98"))
      d = d.slice(2); // 98...  -> ...
    else if (d.startsWith("0")) d = d.slice(1); // 09...   -> 9...
    // اکنون d باید با 9 شروع شود (۱۰ رقم)
    return "+98" + d;
  }

  // اعتبارسنجی: +98 سپس شماره موبایل ۱۰ رقمی که با 9 شروع می‌شود
  function isValidPhone(intl: string): boolean {
    return /^\+989\d{9}$/.test(intl);
  }
  // شمارش معکوس ارسال مجدد بر اساس کوکی ExpTime
  useEffect(() => {
    const tick = () => {
      const exp = getCookie("ExpTime") as string | undefined;
      if (!exp) return setSeconds(0);
      const diff = Math.round((new Date(exp).getTime() - Date.now()) / 1000);
      setSeconds(diff > 0 ? diff : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [step]);

  const sendOtp = async () => {
    setError(null);
    const intlPhone = normalizePhone(phone);
    if (!isValidPhone(intlPhone)) {
      setError("شماره موبایل معتبر نیست. (مثال: +989121234567)");
      return;
    }
    setLoading(true);
    const res = await registerOtp({ setErrors: noop, phone_number: intlPhone });
    setLoading(false);

    if (res.success) {
      setStep("otp");
    } else if (res.reg) {
      setError("این شماره ثبت نشده است. لطفاً ابتدا ثبت‌نام کنید.");
      router.push("/register");
    } else {
      setError("ارسال کد ناموفق بود. لطفاً دوباره تلاش کنید.");
    }
  };

  const verify = async () => {
    setError(null);
    if (code.length !== 5) {
      setError("کد تأیید باید ۵ رقم باشد.");
      return;
    }
    const userId = getCookie("ct_ot");
    if (!userId) {
      setError("نشست منقضی شده است. لطفاً دوباره کد دریافت کنید.");
      setStep("phone");
      return;
    }
    setLoading(true);
    const res = await VerifyOtp({
      setErrors: noop,
      user_id: userId,
      otp_code: code,
    });
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else if (res.message === "Expired") {
      setError("کد منقضی شده است. کد جدید دریافت کنید.");
    } else {
      setError("کد وارد شده نادرست است.");
    }
  };

  return (
    <AuthShell badge="ورود با کد یکبار مصرف">
      {step === "phone" ? (
        <>
          <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
            ورود به سامانه
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-zinc-400">
            شماره موبایل خود را وارد کنید تا کد تأیید برایتان ارسال شود.
          </p>

          <label className="mt-6 block text-sm font-bold text-slate-700 dark:text-zinc-300">
            شماره موبایل
          </label>
          <div className="relative mt-2">
            <Phone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              dir="ltr"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                setPhone(normalizePhone(e.target.value).slice(0, 13));
              }}
              onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              placeholder="+989121234567"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-4 pr-11 text-left font-bold text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
          </div>

          {error && (
            <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}

          <button
            onClick={sendOtp}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-600 bg-orange-600 px-6 py-3 text-sm font-extrabold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-500 disabled:opacity-70 dark:border-orange-500 dark:bg-orange-500 dark:hover:bg-orange-400"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                دریافت کد تأیید
                <ArrowLeft className="h-4 w-4" />
              </>
            )}
          </button>
        </>
      ) : (
        <>
          <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
            کد تأیید را وارد کنید
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-zinc-400">
            کد ۵ رقمی ارسال‌شده به شماره{" "}
            <span dir="ltr" className="font-bold">
              {normalizePhone(phone)}
            </span>{" "}
            را وارد کنید.
          </p>

          <OtpInput value={code} onChange={setCode} disabled={loading} />

          {error && (
            <p className="mt-3 text-center text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}

          <button
            onClick={verify}
            disabled={loading || code.length !== 5}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-600 bg-orange-600 px-6 py-3 text-sm font-extrabold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-500 disabled:opacity-60 dark:border-orange-500 dark:bg-orange-500 dark:hover:bg-orange-400"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ورود"}
          </button>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              onClick={() => {
                setStep("phone");
                setCode("");
                setError(null);
              }}
              className="text-slate-500 transition hover:text-orange-700 dark:text-zinc-400 dark:hover:text-orange-300"
            >
              تغییر شماره
            </button>

            <button
              onClick={sendOtp}
              disabled={seconds > 0 || loading}
              className="inline-flex items-center gap-1.5 text-orange-700 transition disabled:text-slate-400 dark:text-orange-300 dark:disabled:text-zinc-600"
            >
              <RotateCcw className="h-4 w-4" />
              {seconds > 0 ? `ارسال مجدد تا ${seconds} ثانیه` : "ارسال مجدد کد"}
            </button>
          </div>
        </>
      )}
    </AuthShell>
  );
}
