"use client"

import { useStepper } from "./stepper"

export function StepperNavigation({ isLast = false }: any) {
  const { next, prev, step, stepsCount } = useStepper()

  return (
    <div className="flex items-center justify-between mt-6">
      <button onClick={prev} disabled={step === 0} className="px-4 py-2 rounded-md border disabled:opacity-50">
        مرحله قبل
      </button>

      <button onClick={next} className="px-4 py-2 rounded-md bg-primary text-white">
        {step === stepsCount - 1 ? "ثبت" : "مرحله بعد"}
      </button>
    </div>
  )
}
