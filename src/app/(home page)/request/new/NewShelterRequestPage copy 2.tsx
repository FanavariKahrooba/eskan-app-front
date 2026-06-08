/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
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
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorianEn from "react-date-object/locales/gregorian_en";

type RequestType = "temporary" | "emergency" | "family" | "referral";
type PriorityLevel = "low" | "normal" | "high" | "urgent" | "critical";
type ApplicantType = "men" | "women" | "family";

type ShelterStatus = "active" | "limited" | "full";
type ShelterGenderType = "men" | "women" | "family" | "mixed";
type ShelterAdmissionType = "normal" | "emergency" | "referral";

type Shelter = {
  id: number;
  name: string;
  region: string;
  address: string;
  capacity: number;
  available: number;
  status: ShelterStatus;
  genderType: ShelterGenderType;
  admissionType: ShelterAdmissionType;
  features: string[];
};

type FormData = {
  applicantType: ApplicantType;
  applicantName: string;
  applicantNationalCode: string;
  applicantMobile: string;
  fatherName: string;
  age: string;
  householdSize: string;
  menCount: string;
  womenCount: string;
  childrenCount: string;
  elderlyCount: string;
  disabledCount: string;
  currentStatus: string;
  address: string;
  description: string;
  preferredRegion: string;
  needsMedicalSupport: boolean;
  needsAccessibility: boolean;
  needsSeparateSpace: boolean;
  hasInfant: boolean;
  urgentNeed: boolean;
  acceptRules: boolean;
};

type Attachments = {
  nationalCard: File[];
  companionsIdentity: File[];
  referralDocument: File[];
  otherDocuments: File[];
};

type FormErrors = Partial<
  Record<
    | keyof FormData
    | "requestedFrom"
    | "requestedUntil"
    | "selectedShelterId"
    | "submit",
    string
  >
>;

const shelters: Shelter[] = [
  {
    id: 1,
    name: "سرای اسکان محله مرکزی",
    region: "منطقه ۱",
    address: "خیابان امام، جنب فرهنگسرا",
    capacity: 80,
    available: 24,
    status: "active",
    genderType: "family",
    admissionType: "normal",
    features: ["فضای خانوادگی", "دسترسی مناسب", "اتاق بهداشت"],
  },
  {
    id: 2,
    name: "سرای اسکان بانوان",
    region: "منطقه ۲",
    address: "بلوار شهید بهشتی، کوچه ۱۲",
    capacity: 50,
    available: 9,
    status: "limited",
    genderType: "women",
    admissionType: "normal",
    features: ["ویژه بانوان", "حضور مددکار", "امنیت شبانه"],
  },
  {
    id: 3,
    name: "مرکز اسکان اضطراری",
    region: "منطقه ۳",
    address: "میدان آزادی، ساختمان خدمات شهری",
    capacity: 120,
    available: 38,
    status: "active",
    genderType: "mixed",
    admissionType: "emergency",
    features: ["پذیرش اضطراری", "حمایت پزشکی", "ظرفیت بالا"],
  },
];

const initialFormData: FormData = {
  applicantType: "family",
  applicantName: "",
  applicantNationalCode: "",
  applicantMobile: "",
  fatherName: "",
  age: "",
  householdSize: "",
  menCount: "",
  womenCount: "",
  childrenCount: "",
  elderlyCount: "",
  disabledCount: "",
  currentStatus: "",
  address: "",
  description: "",
  preferredRegion: "",
  needsMedicalSupport: false,
  needsAccessibility: false,
  needsSeparateSpace: false,
  hasInfant: false,
  urgentNeed: false,
  acceptRules: false,
};

const initialAttachments: Attachments = {
  nationalCard: [],
  companionsIdentity: [],
  referralDocument: [],
  otherDocuments: [],
};

