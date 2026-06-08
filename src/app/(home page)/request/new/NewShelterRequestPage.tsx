"use client";

import { useMemo, useRef, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  FileText,
  HeartPulse,
  Home,
  Loader2,
  ShieldCheck,
  Upload,
  User,
  Users,
} from "lucide-react";

type RequestType = "male" | "female" | "family";

type FormDataState = {
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalId: string;
  mobile: string;
  age: string;
  totalPeople: string;
  menCount: string;
  womenCount: string;
  childrenCount: string;
  currentStatus: string;
  description: string;
  hasInfant: boolean;
  hasElderly: boolean;
  hasPatient: boolean;
  hasDisability: boolean;
  needsAccessibility: boolean;
  urgent: boolean;
};

type FormErrors = Partial<
  Record<
    | keyof FormDataState
    | "general"
    | "requestedFrom"
    | "requestedUntil"
    | "nationalCardFile",
    string
  >
>;

const CURRENT_STATUS_OPTIONS = [

  "ارجاع از نهاد حمایتی",
  "نیازمند اسکان موقت",
];

const initialFormData: FormDataState = {
  firstName: "",
  lastName: "",
  fatherName: "",
  nationalId: "",
  mobile: "",
  age: "",
  totalPeople: "",
  menCount: "",
  womenCount: "",
  childrenCount: "",
  currentStatus: "",
  description: "",
  hasInfant: false,
  hasElderly: false,
  hasPatient: false,
  hasDisability: false,
  needsAccessibility: false,
  urgent: false,
};

function normalizeDigits(value: string) {
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";

  return value
    .replace(/[۰-۹]/g, (d) => String(fa.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ar.indexOf(d)));
}

