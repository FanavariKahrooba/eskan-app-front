// FormContext.tsx
//-------------------------------------------
//  Lightweight Context for Form Store
//-------------------------------------------

"use client"

import { createContext, useContext } from "react"

export const FormContext = createContext<any | null>(null)

export function useFormContext() {
  const ctx = useContext(FormContext)
  if (!ctx) {
    throw new Error("useFormContext must be used inside <FormProvider>")
  }
  return ctx
}
