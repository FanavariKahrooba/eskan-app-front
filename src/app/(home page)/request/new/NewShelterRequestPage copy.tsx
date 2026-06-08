"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeInfo,
  BedDouble,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Home,
  IdCard,
  Loader2,
  MapPin,
  Phone,
  ShieldAlert,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";

type RequestType = "male" | "female" | "family";
type StayDuration = "one-night" | "short" | "extended";

type ShelterStatus = "active" | "limited" | "full";
type ShelterGenderType = "men" | "women" | "family" | "mixed";
type ShelterAdmissionType = "normal" | "emergency" | "referral";

type FormErrors = Partial<
  Record<
    | "firstName"
    | "lastName"
    | "nationalId"
    | "mobile"
    | "fatherName"
    | "age"
    | "totalPeople"
    | "childrenCount"
    | "womenCount"
    | "menCount"
    | "preferredRegion"
    | "priority"
    | "currentStatus"
    | "description"
    | "selectedShelterId"
    | "general",
    string
  >
>;

type Shelter = {
  id: number;
  name: string;
  region: string;
  district: string;
  neighborhood: string;
  address: string;
  phone: string;
  status: ShelterStatus;
  genderType: ShelterGenderType;
  admissionType: ShelterAdmissionType;
  totalCapacity: number;
  freeCapacity: number;
  reservedCapacity: number;
  occupiedCapacity: number;
  facilities: string[];
};

