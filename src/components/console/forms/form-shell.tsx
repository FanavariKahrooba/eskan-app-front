"use client"
import { ReactNode } from "react"
import { motion } from "framer-motion"

export default function FormShell({ children }: { children: ReactNode }) {
  return (
    <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="w-full max-w-3xl mx-auto space-y-10">
      {children}
    </motion.form>
  )
}
