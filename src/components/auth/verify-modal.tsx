"use client";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import Form from "next/form";
import { useFormStatus } from "react-dom";
import { SubmitButton } from "./submit-button";
import LoadingCssForm from "@/components/share/LoadingCssForm";
import { Toast } from "@/components/share/Toast";
import { useAuthFlowContext } from "@/context/auth-modal-context";
import { useAuth } from "@/hooks/auth";
import OtpTimerModal from "./otp-timer-modal";
import { AuthSteps, FormState } from "@/types";
import OTPInput from "./otp-input";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./otp-input-new";
import { ImageInfo, webSiteInfo } from "@/config/website-info";
import Image from "next/image";
import { getCookie, setCookie } from "cookies-next";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function VerifyModal() {
  const cookies = getCookie("ct_ot");
  const { VerifyOtp } = useAuth();
  const { setStep } = useAuthFlowContext();
  const [otp_code, setOtpCode] = useState("");
  const [errors, setErrors] = useState<any>([]);
  const ref = useRef<HTMLFormElement | null>(null);
  const status = useFormStatus();
  const [loadingResend, setLoadingResend] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const inputOtpRef = useRef<any>(null);
  const t = useTranslations("Auth");
  const t2 = useTranslations("WebSiteInfo");

  useEffect(() => {
    setTimeout(() => {
      if (inputOtpRef.current) {
        const firstInput = inputOtpRef.current.querySelector("input");
        firstInput?.focus();
      }
    }, 100);
  }, []);

  const handleOtpComplete = (pin: string) => {
    setOtpCode(pin);
    if (pin.length === 5) {
      setTimeout(() => {
        ref.current?.requestSubmit();
      }, 100);
    }
  };

  const submitForm = async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    const user_id = cookies;
    const result = await VerifyOtp({ setErrors, otp_code, user_id });
    if (result?.success === true) {
      setStep(AuthSteps.done);
    }
    return {};
  };

  const handleLoginEdit = () => setStep(AuthSteps.login);

  const handleResendCode = async () => {
    try {
      setLoadingResend(true);
      const phone_number = getCookie("phone_number");

      if (!phone_number) {
        toast.error("شماره تلفن موجود نیست");
        return;
      }

      const response = await axios.post("/api/v1/user/send-otp-request", {
        phone_number,
      });

      if (response.data.status === "success") {
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 5);
        setCookie("ct_ot", response.data?.user, {
          expires: expirationDate,
        });
        setCookie("ExpTime", expirationDate, {
          expires: expirationDate,
        });
        setCookie("phone_number", response.data?.phone_number);
        setShowResend(false);
      } else {
        toast.error("خطا در ارسال مجدد کد:", response.data.message);
      }
    } catch (error: any) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoadingResend(false);
    }
  };

  const [state, formAction] = useActionState(submitForm, {
    data: null,
    error: null,
  });

  return (
    <div className="mx-auto w-full max-w-sm flex flex-col space-y-4">
      <div className="flex flex-col items-center justify-center space-y-3 mt-4">
        <Image
          src="/assets/img/auth/code.png"
          width={80}
          height={150}
          alt="otp-icons"
        />
        <h2
          className="text-base font-semibold text-gray-700
        "
        >
          {t("OtpLoginTitle")}
        </h2>
        <p className="text-sm text-gray-400">{t("OtpLoginDescription")}</p>
        <div className=" flex flex-row gap-x-2 items-center justify-center text-center">
          <span
            dir="ltr"
            className="text-gray-700 font-bold text-center text-lg"
          >
            {getCookie("phone_number")}
          </span>
          <button type="button" onClick={handleLoginEdit}>
            <BiSolidMessageSquareEdit className=" w-6 h-6 text-orange-300 hover:text-orange-400 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* فرم */}
      <Form
        ref={ref}
        action={formAction}
        className={`${status.pending ? "opacity-50" : ""}`}
      >
        <div className="flex flex-col gap-y-4 mt-4">
          {/* <OTPInput
            length={5}
            onComplete={handleOtpComplete}
            // className="justify-center"
          /> */}
          <div className=" w-full items-center justify-center flex" dir="ltr">
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

          <SubmitButton
            active={otp_code?.length < 5}
            className={`w-full ${otp_code?.length < 5 ? "opacity-50" : ""}`}
            textTitle={t("Submit")}
            textLoading={t("Loading")}
          />

          {!showResend ? (
            <OtpTimerModal
              cookieKey="otp_timer"
              durationInSeconds={120}
              onExpire={() => setShowResend(true)}
            />
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loadingResend}
              className="w-full py-2 text-sm bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
            >
              {loadingResend ? t("ResendInProgress") : t("Loading")}
            </button>
          )}
          {/* <OtpTimerModal cookieKey="otp_timer" durationInSeconds={120} /> */}

          <div className="text-center mt-2">
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
        <LoadingCssForm />
      </Form>
      <Toast />
    </div>
  );
}