const shelters: Shelter[] = [
  {
    id: 1,
    name: "سرای محله گلستان",
    region: "2",
    district: "1",
    neighborhood: "گلستان",
    address: "منطقه ۲، ناحیه ۱، خیابان نمونه، سرای محله گلستان",
    phone: "021-22220001",
    status: "active",
    genderType: "family",
    admissionType: "normal",
    totalCapacity: 180,
    freeCapacity: 48,
    reservedCapacity: 12,
    occupiedCapacity: 120,
    facilities: ["مناسب خانواده", "دارای بخش بانوان", "خدمات تغذیه", "پارکینگ"],
  },
  {
    id: 2,
    name: "سرای محله بهار",
    region: "4",
    district: "2",
    neighborhood: "بهار",
    address: "منطقه ۴، ناحیه ۲، خیابان آزادی، سرای محله بهار",
    phone: "021-44440002",
    status: "limited",
    genderType: "men",
    admissionType: "emergency",
    totalCapacity: 120,
    freeCapacity: 12,
    reservedCapacity: 18,
    occupiedCapacity: 90,
    facilities: ["پذیرش اضطراری", "بخش آقایان", "خدمات تغذیه"],
  },
  {
    id: 3,
    name: "سرای محله امید",
    region: "1",
    district: "3",
    neighborhood: "امید",
    address: "منطقه ۱، ناحیه ۳، خیابان ولیعصر، سرای محله امید",
    phone: "021-11110003",
    status: "full",
    genderType: "family",
    admissionType: "referral",
    totalCapacity: 90,
    freeCapacity: 0,
    reservedCapacity: 8,
    occupiedCapacity: 82,
    facilities: ["پذیرش با معرفی‌نامه", "مناسب خانواده"],
  },
  {
    id: 4,
    name: "سرای محله یاس",
    region: "3",
    district: "1",
    neighborhood: "یاس",
    address: "منطقه ۳، ناحیه ۱، خیابان شریعتی، سرای محله یاس",
    phone: "021-33330004",
    status: "active",
    genderType: "women",
    admissionType: "normal",
    totalCapacity: 140,
    freeCapacity: 36,
    reservedCapacity: 10,
    occupiedCapacity: 94,
    facilities: ["بخش بانوان", "دسترسی مناسب", "خدمات مددکاری"],
  },
  {
    id: 5,
    name: "سرای محله آفتاب",
    region: "5",
    district: "2",
    neighborhood: "آفتاب",
    address: "منطقه ۵، ناحیه ۲، بلوار فردوس، سرای محله آفتاب",
    phone: "021-55550005",
    status: "active",
    genderType: "mixed",
    admissionType: "normal",
    totalCapacity: 210,
    freeCapacity: 74,
    reservedCapacity: 22,
    occupiedCapacity: 114,
    facilities: ["ظرفیت بالا", "خدمات تغذیه", "خانواده و مجرد", "پزشک"],
  },
  {
    id: 6,
    name: "سرای محله مهر",
    region: "6",
    district: "1",
    neighborhood: "مهر",
    address: "منطقه ۶، ناحیه ۱، خیابان کارگر، سرای محله مهر",
    phone: "021-66660006",
    status: "limited",
    genderType: "women",
    admissionType: "emergency",
    totalCapacity: 100,
    freeCapacity: 9,
    reservedCapacity: 16,
    occupiedCapacity: 75,
    facilities: ["پذیرش اضطراری", "بخش بانوان", "دسترسی ویژه"],
  },
];

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function isValidIranianNationalId(value: string) {
  const code = normalizeDigits(value).trim();

  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false;

  const check = Number(code[9]);

  const sum = code
    .slice(0, 9)
    .split("")
    .reduce((acc, digit, index) => acc + Number(digit) * (10 - index), 0);

  const remainder = sum % 11;

  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

function isValidIranianMobile(value: string) {
  const mobile = normalizeDigits(value).trim();
  return /^09\d{9}$/.test(mobile);
}

function isPositiveNumber(value: string) {
  const normalized = normalizeDigits(value).trim();
  if (!normalized) return false;

  const number = Number(normalized);
  return Number.isFinite(number) && number > 0;
}

function isNonNegativeNumber(value: string) {
  const normalized = normalizeDigits(value).trim();
  if (!normalized) return true;

  const number = Number(normalized);
  return Number.isFinite(number) && number >= 0;
}

export default function NewShelterRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [requestType, setRequestType] = useState<RequestType>("family");
  const [stayDuration, setStayDuration] = useState<StayDuration>("short");

  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const [selectedShelterId, setSelectedShelterId] = useState<number | null>(
    null,
  );
  const [invalidShelterId, setInvalidShelterId] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    mobile: "",
    fatherName: "",
    age: "",
    totalPeople: "",
    childrenCount: "",
    womenCount: "",
    menCount: "",
    preferredRegion: "",
    priority: "",
    currentStatus: "",
    description: "",
    hasInfant: false,
    hasElderly: false,
    hasPatient: false,
    needsAccessibility: false,
    hasDisability: false,
    urgent: false,
  });

  useEffect(() => {
    const shelterIdParam = searchParams.get("shelterId");

    if (!shelterIdParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedShelterId(null);
      setInvalidShelterId(false);
      return;
    }

    const parsedId = Number(shelterIdParam);
    const exists = shelters.some((item) => item.id === parsedId);

    if (exists) {
      setSelectedShelterId(parsedId);
      setInvalidShelterId(false);
    } else {
      setSelectedShelterId(null);
      setInvalidShelterId(true);
    }
  }, [searchParams]);

  const selectedShelter = useMemo(() => {
    if (!selectedShelterId) return null;
    return shelters.find((item) => item.id === selectedShelterId) ?? null;
  }, [selectedShelterId]);

  useEffect(() => {
    if (!selectedShelter) return;

    if (selectedShelter.genderType === "men") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequestType("male");
    } else if (selectedShelter.genderType === "women") {
      setRequestType("female");
    } else {
      setRequestType("family");
    }

    setFormData((prev) => ({
      ...prev,
      preferredRegion: prev.preferredRegion || selectedShelter.region,
    }));
  }, [selectedShelter]);

  const handleChange = (
    key: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => {
      if (!(key in prev)) return prev;

      const next = { ...prev };
      delete next[key as keyof FormErrors];
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const nationalId = normalizeDigits(formData.nationalId).trim();
    const mobile = normalizeDigits(formData.mobile).trim();
    const totalPeople = normalizeDigits(formData.totalPeople).trim();
    const age = normalizeDigits(formData.age).trim();
    const childrenCount = normalizeDigits(formData.childrenCount).trim();
    const womenCount = normalizeDigits(formData.womenCount).trim();
    const menCount = normalizeDigits(formData.menCount).trim();

    if (!firstName) {
      nextErrors.firstName = "نام الزامی است.";
    } else if (firstName.length < 2) {
      nextErrors.firstName = "نام باید حداقل ۲ کاراکتر باشد.";
    }

    if (!lastName) {
      nextErrors.lastName = "نام خانوادگی الزامی است.";
    } else if (lastName.length < 2) {
      nextErrors.lastName = "نام خانوادگی باید حداقل ۲ کاراکتر باشد.";
    }

    if (!nationalId) {
      nextErrors.nationalId = "کد ملی الزامی است.";
    } else if (!isValidIranianNationalId(nationalId)) {
      nextErrors.nationalId = "کد ملی واردشده معتبر نیست.";
    }

    if (!mobile) {
      nextErrors.mobile = "شماره تماس الزامی است.";
    } else if (!isValidIranianMobile(mobile)) {
      nextErrors.mobile = "شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد.";
    }

    if (age && !isPositiveNumber(age)) {
      nextErrors.age = "سن باید عددی معتبر باشد.";
    }

    if (!totalPeople) {
      nextErrors.totalPeople = "تعداد کل نفرات الزامی است.";
    } else if (!isPositiveNumber(totalPeople)) {
      nextErrors.totalPeople = "تعداد کل نفرات باید بیشتر از صفر باشد.";
    }

    if (!isNonNegativeNumber(childrenCount)) {
      nextErrors.childrenCount = "تعداد کودکان باید عددی معتبر باشد.";
    }

    if (!isNonNegativeNumber(womenCount)) {
      nextErrors.womenCount = "تعداد بانوان باید عددی معتبر باشد.";
    }

    if (!isNonNegativeNumber(menCount)) {
      nextErrors.menCount = "تعداد آقایان باید عددی معتبر باشد.";
    }

    if (childrenCount || womenCount || menCount) {
      const companionsSum =
        Number(childrenCount || 0) +
        Number(womenCount || 0) +
        Number(menCount || 0);

      if (totalPeople && companionsSum > Number(totalPeople)) {
        nextErrors.totalPeople =
          "جمع تعداد کودکان، بانوان و آقایان نباید از تعداد کل نفرات بیشتر باشد.";
      }
    }

    if (!formData.currentStatus.trim()) {
      nextErrors.currentStatus = "وضعیت فعلی الزامی است.";
    }

    if (formData.description.trim().length > 700) {
      nextErrors.description = "توضیحات نباید بیشتر از ۷۰۰ کاراکتر باشد.";
    }

    if (selectedShelter?.status === "full") {
      nextErrors.selectedShelterId =
        "سرای انتخاب‌شده تکمیل ظرفیت است. لطفاً سرای دیگری انتخاب کنید یا انتخاب سرا را حذف نمایید.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleClearSelectedShelter = () => {
    setSelectedShelterId(null);
    setInvalidShelterId(false);

    setErrors((prev) => {
      const next = { ...prev };
      delete next.selectedShelterId;
      return next;
    });

    router.replace("/request/new", { scroll: false });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(false);

    const isValid = validateForm();

    if (!isValid) {
      scrollToTop();
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const randomCode = `ASK-${Math.floor(100000 + Math.random() * 900000)}`;

    const payload = {
      requestType,
      stayDuration,
      selectedShelterId,
      selectedShelterName: selectedShelter?.name ?? null,
      formData: {
        ...formData,
        nationalId: normalizeDigits(formData.nationalId),
        mobile: normalizeDigits(formData.mobile),
        age: normalizeDigits(formData.age),
        totalPeople: normalizeDigits(formData.totalPeople),
        childrenCount: normalizeDigits(formData.childrenCount),
        womenCount: normalizeDigits(formData.womenCount),
        menCount: normalizeDigits(formData.menCount),
      },
      trackingCode: randomCode,
      createdAt: new Date().toISOString(),
    };

    console.log("submitted payload", payload);

    setTrackingCode(randomCode);
    setSubmitted(true);
    setIsSubmitting(false);
    scrollToTop();
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-100 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <Header />

      <section className="border-b border-slate-200 bg-gradient-to-b from-stone-100 via-slate-100 to-slate-100 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>

          <div className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-50 px-4 py-1.5 text-sm text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
              <BedDouble className="h-4 w-4" />
              ثبت درخواست اسکان
            </span>

            <h1 className="mt-4 text-3xl font-black text-slate-950 md:text-5xl dark:text-white">
              فرم ثبت درخواست اسکان موقت
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-700 md:text-base dark:text-zinc-300">
              اطلاعات هویتی، تعداد همراهان، شرایط ویژه و نیاز اسکان را وارد
              کنید. پس از ثبت، کد رهگیری دریافت می‌کنید.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {submitted && <SuccessBox trackingCode={trackingCode} />}

        {errors.general && <WarningBox>{errors.general}</WarningBox>}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-6">
            {invalidShelterId && (
              <WarningBox>
                شناسه سرای انتخاب‌شده معتبر نیست. لطفاً از فهرست سراها دوباره
                انتخاب کنید.
              </WarningBox>
            )}

            {selectedShelter && (
              <SelectedShelterBox
                shelter={selectedShelter}
                error={errors.selectedShelterId}
                onClear={handleClearSelectedShelter}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card
                title="نوع متقاضی"
                description="مشخص کنید درخواست برای چه گروهی ثبت می‌شود."
                icon={<Users className="h-5 w-5" />}
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <SelectableCard
                    title="آقایان"
                    subtitle="درخواست برای متقاضیان مرد"
                    active={requestType === "male"}
                    onClick={() => setRequestType("male")}
                  />
                  <SelectableCard
                    title="بانوان"
                    subtitle="درخواست برای متقاضیان زن"
                    active={requestType === "female"}
                    onClick={() => setRequestType("female")}
                  />
                  <SelectableCard
                    title="خانواده"
                    subtitle="درخواست برای خانواده یا همراهان"
                    active={requestType === "family"}
                    onClick={() => setRequestType("family")}
                  />
                </div>
              </Card>

              <Card
                title="اطلاعات متقاضی"
                description="اطلاعات هویتی فرد اصلی درخواست‌کننده"
                icon={<IdCard className="h-5 w-5" />}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="نام"
                    value={formData.firstName}
                    error={errors.firstName}
                    onChange={(value) => handleChange("firstName", value)}
                    placeholder="مثلاً علی"
                  />

                  <Input
                    label="نام خانوادگی"
                    value={formData.lastName}
                    error={errors.lastName}
                    onChange={(value) => handleChange("lastName", value)}
                    placeholder="مثلاً احمدی"
                  />

                  <Input
                    label="کد ملی"
                    value={formData.nationalId}
                    error={errors.nationalId}
                    onChange={(value) => handleChange("nationalId", value)}
                    placeholder="۱۰ رقم"
                    inputMode="numeric"
                  />

                  <Input
                    label="شماره تماس"
                    value={formData.mobile}
                    error={errors.mobile}
                    onChange={(value) => handleChange("mobile", value)}
                    placeholder="09xxxxxxxxx"
                    inputMode="tel"
                  />

                  <Input
                    label="نام پدر"
                    value={formData.fatherName}
                    error={errors.fatherName}
                    onChange={(value) => handleChange("fatherName", value)}
                    placeholder="مثلاً حسین"
                  />

                  <Input
                    label="سن"
                    value={formData.age}
                    error={errors.age}
                    onChange={(value) => handleChange("age", value)}
                    placeholder="مثلاً ۳۸"
                    inputMode="numeric"
                  />
                </div>
              </Card>

              <Card
                title="اطلاعات همراهان"
                description="تعداد افراد همراه را وارد کنید."
                icon={<User className="h-5 w-5" />}
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Input
                    label="تعداد کل نفرات"
                    value={formData.totalPeople}
                    error={errors.totalPeople}
                    onChange={(value) => handleChange("totalPeople", value)}
                    placeholder="مثلاً ۴"
                    inputMode="numeric"
                  />

                  <Input
                    label="تعداد کودکان"
                    value={formData.childrenCount}
                    error={errors.childrenCount}
                    onChange={(value) => handleChange("childrenCount", value)}
                    placeholder="مثلاً ۱"
                    inputMode="numeric"
                  />

                  <Input
                    label="تعداد بانوان"
                    value={formData.womenCount}
                    error={errors.womenCount}
                    onChange={(value) => handleChange("womenCount", value)}
                    placeholder="مثلاً ۲"
                    inputMode="numeric"
                  />

                  <Input
                    label="تعداد آقایان"
                    value={formData.menCount}
                    error={errors.menCount}
                    onChange={(value) => handleChange("menCount", value)}
                    placeholder="مثلاً ۲"
                    inputMode="numeric"
                  />
                </div>
              </Card>

              <Card
                title="جزئیات اسکان"
                description="نیاز اسکان و اولویت‌های موردنظر را مشخص کنید."
                icon={<Home className="h-5 w-5" />}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Select
                    label="مدت زمان اقامت"
                    value={stayDuration}
                    onChange={(value) => setStayDuration(value as StayDuration)}
                    options={[
                      { label: "یک شب", value: "one-night" },
                      { label: "کوتاه‌مدت", value: "short" },
                      { label: "بیش از چند روز", value: "extended" },
                    ]}
                  />

                  <Input
                    label="منطقه موردنظر"
                    value={formData.preferredRegion}
                    error={errors.preferredRegion}
                    onChange={(value) => handleChange("preferredRegion", value)}
                    placeholder="مثلاً منطقه ۲"
                  />

                  <Input
                    label="اولویت اسکان"
                    value={formData.priority}
                    error={errors.priority}
                    onChange={(value) => handleChange("priority", value)}
                    placeholder="مثلاً نزدیک محل درمان"
                  />

                  <Input
                    label="وضعیت فعلی"
                    value={formData.currentStatus}
                    error={errors.currentStatus}
                    onChange={(value) => handleChange("currentStatus", value)}
                    placeholder="مثلاً نیاز فوری به اسکان"
                  />
                </div>

                <div className="mt-4">
                  <TextArea
                    label="شرح نیاز یا توضیحات"
                    value={formData.description}
                    error={errors.description}
                    onChange={(value) => handleChange("description", value)}
                    placeholder="در صورت نیاز، جزئیات بیشتری از شرایط فعلی و علت درخواست وارد کنید."
                  />
                </div>
              </Card>

              <Card
                title="شرایط خاص"
                description="در صورت وجود، گزینه‌های زیر را مشخص کنید."
                icon={<HeartPulse className="h-5 w-5" />}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <Checkbox
                    label="دارای کودک خردسال"
                    checked={formData.hasInfant}
                    onChange={(value) => handleChange("hasInfant", value)}
                  />
                  <Checkbox
                    label="دارای سالمند"
                    checked={formData.hasElderly}
                    onChange={(value) => handleChange("hasElderly", value)}
                  />
                  <Checkbox
                    label="دارای بیمار"
                    checked={formData.hasPatient}
                    onChange={(value) => handleChange("hasPatient", value)}
                  />
                  <Checkbox
                    label="نیاز به دسترسی ویژه"
                    checked={formData.needsAccessibility}
                    onChange={(value) =>
                      handleChange("needsAccessibility", value)
                    }
                  />
                  <Checkbox
                    label="دارای معلولیت"
                    checked={formData.hasDisability}
                    onChange={(value) => handleChange("hasDisability", value)}
                  />
                  <Checkbox
                    label="نیاز فوری به پذیرش"
                    checked={formData.urgent}
                    onChange={(value) => handleChange("urgent", value)}
                  />
                </div>
              </Card>

              <Card
                title="مدارک و مستندات"
                description="برای تسریع بررسی، مدارک لازم را بارگذاری کنید."
                icon={<FileText className="h-5 w-5" />}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <UploadBox label="تصویر کارت ملی" />
                  <UploadBox label="مدرک هویتی همراهان" />
                  <UploadBox label="معرفی‌نامه / مستندات" />
                  <UploadBox label="سایر مدارک" />
                </div>
              </Card>

              <input
                type="hidden"
                name="selectedShelterId"
                value={selectedShelterId ?? ""}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-600 bg-orange-500 px-5 py-4 text-sm font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    در حال ثبت درخواست...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    ثبت نهایی درخواست
                  </>
                )}
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <InfoPanel />
            <StepsPanel />
            <SupportPanel />
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
              ثبت درخواست اسکان
            </div>
          </div>
        </Link>

        <a
          href="/request/track"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          پیگیری درخواست
        </a>
      </div>
    </header>
  );
}

function SuccessBox({ trackingCode }: { trackingCode: string }) {
  return (
    <div className="mb-6 rounded-[28px] border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-400/20 dark:bg-emerald-500/10">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">
            درخواست شما با موفقیت ثبت شد
          </h2>

          <p className="mt-2 text-sm leading-7 text-emerald-800 dark:text-emerald-100">
            کد رهگیری زیر را یادداشت کنید و از بخش پیگیری درخواست، وضعیت را
            مشاهده نمایید.
          </p>

          <div className="mt-4 inline-flex rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-lg font-black text-slate-950 dark:border-emerald-300/20 dark:bg-zinc-950/40 dark:text-white">
            {trackingCode}
          </div>

          <div className="mt-4">
            <a
              href="/request/track"
              className="inline-flex rounded-xl border border-emerald-600 bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              رفتن به پیگیری درخواست
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-[28px] border border-red-300 bg-red-50 p-5 text-sm leading-7 text-red-900 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-100">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-red-100 p-3 text-red-700 dark:bg-red-500/20 dark:text-red-300">
          <ShieldAlert className="h-5 w-5" />
        </div>

        <div>
          <div className="font-extrabold text-red-900 dark:text-white">
            هشدار
          </div>
          <div className="mt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function SelectedShelterBox({
  shelter,
  error,
  onClear,
}: {
  shelter: Shelter;
  error?: string;
  onClear: () => void;
}) {
  const statusConfig = getStatusConfig(shelter.status);

  return (
    <div
      className={`rounded-[28px] border p-5 ${
        error
          ? "border-red-300 bg-red-50 dark:border-red-400/30 dark:bg-red-500/10"
          : "border-sky-300 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-500/10"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-white px-3 py-1 text-xs font-bold text-sky-700 dark:border-sky-300/20 dark:bg-zinc-950/30 dark:text-sky-200">
              <Building2 className="h-4 w-4" />
              سرای انتخاب‌شده
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${statusConfig.badgeClass}`}
            >
              {statusConfig.label}
            </span>
          </div>

          <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
            {shelter.name}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sky-800 dark:text-sky-100">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              منطقه {shelter.region}، ناحیه {shelter.district}، محله{" "}
              {shelter.neighborhood}
            </span>

            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {shelter.phone}
            </span>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-sky-50/90">
            {shelter.address}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SmallBadge label="ظرفیت خالی" value={shelter.freeCapacity} />
            <SmallBadge label="رزرو موقت" value={shelter.reservedCapacity} />
            <SmallBadge label="کل ظرفیت" value={shelter.totalCapacity} />
          </div>

          {error && (
            <p className="mt-4 rounded-2xl border border-red-300 bg-white px-4 py-3 text-sm leading-7 text-red-800 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-100">
              {error}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        >
          <X className="h-4 w-4" />
          حذف انتخاب سرا
        </button>
      </div>
    </div>
  );
}

function SmallBadge({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-950/30">
      <div className="text-xs text-slate-500 dark:text-sky-100/70">{label}</div>
      <div className="mt-2 text-lg font-black text-slate-950 dark:text-white">
        {typeof value === "number" ? value.toLocaleString("fa-IR") : value}
      </div>
    </div>
  );
}

function Card({
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
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
        {icon && (
          <div className="rounded-2xl border border-orange-300 bg-orange-50 p-3 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
            {icon}
          </div>
        )}

        <div>
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-zinc-400">
              {description}
            </p>
          )}
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
  error,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800 dark:text-zinc-200">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:bg-zinc-950/70 dark:text-white dark:placeholder:text-zinc-500 ${
          error
            ? "border-red-400/60 focus:border-red-500"
            : "border-slate-300 focus:border-orange-400 dark:border-white/10 dark:focus:border-orange-400/40"
        }`}
      />

      {error && (
        <p className="mt-2 text-xs leading-6 text-red-600 dark:text-red-300">
          {error}
        </p>
      )}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800 dark:text-zinc-200">
        {label}
      </span>

      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 dark:bg-zinc-950/70 dark:text-white dark:placeholder:text-zinc-500 ${
          error
            ? "border-red-400/60 focus:border-red-500"
            : "border-slate-300 focus:border-orange-400 dark:border-white/10 dark:focus:border-orange-400/40"
        }`}
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        {error ? (
          <p className="text-xs leading-6 text-red-600 dark:text-red-300">
            {error}
          </p>
        ) : (
          <span />
        )}

        <span className="text-xs text-slate-500 dark:text-zinc-500">
          {value.length.toLocaleString("fa-IR")} / ۷۰۰
        </span>
      </div>
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800 dark:text-zinc-200">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-zinc-950/70 dark:text-white dark:focus:border-orange-400/40"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-slate-900 dark:bg-zinc-900 dark:text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100 dark:border-white/10 dark:bg-zinc-950/40 dark:hover:bg-white/[0.04]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-orange-500"
      />

      <span className="text-sm text-slate-800 dark:text-zinc-200">{label}</span>
    </label>
  );
}

