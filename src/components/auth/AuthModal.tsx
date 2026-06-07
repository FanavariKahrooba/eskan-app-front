"use client";

import { useEffect } from "react";
// import LoginModal from "./login-modal";
// import VerifyModal from "./verify-modal";
// import RegisterUserOtpModal from "./register-user-otp-modal";
import { useAuthFlowContext } from "@/context/auth-modal-context";
import { AuthSteps } from "@/types";

export default function AuthModal() {
  const { step, isOpen, closeModal } = useAuthFlowContext();

  useEffect(() => {
    if (step === AuthSteps.done && isOpen) {
      const timer = setTimeout(() => {
        closeModal();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [step, isOpen, closeModal]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-medium">ورود</h2>
          <button
            onClick={closeModal}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="بستن مودال"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-visible p-4">
          {/* {step === AuthSteps.login && <LoginModal />} */}
          {/* {step === AuthSteps.verifyOtp && <VerifyModal />} */}
          {/* {step === AuthSteps.register && <RegisterUserOtpModal />} */}
          {step === AuthSteps.done && (
            <div className="flex flex-col items-center justify-center py-6">
              <h3 className="text-lg font-bold text-green-600"></h3>
              <p className="mt-2 text-center text-sm text-gray-500">
                کاربر گرامی شما با موفقیت وارد حساب کاربری خود شدید.
              </p>
              <button
                onClick={closeModal}
                className="mt-6 w-32 rounded-lg bg-blue-600 py-2 text-sm text-white shadow transition hover:bg-blue-700"
              >
                بستن
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
