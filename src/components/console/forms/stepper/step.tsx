"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStepper } from "./stepper"

export function Step({ children }: any) {
  const { step } = useStepper()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
