"use client"

import { motion } from "framer-motion"

export function Checkbox({ checked, onChange, label }: any) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className="
          w-5 h-5 rounded-md border bg-white flex items-center justify-center
          transition-all duration-200
        "
      >
        {checked && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-sm bg-primary" />}
      </div>
      <span className="text-sm">{label}</span>
    </label>
  )
}
