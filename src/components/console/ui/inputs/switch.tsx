"use client"

import { motion } from "framer-motion"

export function Switch({ checked, onChange }: any) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`
        w-11 h-6 rounded-full p-1 cursor-pointer duration-300 flex items-center
        ${checked ? "bg-primary" : "bg-gray-300"}
      `}
    >
      <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-4 h-4 rounded-full bg-white" />
    </div>
  )
}