function onlyDigits(value: string) {
  return normalizeDigits(value).replace(/\D/g, "");
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatGregorianDateOnly(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} 00:00:00`;
}

function mapApplicantType(type: RequestType) {
  if (type === "male") return "men";
  if (type === "female") return "women";
  return "family";
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{message}</p>
  );
}

function Section({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-5 flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  inputMode,
  error,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required ? <span className="mr-1 text-rose-500">*</span> : null}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
          "bg-white text-slate-900 placeholder:text-slate-400",
          "dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500",
          error
            ? "border-rose-400 focus:border-rose-500"
            : "border-slate-200 focus:border-emerald-500",
        )}
      />
      <FieldError message={error} />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
          "bg-white text-slate-900 placeholder:text-slate-400",
          "dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500",
          error
            ? "border-rose-400 focus:border-rose-500"
            : "border-slate-200 focus:border-emerald-500",
        )}
      />
      <FieldError message={error} />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required ? <span className="mr-1 text-rose-500">*</span> : null}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none rounded-2xl border px-4 py-3 text-sm outline-none transition",
            "bg-white text-slate-900 dark:bg-slate-900 dark:text-white",
            "dark:border-slate-700",
            error
              ? "border-rose-400 focus:border-rose-500"
              : "border-slate-200 focus:border-emerald-500",
          )}
        >
          <option value="">{placeholder || "انتخاب کنید"}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      <FieldError message={error} />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
      />
      <span>{label}</span>
    </label>
  );
}

function SelectableCard({
  selected,
  title,
  description,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border p-4 text-right transition",
        selected
          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
          : "border-slate-200 bg-white text-slate-800 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <div className="font-semibold">{title}</div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </button>
  );
}

function UploadBox({
  title,
  hint,
  required,
  multiple = false,
  files,
  onChange,
  error,
}: {
  title: string;
  hint?: string;
  required?: boolean;
  multiple?: boolean;
  files?: File[];
  onChange?: (files: File[]) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        <div className="mb-2 flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
          <Upload className="h-4 w-4" />
          <span>{title}</span>
          {required ? <span className="text-rose-500">*</span> : null}
        </div>

        {hint ? (
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        ) : null}

        <input
          type="file"
          multiple={multiple}
          accept=".jpg,.jpeg,.png,.pdf"
          className="block w-full text-xs text-slate-500 file:ml-3 file:rounded-xl file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-white hover:file:bg-emerald-700 dark:text-slate-300"
          onChange={(e) => {
            const nextFiles = Array.from(e.target.files || []);
            onChange?.(nextFiles);
          }}
        />

        {files && files.length > 0 ? (
          <ul className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="truncate">
                {file.name}
              </li>
            ))}
          </ul>
        ) : null}
      </label>
      <FieldError message={error} />
    </div>
  );
}

function SuccessBox({
  trackingCode,
  onReset,
}: {
  trackingCode: string;
  onReset: () => void;
}) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900/50 dark:bg-slate-950">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          درخواست شما با موفقیت ثبت شد
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          درخواست اسکان شما در سامانه ثبت شد. پس از بررسی توسط کارشناسان، نتیجه
          از طریق پیامک یا تماس اطلاع‌رسانی خواهد شد.
        </p>

        <div className="mt-6 w-full rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-700 dark:bg-emerald-500/10">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            کد پیگیری
          </p>
          <p className="mt-2 text-2xl font-black tracking-wider text-emerald-700 dark:text-emerald-300">
            {trackingCode || "-"}
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-6 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          ثبت درخواست جدید
        </button>
      </div>
    </div>
  );
}

export default function ShelterRequestPage() {
  const topRef = useRef<HTMLDivElement | null>(null);

  const [requestType, setRequestType] = useState<RequestType>("family");
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const [requestedFrom, setRequestedFrom] = useState<any>(null);
  const [requestedUntil, setRequestedUntil] = useState<any>(null);

  const [nationalCardFile, setNationalCardFile] = useState<File | null>(null);
  const [companionsFiles, setCompanionsFiles] = useState<File[]>([]);
  const [introductionFiles, setIntroductionFiles] = useState<File[]>([]);
  const [otherFiles, setOtherFiles] = useState<File[]>([]);

  const nationalCardFiles = useMemo(
    () => (nationalCardFile ? [nationalCardFile] : []),
    [nationalCardFile],
  );

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateField = <K extends keyof FormDataState>(
    key: K,
    value: FormDataState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, general: undefined }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "نام الزامی است.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است.";
    }

    const nationalId = onlyDigits(formData.nationalId);
    if (!nationalId) {
      newErrors.nationalId = "کد ملی الزامی است.";
    } else if (nationalId.length !== 10) {
      newErrors.nationalId = "کد ملی باید ۱۰ رقم باشد.";
    }

    const mobile = onlyDigits(formData.mobile);
    if (!mobile) {
      newErrors.mobile = "شماره موبایل الزامی است.";
    } else if (mobile.length !== 11) {
      newErrors.mobile = "شماره موبایل باید ۱۱ رقم باشد.";
    }

    if (!formData.totalPeople.trim()) {
      newErrors.totalPeople = "تعداد کل نفرات الزامی است.";
    } else if (Number(onlyDigits(formData.totalPeople)) < 1) {
      newErrors.totalPeople = "تعداد کل نفرات باید حداقل ۱ باشد.";
    }

    if (!formData.currentStatus.trim()) {
      newErrors.currentStatus = "وضعیت فعلی الزامی است.";
    }

    if (requestType === "family") {
      if (!formData.menCount.trim()) {
        newErrors.menCount = "تعداد مردان را وارد کنید.";
      }
      if (!formData.womenCount.trim()) {
        newErrors.womenCount = "تعداد زنان را وارد کنید.";
      }
      if (!formData.childrenCount.trim()) {
        newErrors.childrenCount = "تعداد کودکان را وارد کنید.";
      }
    }

    if (!requestedFrom) {
      newErrors.requestedFrom = "تاریخ شروع اقامت الزامی است.";
    }

    if (!requestedUntil) {
      newErrors.requestedUntil = "تاریخ پایان اقامت الزامی است.";
    }

    if (requestedFrom && requestedUntil) {
      const fromDate = requestedFrom?.toDate?.();
      const untilDate = requestedUntil?.toDate?.();

      if (fromDate && untilDate && untilDate < fromDate) {
        newErrors.requestedUntil =
          "تاریخ پایان اقامت باید بعد از تاریخ شروع باشد.";
      }
    }

    if (!nationalCardFile) {
      newErrors.nationalCardFile = "تصویر کارت ملی الزامی است.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setSubmitted(false);
    setTrackingCode("");
    setRequestType("family");
    setFormData(initialFormData);
    setErrors({});
    setRequestedFrom(null);
    setRequestedUntil(null);
    setNationalCardFile(null);
    setCompanionsFiles([]);
    setIntroductionFiles([]);
    setOtherFiles([]);
    scrollToTop();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      scrollToTop();
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const form = new FormData();

      form.append(
        "applicant_name",
        `${formData.firstName} ${formData.lastName}`.trim(),
      );
      form.append("applicant_national_code", onlyDigits(formData.nationalId));
      form.append("applicant_mobile", onlyDigits(formData.mobile));
      form.append("applicant_type", mapApplicantType(requestType));

      form.append("household_size", onlyDigits(formData.totalPeople));

      if (requestType === "family") {
        form.append("men_count", onlyDigits(formData.menCount || "0"));
        form.append("women_count", onlyDigits(formData.womenCount || "0"));
        form.append(
          "children_count",
          onlyDigits(formData.childrenCount || "0"),
        );
      } else if (requestType === "male") {
        form.append("men_count", onlyDigits(formData.totalPeople || "1"));
        form.append("women_count", "0");
        form.append("children_count", "0");
      } else {
        form.append("men_count", "0");
        form.append("women_count", onlyDigits(formData.totalPeople || "1"));
        form.append("children_count", "0");
      }

      form.append("elderly_count", formData.hasElderly ? "1" : "0");
      form.append("disabled_count", formData.hasDisability ? "1" : "0");

      form.append("request_type", "temporary");
      form.append(
        "requested_from",
        formatGregorianDateOnly(requestedFrom.toDate()),
      );
      form.append(
        "requested_until",
        formatGregorianDateOnly(requestedUntil.toDate()),
      );

      form.append("needs_medical_support", formData.hasPatient ? "1" : "0");
      form.append(
        "needs_accessibility",
        formData.needsAccessibility ? "1" : "0",
      );
      form.append("needs_separate_space", requestType === "family" ? "1" : "0");

      form.append("description", formData.description || "");

      form.append("meta[applicant_type]", mapApplicantType(requestType));
      form.append("meta[father_name]", formData.fatherName || "");
      form.append("meta[age]", onlyDigits(formData.age || ""));
      form.append("meta[current_status]", formData.currentStatus || "");
      form.append("meta[has_infant]", formData.hasInfant ? "1" : "0");
      form.append("meta[urgent_need]", formData.urgent ? "1" : "0");
      form.append("meta[has_elderly]", formData.hasElderly ? "1" : "0");
      form.append("meta[has_patient]", formData.hasPatient ? "1" : "0");
      form.append("meta[has_disability]", formData.hasDisability ? "1" : "0");

      if (nationalCardFile) {
        form.append("national_card_image", nationalCardFile);
      }

      companionsFiles.forEach((file) => {
        form.append("companions_identity_documents[]", file);
      });

      introductionFiles.forEach((file) => {
        form.append("introduction_documents[]", file);
      });

      otherFiles.forEach((file) => {
        form.append("other_documents[]", file);
      });

      const response = await fetch("/api/shelter-requests", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (!response.ok) {
        if (result?.errors) {
          const backendErrors: FormErrors = {};
          const errorEntries = Object.entries(
            result.errors as Record<string, string[]>,
          );

          for (const [key, value] of errorEntries) {
            const message = Array.isArray(value) ? value[0] : String(value);

            if (key === "applicant_name") backendErrors.general = message;
            else if (key === "applicant_national_code")
              backendErrors.nationalId = message;
            else if (key === "applicant_mobile") backendErrors.mobile = message;
            else if (key === "household_size")
              backendErrors.totalPeople = message;
            else if (key === "men_count") backendErrors.menCount = message;
            else if (key === "women_count") backendErrors.womenCount = message;
            else if (key === "children_count")
              backendErrors.childrenCount = message;
            else if (key === "requested_from")
              backendErrors.requestedFrom = message;
            else if (key === "requested_until")
              backendErrors.requestedUntil = message;
            else if (key === "national_card_image")
              backendErrors.nationalCardFile = message;
            else if (key === "meta.current_status")
              backendErrors.currentStatus = message;
            else if (!backendErrors.general) backendErrors.general = message;
          }

          setErrors(backendErrors);
        } else {
          setErrors({
            general: result?.message || "ثبت درخواست با خطا مواجه شد.",
          });
        }

        scrollToTop();
        return;
      }

      setTrackingCode(
        result?.tracking_code || result?.data?.request_number || "",
      );
      setSubmitted(true);
      scrollToTop();
    } catch {
      setErrors({
        general: "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.",
      });
      scrollToTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        ref={topRef}
        className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 lg:px-8"
      >
        <SuccessBox trackingCode={trackingCode} onReset={resetForm} />
      </div>
    );
  }

  return (
    <div
      ref={topRef}
      className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 lg:px-8"
    >
      <div className="mb-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-emerald-500/10 dark:to-slate-950">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-emerald-600 p-3 text-white">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              ثبت درخواست اسکان
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              لطفاً اطلاعات خود را با دقت وارد کنید. پس از ثبت، درخواست شما توسط
              کارشناسان بررسی شده و کد پیگیری برای شما صادر می‌شود.
            </p>
          </div>
        </div>
      </div>

      {errors.general ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-500/10 dark:text-rose-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{errors.general}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section
          title="نوع متقاضی"
          description="نوع درخواست‌کننده را انتخاب کنید."
          icon={<Users className="h-5 w-5" />}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <SelectableCard
              selected={requestType === "male"}
              title="آقایان"
              description="برای متقاضیان مرد"
              icon={<User className="h-4 w-4" />}
              onClick={() => setRequestType("male")}
            />
            <SelectableCard
              selected={requestType === "female"}
              title="بانوان"
              description="برای متقاضیان زن"
              icon={<User className="h-4 w-4" />}
              onClick={() => setRequestType("female")}
            />
            <SelectableCard
              selected={requestType === "family"}
              title="خانواده"
              description="برای خانواده‌ها و همراهان"
              icon={<Users className="h-4 w-4" />}
              onClick={() => setRequestType("family")}
            />
          </div>
        </Section>

        <Section
          title="اطلاعات هویتی"
          description="مشخصات فرد متقاضی را وارد کنید."
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="نام"
              required
              value={formData.firstName}
              onChange={(value) => updateField("firstName", value)}
              placeholder="مثلاً علی"
              error={errors.firstName}
            />
            <Input
              label="نام خانوادگی"
              required
              value={formData.lastName}
              onChange={(value) => updateField("lastName", value)}
              placeholder="مثلاً رضایی"
              error={errors.lastName}
            />
            <Input
              label="نام پدر"
              value={formData.fatherName}
              onChange={(value) => updateField("fatherName", value)}
              placeholder="اختیاری"
              error={errors.fatherName}
            />
            <Input
              label="سن"
              value={formData.age}
              onChange={(value) => updateField("age", onlyDigits(value))}
              placeholder="مثلاً ۳۵"
              inputMode="numeric"
              error={errors.age}
            />
            <Input
              label="کد ملی"
              required
              value={formData.nationalId}
              onChange={(value) => updateField("nationalId", onlyDigits(value))}
              placeholder="۱۰ رقم"
              inputMode="numeric"
              maxLength={10}
              error={errors.nationalId}
            />
            <Input
              label="شماره موبایل"
              required
              value={formData.mobile}
              onChange={(value) => updateField("mobile", onlyDigits(value))}
              placeholder="مثلاً 09123456789"
              inputMode="numeric"
              maxLength={11}
              error={errors.mobile}
            />
          </div>
        </Section>

        <Section
          title="اطلاعات خانوار و وضعیت فعلی"
          description="اطلاعات مربوط به تعداد افراد و شرایط فعلی را ثبت کنید."
          icon={<Users className="h-5 w-5" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="تعداد کل نفرات"
              required
              value={formData.totalPeople}
              onChange={(value) =>
                updateField("totalPeople", onlyDigits(value))
              }
              placeholder="مثلاً ۴"
              inputMode="numeric"
              error={errors.totalPeople}
            />

            <Select
              label="وضعیت فعلی"
              required
              value={formData.currentStatus}
              onChange={(value) => updateField("currentStatus", value)}
              options={CURRENT_STATUS_OPTIONS}
              placeholder="وضعیت فعلی را انتخاب کنید"
              error={errors.currentStatus}
            />

            {requestType === "family" ? (
              <>
                <Input
                  label="تعداد مردان"
                  value={formData.menCount}
                  onChange={(value) =>
                    updateField("menCount", onlyDigits(value))
                  }
                  placeholder="مثلاً ۱"
                  inputMode="numeric"
                  error={errors.menCount}
                />
                <Input
                  label="تعداد زنان"
                  value={formData.womenCount}
                  onChange={(value) =>
                    updateField("womenCount", onlyDigits(value))
                  }
                  placeholder="مثلاً ۱"
                  inputMode="numeric"
                  error={errors.womenCount}
                />
                <Input
                  label="تعداد کودکان"
                  value={formData.childrenCount}
                  onChange={(value) =>
                    updateField("childrenCount", onlyDigits(value))
                  }
                  placeholder="مثلاً ۲"
                  inputMode="numeric"
                  error={errors.childrenCount}
                />
              </>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Checkbox
              label="دارای نوزاد"
              checked={formData.hasInfant}
              onChange={(checked) => updateField("hasInfant", checked)}
            />
            <Checkbox
              label="دارای سالمند"
              checked={formData.hasElderly}
              onChange={(checked) => updateField("hasElderly", checked)}
            />
            <Checkbox
              label="دارای بیمار"
              checked={formData.hasPatient}
              onChange={(checked) => updateField("hasPatient", checked)}
            />
            <Checkbox
              label="دارای معلولیت"
              checked={formData.hasDisability}
              onChange={(checked) => updateField("hasDisability", checked)}
            />
            <Checkbox
              label="نیازمند دسترسی‌پذیری"
              checked={formData.needsAccessibility}
              onChange={(checked) => updateField("needsAccessibility", checked)}
            />
            <Checkbox
              label="نیاز فوری به اسکان"
              checked={formData.urgent}
              onChange={(checked) => updateField("urgent", checked)}
            />
          </div>
        </Section>

        <Section
          title="بازه اقامت"
          description="تاریخ شروع و پایان اقامت موردنیاز را مشخص کنید."
          icon={<Home className="h-5 w-5" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                تاریخ شروع اقامت
                <span className="mr-1 text-rose-500">*</span>
              </label>
              <DatePicker
                value={requestedFrom}
                onChange={(value) => {
                  setRequestedFrom(value);
                  setErrors((prev) => ({
                    ...prev,
                    requestedFrom: undefined,
                    general: undefined,
                  }));
                }}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                inputClass={cn(
                  "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                  "bg-white text-slate-900 placeholder:text-slate-400",
                  "dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                  errors.requestedFrom
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-slate-200 focus:border-emerald-500",
                )}
                containerClassName="w-full"
                format="YYYY/MM/DD"
              />
              <FieldError message={errors.requestedFrom} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                تاریخ پایان اقامت
                <span className="mr-1 text-rose-500">*</span>
              </label>
              <DatePicker
                value={requestedUntil}
                onChange={(value) => {
                  setRequestedUntil(value);
                  setErrors((prev) => ({
                    ...prev,
                    requestedUntil: undefined,
                    general: undefined,
                  }));
                }}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                inputClass={cn(
                  "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                  "bg-white text-slate-900 placeholder:text-slate-400",
                  "dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                  errors.requestedUntil
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-slate-200 focus:border-emerald-500",
                )}
                containerClassName="w-full"
                format="YYYY/MM/DD"
              />
              <FieldError message={errors.requestedUntil} />
            </div>
          </div>
        </Section>

        <Section
          title="توضیحات تکمیلی"
          description="در صورت نیاز جزئیات بیشتری از شرایط خود ثبت کنید."
          icon={<FileText className="h-5 w-5" />}
        >
          <TextArea
            label="شرح وضعیت / توضیحات"
            value={formData.description}
            onChange={(value) => updateField("description", value)}
            placeholder="هر توضیحی که برای بررسی درخواست لازم است اینجا بنویسید."
            error={errors.description}
            rows={5}
          />
        </Section>

        <Section
          title="مدارک و مستندات"
          description="بارگذاری تصویر کارت ملی الزامی است. سایر مدارک در صورت وجود بارگذاری شوند."
          icon={<Upload className="h-5 w-5" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <UploadBox
              title="تصویر کارت ملی"
              required
              hint="فرمت‌های مجاز: jpg, jpeg, png, pdf - حداکثر 5 مگابایت"
              files={nationalCardFiles}
              onChange={(files) => {
                setNationalCardFile(files?.[0] || null);
                setErrors((prev) => ({
                  ...prev,
                  nationalCardFile: undefined,
                  general: undefined,
                }));
              }}
              error={errors.nationalCardFile}
            />

            <UploadBox
              title="مدارک هویتی همراهان"
              multiple
              hint="در صورت وجود، مدارک همراهان را بارگذاری کنید."
              files={companionsFiles}
              onChange={setCompanionsFiles}
            />

            <UploadBox
              title="معرفی‌نامه / نامه ارجاع"
              multiple
              hint="در صورت ارجاع از نهاد یا سازمان، معرفی‌نامه را بارگذاری کنید."
              files={introductionFiles}
              onChange={setIntroductionFiles}
            />

            <UploadBox
              title="سایر مستندات"
              multiple
              hint="سایر مدارک مرتبط با درخواست اسکان."
              files={otherFiles}
              onChange={setOtherFiles}
            />
          </div>
        </Section>

        <Section
          title="جمع‌بندی وضعیت"
          description="برخی از نیازهای خاص ثبت‌شده برای بررسی سریع‌تر."
          icon={<HeartPulse className="h-5 w-5" />}
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <HeartPulse className="h-4 w-4 text-rose-500" />
                <span className="text-sm font-medium">حمایت درمانی</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formData.hasPatient ? "نیاز دارد" : "نیاز ندارد"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                {/* <Wheelchair className="h-4 w-4 text-indigo-500" /> */}
                <span className="text-sm font-medium">دسترسی‌پذیری</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formData.needsAccessibility ? "نیاز دارد" : "نیاز ندارد"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Users className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">وجود سالمند</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formData.hasElderly ? "بله" : "خیر"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">فوریت</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formData.urgent ? "فوری" : "عادی"}
              </p>
            </div>
          </div>
        </Section>

        <div className="sticky bottom-4 z-10">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                با ثبت این فرم، اطلاعات شما برای بررسی درخواست اسکان در سامانه
                ثبت خواهد شد.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال ثبت...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    ثبت درخواست
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
