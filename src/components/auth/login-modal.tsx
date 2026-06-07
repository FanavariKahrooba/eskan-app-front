"use client";
import React, { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthSteps, FormState } from "@/types";
import Form from "next/form";
import { useFormStatus } from "react-dom";
import { useAuthFlowContext } from "@/context/auth-modal-context";
import { useAuthContext } from "@/context/auth-modal-context";
import { SubmitButton } from "./submit-button";
import { Toast } from "@/components/share/Toast";
import { Label } from "flowbite-react";
import LoadingCssForm from "../share/LoadingCssForm";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import ErrorComponent from "./error-component";
import { useTranslations } from "next-intl";
import { ImageInfo, webSiteInfo } from "@/config/website-info";
import Image from "next/image";

export default function LoginModal() {
  const t = useTranslations("Auth");
  const t2 = useTranslations("WebSiteInfo");

  const pathname = usePathname();
  const { registerOtp } = useAuthContext();
  const { setStep } = useAuthFlowContext();
  const [phone_number, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState([]);

  const submitForm = async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    const result = await registerOtp({
      setErrors,
      phone_number,
    });
    if (result.success) {
      setStep(AuthSteps.verifyOtp);
    } else if (result.success == false && result.reg) {
      setStep(AuthSteps.register);
    } else if (!result.success) {
    }

    return {};
  };

  const [state, formAction] = useActionState(submitForm, {
    data: null,
    error: null,
  });
  const ref = useRef<HTMLFormElement | null>(null);
  const status = useFormStatus();

  return (
    <>
      <Form
        ref={ref}
        action={formAction}
        className={`${status.pending ? " opacity-50" : ""}`}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-1 mb-6 relative">
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
        <div>
          <div className="text-center">
            <Label> {t("PhoneLabel")}</Label>
            <div
              dir="ltr"
              className=" flex flex-col justify-center items-center"
            >
              <div
                dir="ltr"
                className=" flex flex-col justify-center items-center w-75 phone-input-scale"
              >
                <PhoneInput
                  disabled={status.pending ? true : false}
                  defaultCountry="ir"
                  value={phone_number}
                  onChange={(phone_number) => setPhoneNumber(phone_number)}
                />
                {/* {errors.phone_number && (
                  <ErrorComponent text={errors.phone_number[0]} />
                )} */}
                <div dir=" rtl" className=" mt-2"></div>
              </div>
              <div dir=" rtl" className=" mt-2">
                <p className=" text-xs font-normal mt-2 text-center text-gray-600">
                  {t("subText")}
                </p>
              </div>
            </div>
            {/* <InputError messages={errors.phone_number} className="mt-2" /> */}
          </div>
          <div className="flex flex-col mt-4">
            <div className=" flex flex-col gap-y-2 justify-center items-center">
              <SubmitButton
                active={phone_number?.length < 11 ? true : false}
                className={`${phone_number?.length < 11 ? "opacity-50" : ""} `}
                textTitle={t("Login")}
                textLoading={t("Loading")}
              />
              <div className=" mt-3">
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
        </div>
        <LoadingCssForm />
      </Form>
      {/* <ToastComponent /> */}
      <Toast />
    </>
  );
}