function SelectableCard({
  title,
  subtitle,
  active,
  onClick,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[24px] border p-5 text-right transition ${
        active
          ? "border-orange-300 bg-orange-50 dark:border-orange-400/40 dark:bg-orange-500/10"
          : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-white/10 dark:bg-zinc-950/40 dark:hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-extrabold text-slate-950 dark:text-white">
            {title}
          </div>
          <div className="mt-2 text-sm leading-7 text-slate-600 dark:text-zinc-400">
            {subtitle}
          </div>
        </div>

        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full border ${
            active
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-slate-300 text-transparent dark:border-white/10"
          }`}
        >
          <Check className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
}

function UploadBox({ label }: { label: string }) {
  return (
    <label className="block cursor-pointer rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:bg-slate-100 dark:border-white/15 dark:bg-zinc-950/40 dark:hover:bg-white/[0.03]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          <Upload className="h-5 w-5" />
        </div>

        <div>
          <div className="font-bold text-slate-950 dark:text-white">
            {label}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
            برای انتخاب فایل کلیک کنید
          </div>
        </div>
      </div>

      <input type="file" className="hidden" />
    </label>
  );
}

function InfoPanel() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl border border-sky-300 bg-sky-50 p-3 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
          <BadgeInfo className="h-5 w-5" />
        </div>

        <h3 className="font-extrabold text-slate-950 dark:text-white">
          راهنمای فرم
        </h3>
      </div>

      <ul className="space-y-3 text-sm leading-7 text-slate-700 dark:text-zinc-300">
        <li>اطلاعات را مطابق مدارک هویتی وارد کنید.</li>
        <li>شماره تماس فعال وارد شود.</li>
        <li>در صورت داشتن شرایط خاص، گزینه مربوطه را فعال کنید.</li>
        <li>در صورت انتخاب سرا، شناسه آن در درخواست ثبت می‌شود.</li>
      </ul>
    </div>
  );
}

function StepsPanel() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Clock3 className="h-5 w-5" />
        </div>

        <h3 className="font-extrabold text-slate-950 dark:text-white">
          مراحل بررسی
        </h3>
      </div>

      <div className="space-y-4">
        <StepItem index="۱" title="ثبت درخواست" />
        <StepItem index="۲" title="بررسی اطلاعات و مدارک" />
        <StepItem index="۳" title="اعلام نتیجه یا رزرو موقت" />
        <StepItem index="۴" title="مراجعه حضوری و پذیرش" />
      </div>
    </div>
  );
}

function StepItem({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-zinc-950/40">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
        {index}
      </div>

      <div className="text-sm font-bold text-slate-800 dark:text-zinc-200">
        {title}
      </div>
    </div>
  );
}

function SupportPanel() {
  return (
    <div className="rounded-[28px] border border-orange-300 bg-orange-50 p-5 shadow-sm dark:border-orange-400/20 dark:bg-orange-500/10">
      <div className="mb-3 text-lg font-extrabold text-slate-950 dark:text-white">
        پشتیبانی
      </div>

      <p className="text-sm leading-7 text-orange-900 dark:text-orange-100">
        در صورت نیاز به راهنمایی درباره ثبت درخواست، مدارک لازم یا پیگیری وضعیت
        می‌توانید با مرکز پشتیبانی تماس بگیرید.
      </p>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-950 dark:border-white/10 dark:bg-zinc-950/30 dark:text-white">
        ۰۲۱-۰۰۰۰۰۰۰۰
      </div>
    </div>
  );
}

function getStatusConfig(status: ShelterStatus) {
  switch (status) {
    case "active":
      return {
        label: "دارای ظرفیت",
        badgeClass:
          "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300",
      };

    case "limited":
      return {
        label: "ظرفیت محدود",
        badgeClass:
          "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300",
      };

    case "full":
      return {
        label: "تکمیل ظرفیت",
        badgeClass:
          "border-red-300 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300",
      };

    default:
      return {
        label: "نامشخص",
        badgeClass:
          "border-slate-300 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300",
      };
  }
}
