"use client";
import React, { createContext, useContext, useState } from "react";
import { AuthContextProps, AuthFlowContextProps, AuthSteps } from "@/types";
import { useAuth } from "@/hooks/auth/auth";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthFlowContext = createContext<AuthFlowContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { user, isAuthenticated, register, logout, registerOtp, VerifyOtp } =
    useAuth();
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        register,
        logout,
        registerOtp,
        VerifyOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const AuthFlowProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [step, setStep] = useState<AuthSteps>(AuthSteps.login);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setStep(AuthSteps.login);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  return (
    <AuthFlowContext.Provider
      value={{ step, setStep, isOpen, openModal, closeModal }}
    >
      {children}
    </AuthFlowContext.Provider>
  );
};

export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
export const useAuthFlowContext = (): AuthFlowContextProps => {
  const context = useContext(AuthFlowContext);
  if (!context) {
    throw new Error(
      "useAuthFlowContext must be used within an AuthFlowProvider"
    );
  }
  return context;
};