export default function NewShelterRequestPage() {
  const topRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [requestType, setRequestType] = useState<RequestType>("temporary");
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>("normal");
  const [selectedShelterId, setSelectedShelterId] = useState<number | null>(null);
  const [requestedFrom, setRequestedFrom] = useState<DateObject | null>(null);
  const [requestedUntil, setRequestedUntil] = useState<DateObject | null>(null);
  const [attachments, setAttachments] = useState<Attachments>(initialAttachments);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const selectedShelter = useMemo(
    () => shelters.find((item) => item.id === selectedShelterId) ?? null,
    [selectedShelterId]
  );

  const requestedFromText = useMemo(
    () => toGregorianDate(requestedFrom),
    [requestedFrom]
  );

  const requestedUntilText = useMemo(
    () => toGregorianDate(requestedUntil),
    [requestedUntil]
  );

  useEffect(() => {
    if (!selectedShelter) return;

    if (selectedShelter.admissionType === "emergency") {
      setRequestType("emergency");
      setPriorityLevel("urgent");
    } else if (selectedShelter.admissionType === "referral") {
      setRequestType("referral");
    } else if (selectedShelter.genderType === "family") {
      setRequestType("family");
    }

    if (selectedShelter.genderType === "men") {
      setFormData((prev) => ({ ...prev, applicantType: "men" }));
    } else if (selectedShelter.genderType === "women") {
      setFormData((prev) => ({ ...prev, applicantType: "women" }));
    } else if (selectedShelter.genderType === "family") {
      setFormData((prev) => ({ ...prev, applicantType: "family" }));
    }

    setFormData((prev) => ({
      ...prev,
      preferredRegion: prev.preferredRegion || selectedShelter.region,
    }));
  }, [selectedShelter]);

  const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, submit: undefined }));
  };

  const handleFiles = (key: keyof Attachments, files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => ({
      ...prev,
      [key]: [...prev[key], ...Array.from(files)],
    }));
  };

  const removeFile = (key: keyof Attachments, index: number) => {
    setAttachments((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    const householdSize = toNumber(formData.householdSize);
    const menCount = toNumber(formData.menCount);
    const womenCount = toNumber(formData.womenCount);
    const childrenCount = toNumber(formData.childrenCount);
    const elderlyCount = toNumber(formData.elderlyCount);
    const disabledCount = toNumber(formData.disabledCount);

    if (!selectedShelterId) {
      nextErrors.selectedShelterId = "انتخاب محل اسکان الزامی است.";
    }

    if (!formData.applicantType) {
      nextErrors.applicantType = "نوع متقاضی را انتخاب کنید.";
    }

    if (!formData.applicantName.trim()) {
      nextErrors.applicantName = "نام و نام خانوادگی الزامی است.";
    }

    if (
      formData.applicantNationalCode.trim() &&
      !isValidIranNationalCode(formData.applicantNationalCode)
    ) {
      nextErrors.applicantNationalCode = "کد ملی معتبر نیست.";
    }

    if (
      formData.applicantMobile.trim() &&
      !isValidIranMobile(formData.applicantMobile)
    ) {
      nextErrors.applicantMobile = "شماره موبایل معتبر نیست.";
    }

    if (!householdSize || householdSize < 1) {
      nextErrors.householdSize = "تعداد کل نفرات باید حداقل ۱ باشد.";
    }

    const detailsTotal = menCount + womenCount + childrenCount;
    if (householdSize > 0 && detailsTotal > householdSize) {
      nextErrors.householdSize = "جمع آقایان، بانوان و کودکان نباید از تعداد کل بیشتر باشد.";
    }

    if (formData.applicantType === "men" && womenCount > 0) {
      nextErrors.womenCount = "برای نوع متقاضی آقایان، تعداد بانوان باید صفر باشد.";
    }

    if (formData.applicantType === "women" && menCount > 0) {
      nextErrors.menCount = "برای نوع متقاضی بانوان، تعداد آقایان باید صفر باشد.";
    }

    if (elderlyCount > householdSize) {
      nextErrors.elderlyCount = "تعداد سالمندان نباید از تعداد کل بیشتر باشد.";
    }

    if (disabledCount > householdSize) {
      nextErrors.disabledCount = "تعداد افراد دارای معلولیت نباید از تعداد کل بیشتر باشد.";
    }

    if (!requestedFrom) {
      nextErrors.requestedFrom = "تاریخ شروع اسکان الزامی است.";
    }

    if (!requestedUntil) {
      nextErrors.requestedUntil = "تاریخ پایان اسکان الزامی است.";
    }

    if (requestedFrom && requestedUntil) {
      const start = requestedFrom.toDate().getTime();
      const end = requestedUntil.toDate().getTime();

      if (end < start) {
        nextErrors.requestedUntil = "تاریخ پایان نباید قبل از تاریخ شروع باشد.";
      }
    }

    if (!formData.address.trim()) {
      nextErrors.address = "نشانی فعلی الزامی است.";
    }

    if (!formData.acceptRules) {
      nextErrors.acceptRules = "برای ثبت درخواست باید قوانین را تأیید کنید.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setRequestType("temporary");
    setPriorityLevel("normal");
    setSelectedShelterId(null);
    setRequestedFrom(null);
    setRequestedUntil(null);
    setAttachments(initialAttachments);
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(false);

    if (!validateForm()) {
      scrollToTop();
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const payload = {
      neighborhood_hall_id: selectedShelterId,
      preferred_space_id: null,

      applicant_name: formData.applicantName.trim(),
      applicant_national_code:
        normalizeDigits(formData.applicantNationalCode).trim() || null,
      applicant_mobile: normalizeDigits(formData.applicantMobile).trim() || null,

      household_size: toNumber(formData.householdSize),
      men_count: toNumber(formData.menCount),
      women_count: toNumber(formData.womenCount),
      children_count: toNumber(formData.childrenCount),
      elderly_count: toNumber(formData.elderlyCount),
      disabled_count: toNumber(formData.disabledCount),

      request_type: requestType,
      priority_level: priorityLevel,

      requested_from: requestedFromText,
      requested_until: requestedUntilText,

      needs_medical_support: formData.needsMedicalSupport,
      needs_accessibility: formData.needsAccessibility,
      needs_separate_space: formData.needsSeparateSpace,

      address: formData.address.trim() || null,
      description: formData.description.trim() || null,

      attachments: {
        national_card: attachments.nationalCard.map((file) => file.name),
        companions_identity: attachments.companionsIdentity.map((file) => file.name),
        referral_document: attachments.referralDocument.map((file) => file.name),
        other_documents: attachments.otherDocuments.map((file) => file.name),
      },

      meta: {
        applicant_type: formData.applicantType,
        father_name: formData.fatherName.trim() || null,
        age: normalizeDigits(formData.age).trim() || null,
        preferred_region: formData.preferredRegion.trim() || null,
        current_status: formData.currentStatus.trim() || null,
        has_infant: formData.hasInfant,
        urgent_need: formData.urgentNeed,
        selected_shelter_name: selectedShelter?.name ?? null,
        selected_shelter_gender_type: selectedShelter?.genderType ?? null,
        selected_shelter_admission_type: selectedShelter?.admissionType ?? null,
      },
    };

    try {
      const response = await fetch("/api/shelter-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors(mapBackendErrors(result, formData));
        scrollToTop();
        return;
      }

      const item = result?.data ?? result;
      setTrackingCode(
        item?.request_number ||
          item?.tracking_code ||
          item?.id?.toString?.() ||
          "ثبت شد"
      );

      setSubmitted(true);
      resetForm();
      scrollToTop();
    } catch {
      setErrors({
        submit: "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.",
      });
      scrollToTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      ref={topRef}
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <Home className="h-4 w-4" />
                ثبت درخواست اسکان موقت
              </div>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">
                فرم ثبت درخواست اسکان موقت
              </h1>
              <p className="mt-4 max-w-3xl leading-8 text-slate-200">
                اطلاعات درخواست را کامل وارد کنید تا درخواست شما برای بررسی به
                سامانه اسکان ارسال شود.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <HeroStat icon={<Building2 />} label="مراکز فعال" value="۳" />
              <HeroStat icon={<BedDouble />} label="ظرفیت آزاد" value="۷۱" />
              <HeroStat icon={<Clock3 />} label="زمان بررسی" value="۲۴ ساعت" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitted && (
            <SuccessBox>
              درخواست شما با موفقیت ثبت شد. کد پیگیری:{" "}
              <span className="font-black">{trackingCode}</span>
            </SuccessBox>
          )}

          {errors.submit && <WarningBox>{errors.submit}</WarningBox>}

          <Card
            title="انتخاب محل اسکان"
            description="یکی از مراکز پیشنهادی را انتخاب کنید."
            icon={<Building2 className="h-5 w-5" />}
          >
            <div className="grid gap-4">
              {shelters.map((shelter) => (
                <button
                  key={shelter.id}
                  type="button"
                  onClick={() => {
                    setSelectedShelterId(shelter.id);
                    setErrors((prev) => ({
                      ...prev,
                      selectedShelterId: undefined,
                      submit: undefined,
                    }));
                  }}
                  className={`rounded-2xl border bg-white p-4 text-right transition ${
                    selectedShelterId === shelter.id
                      ? "border-blue-500 ring-4 ring-blue-100"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{shelter.name}</h3>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4" />
                        {shelter.region} - {shelter.address}
                      </p>
                    </div>
                    <StatusBadge status={shelter.status} />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                    <span>ظرفیت کل: {shelter.capacity}</span>
                    <span>ظرفیت آزاد: {shelter.available}</span>
                    <span>نوع پذیرش: {admissionTypeLabel(shelter.admissionType)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {shelter.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            {errors.selectedShelterId && (
              <FieldError>{errors.selectedShelterId}</FieldError>
            )}
          </Card>

          {selectedShelter && <SelectedShelterBox shelter={selectedShelter} />}

          <Card
            title="نوع متقاضی"
            description="این فیلد جدا از نوع درخواست است و در meta.applicant_type ذخیره می‌شود."
            icon={<Users className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <SelectableCard
                title="آقایان"
                subtitle="درخواست برای متقاضیان مرد"
                active={formData.applicantType === "men"}
                onClick={() => handleChange("applicantType", "men")}
              />
              <SelectableCard
                title="بانوان"
                subtitle="درخواست برای متقاضیان زن"
                active={formData.applicantType === "women"}
                onClick={() => handleChange("applicantType", "women")}
              />
              <SelectableCard
                title="خانواده"
                subtitle="درخواست خانوادگی یا همراهان"
                active={formData.applicantType === "family"}
                onClick={() => handleChange("applicantType", "family")}
              />
            </div>
            {errors.applicantType && <FieldError>{errors.applicantType}</FieldError>}
          </Card>

          <Card
            title="نوع درخواست و اولویت"
            description="این بخش مستقیماً با request_type و priority_level بک‌اند map می‌شود."
            icon={<ShieldAlert className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="نوع درخواست"
                value={requestType}
                onChange={(value) => setRequestType(value as RequestType)}
                options={[
                  { value: "temporary", label: "اسکان موقت" },
                  { value: "emergency", label: "اضطراری" },
                  { value: "family", label: "خانوادگی" },
                  { value: "referral", label: "ارجاعی" },
                ]}
              />

              <Select
                label="سطح اولویت"
                value={priorityLevel}
                onChange={(value) => setPriorityLevel(value as PriorityLevel)}
                options={[
                  { value: "low", label: "کم" },
                  { value: "normal", label: "عادی" },
                  { value: "high", label: "زیاد" },
                  { value: "urgent", label: "فوری" },
                  { value: "critical", label: "بحرانی" },
                ]}
              />
            </div>
          </Card>

          <Card
            title="اطلاعات متقاضی"
            description="اطلاعات اصلی شخص ثبت‌کننده درخواست را وارد کنید."
            icon={<User className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="نام و نام خانوادگی"
                value={formData.applicantName}
                onChange={(value) => handleChange("applicantName", value)}
                error={errors.applicantName}
                required
              />
              <Input
                label="نام پدر"
                value={formData.fatherName}
                onChange={(value) => handleChange("fatherName", value)}
              />
              <Input
                label="کد ملی"
                value={formData.applicantNationalCode}
                onChange={(value) => handleChange("applicantNationalCode", value)}
                error={errors.applicantNationalCode}
                icon={<IdCard className="h-4 w-4" />}
              />
              <Input
                label="شماره موبایل"
                value={formData.applicantMobile}
                onChange={(value) => handleChange("applicantMobile", value)}
                error={errors.applicantMobile}
                icon={<Phone className="h-4 w-4" />}
              />
              <Input
                label="سن"
                value={formData.age}
                onChange={(value) => handleChange("age", value)}
              />
              <Input
                label="منطقه پیشنهادی"
                value={formData.preferredRegion}
                onChange={(value) => handleChange("preferredRegion", value)}
              />
            </div>
          </Card>

          <Card
            title="اطلاعات خانوار"
            description="تعداد نفرات و شرایط همراهان را وارد کنید."
            icon={<Users className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                label="تعداد کل نفرات"
                value={formData.householdSize}
                onChange={(value) => handleChange("householdSize", value)}
                error={errors.householdSize}
                required
              />
              <Input
                label="تعداد آقایان"
                value={formData.menCount}
                onChange={(value) => handleChange("menCount", value)}
                error={errors.menCount}
              />
              <Input
                label="تعداد بانوان"
                value={formData.womenCount}
                onChange={(value) => handleChange("womenCount", value)}
                error={errors.womenCount}
              />
              <Input
                label="تعداد کودکان"
                value={formData.childrenCount}
                onChange={(value) => handleChange("childrenCount", value)}
              />
              <Input
                label="تعداد سالمندان"
                value={formData.elderlyCount}
                onChange={(value) => handleChange("elderlyCount", value)}
                error={errors.elderlyCount}
              />
              <Input
                label="تعداد افراد دارای معلولیت"
                value={formData.disabledCount}
                onChange={(value) => handleChange("disabledCount", value)}
                error={errors.disabledCount}
              />
            </div>
          </Card>

          <Card
            title="بازه زمانی درخواست"
            description="تاریخ‌ها در فرم شمسی هستند، اما به میلادی برای Laravel ارسال می‌شوند."
            icon={<Clock3 className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <PersianDateInput
                label="تاریخ شروع"
                value={requestedFrom}
                onChange={setRequestedFrom}
                error={errors.requestedFrom}
              />
              <PersianDateInput
                label="تاریخ پایان"
                value={requestedUntil}
                onChange={setRequestedUntil}
                error={errors.requestedUntil}
              />
            </div>
          </Card>

          <Card
            title="شرایط خاص"
            description="در صورت وجود نیازهای ویژه، موارد مرتبط را انتخاب کنید."
            icon={<HeartPulse className="h-5 w-5" />}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Checkbox
                label="نیاز به حمایت پزشکی دارد"
                checked={formData.needsMedicalSupport}
                onChange={(checked) => handleChange("needsMedicalSupport", checked)}
              />
              <Checkbox
                label="نیاز به دسترسی‌پذیری دارد"
                checked={formData.needsAccessibility}
                onChange={(checked) => handleChange("needsAccessibility", checked)}
              />
              <Checkbox
                label="نیاز به فضای جداگانه دارد"
                checked={formData.needsSeparateSpace}
                onChange={(checked) => handleChange("needsSeparateSpace", checked)}
              />
              <Checkbox
                label="نوزاد همراه دارد"
                checked={formData.hasInfant}
                onChange={(checked) => handleChange("hasInfant", checked)}
              />
              <Checkbox
                label="نیاز فوری دارد"
                checked={formData.urgentNeed}
                onChange={(checked) => handleChange("urgentNeed", checked)}
              />
            </div>
          </Card>

          <Card
            title="نشانی و توضیحات"
            description="نشانی فعلی و توضیحات تکمیلی را ثبت کنید."
            icon={<MapPin className="h-5 w-5" />}
          >
            <div className="grid gap-4">
              <TextArea
                label="نشانی فعلی"
                value={formData.address}
                onChange={(value) => handleChange("address", value)}
                error={errors.address}
                required
              />
              <TextArea
                label="وضعیت فعلی"
                value={formData.currentStatus}
                onChange={(value) => handleChange("currentStatus", value)}
              />
              <TextArea
                label="توضیحات"
                value={formData.description}
                onChange={(value) => handleChange("description", value)}
              />
            </div>
          </Card>

          <Card
            title="پیوست‌ها"
            description="در این نسخه نام فایل‌ها داخل attachments ارسال می‌شود. برای آپلود واقعی فایل باید endpoint آپلود جداگانه داشته باشیم."
            icon={<Upload className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <UploadBox
                label="تصویر کارت ملی"
                files={attachments.nationalCard}
                onChange={(files) => handleFiles("nationalCard", files)}
                onRemove={(index) => removeFile("nationalCard", index)}
              />
              <UploadBox
                label="مدارک همراهان"
                files={attachments.companionsIdentity}
                onChange={(files) => handleFiles("companionsIdentity", files)}
                onRemove={(index) => removeFile("companionsIdentity", index)}
              />
              <UploadBox
                label="نامه ارجاع"
                files={attachments.referralDocument}
                onChange={(files) => handleFiles("referralDocument", files)}
                onRemove={(index) => removeFile("referralDocument", index)}
              />
              <UploadBox
                label="سایر مدارک"
                files={attachments.otherDocuments}
                onChange={(files) => handleFiles("otherDocuments", files)}
                onRemove={(index) => removeFile("otherDocuments", index)}
              />
            </div>
          </Card>

          <Card
            title="تأیید نهایی"
            description="قبل از ثبت، صحت اطلاعات را بررسی کنید."
            icon={<CheckCircle2 className="h-5 w-5" />}
          >
            <Checkbox
              label="صحت اطلاعات واردشده را تأیید می‌کنم و قوانین ثبت درخواست را می‌پذیرم."
              checked={formData.acceptRules}
              onChange={(checked) => handleChange("acceptRules", checked)}
              error={errors.acceptRules}
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    در حال ثبت درخواست
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    ثبت درخواست
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
              >
                پاک کردن فرم
              </button>
            </div>
          </Card>
        </form>

        <aside className="space-y-6">
          <InfoPanel />
          <StepsPanel />
          <SupportPanel />
        </aside>
      </section>
    </main>
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
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        {icon && (
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">{icon}</div>
        )}
        <div>
          <h2 className="text-lg font-black">{title}</h2>
          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
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
  error,
  icon,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="relative">
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
            icon ? "pr-10" : ""
          } ${error ? "border-red-300" : "border-slate-200"}`}
        />
      </div>
      {error && <FieldError>{error}</FieldError>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      />
      {error && <FieldError>{error}</FieldError>}
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
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PersianDateInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: DateObject | null;
  onChange: (value: DateObject | null) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <DatePicker
        value={value}
        onChange={(date) => onChange(date as DateObject | null)}
        calendar={persian}
        locale={persianFa}
        calendarPosition="bottom-right"
        inputClass={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
        placeholder="انتخاب تاریخ"
      />
      {error && <FieldError>{error}</FieldError>}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  error,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4"
      />
      <span className="text-sm leading-6 text-slate-700">
        {label}
        {error && <FieldError>{error}</FieldError>}
      </span>
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
      className={`rounded-2xl border p-4 text-right transition ${
        active
          ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
          : "border-slate-200 bg-white hover:border-blue-300"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>
        {active && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
      </div>
    </button>
  );
}

function UploadBox({
  label,
  files,
  onChange,
  onRemove,
}: {
  label: string;
  files: File[];
  onChange: (files: FileList | null) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-white p-5 text-center">
        <Upload className="h-6 w-6 text-blue-600" />
        <span className="font-bold text-slate-800">{label}</span>
        <span className="text-xs text-slate-500">انتخاب فایل</span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => onChange(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SelectedShelterBox({ shelter }: { shelter: Shelter }) {
  return (
    <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 text-blue-950">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-1 h-5 w-5 text-blue-600" />
        <div>
          <h3 className="font-black">محل اسکان انتخاب‌شده</h3>
          <p className="mt-2 text-sm leading-7">
            {shelter.name} - {shelter.region} - {shelter.address}
          </p>
        </div>
      </div>
    </div>
  );
}

function WarningBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
      <div className="flex gap-3">
        <ShieldAlert className="mt-1 h-5 w-5 shrink-0" />
        <div>{children}</div>
      </div>
    </div>
  );
}

function SuccessBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
      <div className="flex gap-3">
        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />
        <div>{children}</div>
      </div>
    </div>
  );
}

function InfoPanel() {
  return (
    <Card
      title="راهنمای تکمیل"
      description="قبل از ثبت درخواست این موارد را بررسی کنید."
      icon={<FileText className="h-5 w-5" />}
    >
      <ul className="space-y-3 text-sm leading-7 text-slate-600">
        <li>اطلاعات هویتی متقاضی را دقیق وارد کنید.</li>
        <li>نوع متقاضی جدا از نوع درخواست ثبت می‌شود.</li>
        <li>تاریخ شمسی در فرم به میلادی برای بک‌اند ارسال می‌شود.</li>
        <li>پس از ثبت، کد پیگیری درخواست نمایش داده می‌شود.</li>
      </ul>
    </Card>
  );
}

function StepsPanel() {
  return (
    <Card
      title="مراحل بررسی"
      icon={<Clock3 className="h-5 w-5" />}
    >
      <div className="space-y-3 text-sm text-slate-600">
        <StepItem number="۱" text="ثبت درخواست توسط متقاضی" />
        <StepItem number="۲" text="بررسی اطلاعات توسط کارشناس" />
        <StepItem number="۳" text="تخصیص محل اسکان در صورت تأیید" />
        <StepItem number="۴" text="اعلام نتیجه از طریق سامانه" />
      </div>
    </Card>
  );
}

function SupportPanel() {
  return (
    <Card
      title="پشتیبانی"
      icon={<Phone className="h-5 w-5" />}
    >
      <p className="text-sm leading-7 text-slate-600">
        در صورت بروز مشکل در ثبت درخواست، با پشتیبانی سامانه تماس بگیرید.
      </p>
      <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-center font-black">
        ۱۳۷
      </div>
    </Card>
  );
}

function StepItem({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
        {number}
      </span>
      <span>{text}</span>
    </div>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
      <div className="mb-3 text-slate-200">{icon}</div>
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-sm text-slate-200">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: ShelterStatus }) {
  const config = {
    active: "bg-emerald-100 text-emerald-700",
    limited: "bg-amber-100 text-amber-700",
    full: "bg-red-100 text-red-700",
  };

  const label = {
    active: "فعال",
    limited: "ظرفیت محدود",
    full: "تکمیل ظرفیت",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${config[status]}`}>
      {label[status]}
    </span>
  );
}

function FieldError({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-xs font-bold text-red-600">{children}</p>;
}

function admissionTypeLabel(value: ShelterAdmissionType) {
  const labels: Record<ShelterAdmissionType, string> = {
    normal: "عادی",
    emergency: "اضطراری",
    referral: "ارجاعی",
  };

  return labels[value];
}

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function toNumber(value: string) {
  const normalized = normalizeDigits(value).trim();
  if (!normalized) return 0;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function isValidIranMobile(value: string) {
  return /^09\d{9}$/.test(normalizeDigits(value).trim());
}

function isValidIranNationalCode(value: string) {
  const code = normalizeDigits(value).trim();

  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false;

  const check = Number(code[9]);
  const sum = code
    .slice(0, 9)
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * (10 - index), 0);

  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

function toGregorianDate(value: DateObject | null) {
  if (!value) return null;

  return new DateObject(value)
    .convert(gregorian, gregorianEn)
    .format("YYYY-MM-DD");
}

function mapBackendErrors(result: any, formData: FormData): FormErrors {
  if (!result?.errors || typeof result.errors !== "object") {
    return {
      submit: result?.message || "ثبت درخواست با خطا مواجه شد.",
    };
  }

  const backendErrors: FormErrors = {};

  Object.entries(result.errors).forEach(([key, value]) => {
    const message = Array.isArray(value) ? String(value[0]) : String(value);

    const mappedKey = backendFieldToFrontendField(key);

    if (mappedKey) {
      backendErrors[mappedKey] = message;
      return;
    }

    if (key in formData) {
      backendErrors[key as keyof FormData] = message;
      return;
    }

    backendErrors.submit = message;
  });

  return backendErrors;
}

function backendFieldToFrontendField(key: string): keyof FormErrors | null {
  const map: Record<string, keyof FormErrors> = {
    neighborhood_hall_id: "selectedShelterId",
    applicant_name: "applicantName",
    applicant_national_code: "applicantNationalCode",
    applicant_mobile: "applicantMobile",
    household_size: "householdSize",
    men_count: "menCount",
    women_count: "womenCount",
    children_count: "childrenCount",
    elderly_count: "elderlyCount",
    disabled_count: "disabledCount",
    requested_from: "requestedFrom",
    requested_until: "requestedUntil",
    address: "address",
    description: "description",
    "meta.applicant_type": "applicantType",
    "meta.father_name": "fatherName",
    "meta.age": "age",
    "meta.preferred_region": "preferredRegion",
    "meta.current_status": "currentStatus",
  };

  return map[key] ?? null;
}
