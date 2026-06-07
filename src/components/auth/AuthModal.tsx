"use client";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useEffect } from "react";
import LoginModal from "./login-modal";
import VerifyModal from "./verify-modal";
import RegisterUserOtpModal from "./register-user-otp-modal";
import { useAuthFlowContext } from "@/context/auth-modal-context";
import { AuthSteps } from "@/types";

export default function AuthModal() {
  const { step, isOpen, closeModal } = useAuthFlowContext();

  useEffect(() => {
    if (step === AuthSteps.done && isOpen) {
      const timer = setTimeout(() => {
        closeModal();
      }, 2000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [step, isOpen, closeModal]);

  return (
    <Modal
      dismissible
      show={isOpen}
      onClose={closeModal}
      size="md"
      className="backdrop-blur-sm z-10000"
    >
      <ModalHeader className=" text-sm">ورود</ModalHeader>
      <ModalBody className=" overflow-visible">
        {step === AuthSteps.login && <LoginModal />}
        {step === AuthSteps.verifyOtp && <VerifyModal />}
        {step === AuthSteps.register && <RegisterUserOtpModal />}
        {step === AuthSteps.done && (
          <div className="flex flex-col items-center justify-center py-6">
            <h3 className="text-lg font-bold text-green-600"></h3>
            <p className="text-sm text-gray-500 mt-2 text-center">
              کاربر گرامی شما با موفقیت وارد حساب کاربری خود شدید.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 w-32 py-2 rounded-lg bg-blue-600 text-white text-sm shadow hover:bg-blue-700 transition"
            >
              بستن
            </button>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
