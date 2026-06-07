// components/forms/form-error.tsx
"use client"
import { motion } from "framer-motion"

export default function FormError({ children }: { children?: string }) {
  if (!children) return null

  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="text-xs text-red-500">
      {children}
    </motion.p>
  )
}
