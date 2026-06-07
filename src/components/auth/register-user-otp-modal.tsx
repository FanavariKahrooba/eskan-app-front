"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Toast } from "@/components/share/Toast";
// import OTPInput from "./otp-input";
import { getCookie } from "cookies-next";
import ErrorComponent from "./error-component";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { AuthSteps, FormState } from "@/types";
import { useFormStatus } from "react-dom";
import Form from "next/form";
import { SubmitButton } from "./submit-button";
import { useAuthContext } from "@/context/auth-modal-context";
import { useAuthFlowContext } from "@/context/auth-modal-context";
import OtpTimerModal from "./otp-timer-modal";
import { Label, TextInput } from "flowbite-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./otp-input-new";
import { useTranslations } from "next-intl";
import { ImageInfo, webSiteInfo } from "@/config/website-info";
import Image from "next/image";

type Errors = Record<string, string[]>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterUserOtpModal = () => {
  const { register } = useAuthContext();
  const { setStep } = useAuthFlowContext();
  const t = useTranslations("Auth");
  const t2 = useTranslations("WebSiteInfo");

  const phone = getCookie("phone_number") as string | undefined;
  const [phone_number, setPhoneNumber] = useState<string>(phone || "");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [national_code, setNationalCode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [otp_code, setOtpCode] = useState("");
  const inputOtpRef = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputOtpRef.current) {
        const firstInput = inputOtpRef.current.querySelector("input");
        firstInput?.focus();
      }
    }, 100);
  }, []);

  const setFieldError = (name: string, messages: string[]) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (messages.length) next[name] = messages;
      else delete next[name];
      return next;
    });
  };

  const validateField = (name: string, value: string): string[] => {
    switch (name) {
      case "first_name":
        if (!value.trim()) return [t("Validation_FirstName_Required")];
        return [];
      case "last_name":
        if (!value.trim()) return [t("Validation_LastName_Required")];
        return [];
      case "national_code":
        if (!value.trim()) return [t("Validation_NationalCode_Required")];
        if (!/^\d{10}$/.test(value))
          return [t("Validation_NationalCode_Invalid")];
        return [];
      case "email":
        if (!value.trim()) return [t("Validation_Email_Required")];
        if (!emailRegex.test(value)) return [t("Validation_Email_Invalid")];
        return [];
      case "phone_number":
        if (!value.trim()) return [t("Validation_Phone_Required")];
        return [];
      case "otp_code":
        if (!value.trim()) return [t("Validation_Otp_Required")];
        if (value.length !== 5) return [t("Validation_Otp_Invalid")];
        return [];
      default:
        return [];
    }
  };

  const validateForm = (): boolean => {
    const fields: Array<[string, string]> = [
      ["first_name", first_name],
      ["last_name", last_name],
      // ["national_code", national_code],
      // ["email", email],
      ["phone_number", phone_number],
      ["otp_code", otp_code],
    ];
    const collected: Errors = {};
    fields.forEach(([k, v]) => {
      const msgs = validateField(k, v || "");
      if (msgs.length) collected[k] = msgs;
    });
    setErrors(collected);
    return Object.keys(collected).length === 0;
  };

  const handleOtpComplete = (pin: string) => {
    setOtpCode(pin);
    setFieldError("otp_code", validateField("otp_code", pin));
  };

  const submitForm = async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    if (!validateForm()) {
      return {};
    }

    const res = await register({
      setErrors,
      phone_number,
      first_name,
      last_name,
      otp_code,
      email,
      national_code,
    });

    if (res?.success == true) {
      setStep(AuthSteps.done);
    } else if (res?.errors == true) {
    }
    return {};
  };

  function handleLoginEdit() {
    setStep(AuthSteps.login);
  }

  const [state, formAction] = useActionState(submitForm, {
    data: null,
    error: null,
  });
  const ref = useRef<HTMLFormElement | null>(null);
  const status = useFormStatus();

  return (
    <>
      <div className=" absolute top-2 -right-4  bg-red-600 z-10 w-10"> </div>
      <div className="flex flex-col items-center justify-center text-center space-y-1 mb-4">
        <div className=" flex items-center justify-center mb-2">
          <Image
            src={ImageInfo.auth}
            alt={webSiteInfo.websiteName || "نام سایت"}
            width={600}
            height={600}
            className=" w-auto h-[150px] lg:h-[200px] rounded-md "
          />
        </div>
      </div>
      <div className="">
        <Form
          ref={ref}
          action={formAction}
          className={`${status.pending ? " opacity-50" : ""}`}
        >
          <div className=" grid grid-cols-1 gap-y-1">
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label
                  className="font-bold"
                  htmlFor="register_new_user_first_name"
                >
                  {t("FirstName")}
                </Label>
              </div>
              <TextInput
                name="last_name"
                id="register_new_user_first_name"
                type="text"
                value={first_name}
                onChange={(e: any) => {
                  setFirstName(e.target.value);
                  if (errors.first_name)
                    setFieldError(
                      "first_name",
                      validateField("first_name", e.target.value)
                    );
                }}
                onBlur={(e) =>
                  setFieldError(
                    "first_name",
                    validateField("first_name", e.target.value)
                  )
                }
              />
              {errors.first_name && (
                <ErrorComponent text={errors.first_name[0]} />
              )}
            </div>

            <div className="max-w-md">
              <div className="mb-2 block">
                <Label
                  className="font-bold"
                  htmlFor="register_new_user_last_name"
                >
                  {t("LastName")}
                </Label>
              </div>
              <TextInput
                name="last_name"
                id="register_new_user_last_name"
                type="text"
                value={last_name}
                onChange={(e: any) => {
                  setLastName(e.target.value);
                  if (errors.last_name)
                    setFieldError(
                      "last_name",
                      validateField("last_name", e.target.value)
                    );
                }}
                onBlur={(e) =>
                  setFieldError(
                    "last_name",
                    validateField("last_name", e.target.value)
                  )
                }
              />
              {errors.last_name && (
                <ErrorComponent text={errors.last_name[0]} />
              )}
            </div>

            {/* <div className="max-w-md">
              <div className="mb-2 block">
                <Label
                  className="font-bold"
                  htmlFor="register_new_user_national_code"
                >
                  کد ملی
                </Label>
              </div>
              <TextInput
                dir="ltr"
                name="national_code"
                id="register_new_user_national_code"
                type="number"
                pattern="\d*"
                value={national_code}
                onChange={(e: any) => {
                  const v = e.target.value.replace(/[^\d]/g, "");
                  setNationalCode(v);
                  if (errors.national_code)
                    setFieldError(
                      "national_code",
                      validateField("national_code", v)
                    );
                }}
              />
              {errors.national_code && (
                <ErrorComponent text={errors.national_code[0]} />
              )}
            </div> */}

            {/* <div className="max-w-md">
              <div className="mb-2 block">
                <Label className="font-bold" htmlFor="register_new_user_email">
                  پست الکترونیکی
                </Label>
              </div>
              <TextInput
                dir="ltr"
                name="email"
                id="register_new_user_email"
                type="email"
                value={email}
                onChange={(e: any) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setFieldError(
                      "email",
                      validateField("email", e.target.value)
                    );
                }}
              />
              {errors.email && <ErrorComponent text={errors.email[0]} />}
            </div> */}

            <div className="max-w-md">
              <div className="mb-2 block">
                <Label className="font-bold" htmlFor="register_new_user_phone">
                  {t("Phone")}
                </Label>
              </div>
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label
                    className="font-bold"
                    htmlFor="register_new_user_phone"
                  >
                    {t("Phone")}
                  </Label>
                </div>
                <div
                  dir="ltr"
                  className=" flex flex-col justify-center items-center "
                >
                  <PhoneInput
                    defaultCountry="ir"
                    value={phone_number}
                    disabled={true}
                    onChange={(phone_number) => setPhoneNumber(phone_number)}
                  />
                  {errors.phone_number && (
                    <ErrorComponent text={errors.phone_number[0]} />
                  )}
                  <div dir=" rtl" className=" mt-2"></div>
                </div>
                {/* <InputError messages={errors.phone_number} className="mt-2" /> */}
              </div>
            </div>

            <div className="max-w-md">
              <div className="mb-2 block">
                <Label className="font-bold" htmlFor="register_new_user_code">
                  {t("OtpCode")}
                </Label>
              </div>
              <div
                className=" w-full items-center justify-center flex"
                dir="ltr"
              >
                <InputOTP
                  maxLength={5}
                  value={otp_code}
                  onChange={(value) => setOtpCode(value)}
                  ref={inputOtpRef}
                >
                  <InputOTPGroup className="">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {/* <OTPInput length={5} onComplete={handleOtpComplete} /> */}
              {errors.otp_code && <ErrorComponent text={errors.otp_code[0]} />}
              <div className=" mt-3">
                <OtpTimerModal cookieKey={""} durationInSeconds={0} />
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <div className=" flex flex-col gap-y-2 justify-center items-center">
              <SubmitButton
                active={otp_code?.length <= 4 ? true : false}
                className={`${otp_code?.length <= 4 ? "opacity-50" : ""} `}
                textTitle={t("Register")}
                textLoading={t("Loading")}
              />
              <button
                type="button"
                onClick={() => handleLoginEdit()}
                className="flex flex-row items-center cursor-pointer justify-center text-center w-1/2 border rounded-md outline-hidden py-2 bg-gray-700 border-none text-white text-sm shadow-xs hover:bg-gray-800"
              >
                {t("EditPhone")}
              </button>

              {errors.send_code && (
                <div className="w-full flex flex-col items-center">
                  <ErrorComponent text={errors.send_code[0]} />
                  <button
                    type="button"
                    onClick={() => {
                      "OtpCode";
                    }}
                    className="flex flex-row items-center justify-center text-center w-1/2 border rounded-md outline-hidden py-2 bg-gray-700 border-none text-white text-sm shadow-xs hover:bg-gray-800 mt-2"
                  >
                    {t("EditPhone")}
                  </button>
                </div>
              )}

              <div>
                <Link href="/term">
                  <span className="text-xs mt-2">
                    {t("TermsText")}
                    <button
                      type="button"
                      className="inline-block text-xs pr-1 pl-1 text-blue-600"
                    >
                      {t("TermsLink")}
                    </button>
                    {t("TermsPost")}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Form>
      </div>

      <Toast />
    </>
  );
};

export default RegisterUserOtpModal;
