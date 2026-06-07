"use client"

import { createContext, useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const StepperContext = createContext<any>(null)

export function useStepper() {
  return useContext(StepperContext)
}

export function Stepper({ children, initialStep = 0, onFinish }: any) {
  const [step, setStep] = useState(initialStep)
  const steps = Array.isArray(children) ? children : [children]

  const next = async () => {
    if (step < steps.length - 1) setStep(step + 1)
    else onFinish?.()
  }
  const prev = () => setStep(Math.max(0, step - 1))

  return (
    <StepperContext.Provider value={{ step, stepsCount: steps.length, next, prev }}>
      <div className="w-full">{steps[step]}</div>
    </StepperContext.Provider>
  )
}




{/* <Stepper
  initialStep={0}
  onFinish={() => console.log("تمام مراحل کامل شد!")}
>
  <Step>
    <FormSection title="اطلاعات کاربر">
      <Input label="نام" />
      <Input label="ایمیل" />
      <StepperNavigation />
    </FormSection>
  </Step>

  <Step>
    <FormSection title="جزئیات پروفایل">
      <Textarea label="بیوگرافی" />
      <ColorPicker label="رنگ تم" />
      <StepperNavigation />
    </FormSection>
  </Step>

  <Step>
    <FormSection title="تنظیمات نهایی">
      <Switch label="دریافت اعلان‌ها" />
      <MultiSelect label="علاقه‌مندی‌ها" />
      <StepperNavigation />
    </FormSection>
  </Step>
</Stepper> */}