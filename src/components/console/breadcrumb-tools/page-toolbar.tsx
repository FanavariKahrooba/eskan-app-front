"use client"

import { motion } from "framer-motion"

export default function PageToolbar({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        flex items-center gap-2
        py-2
        overflow-x-auto
      "
    >
      {children}
    </motion.div>
  )
}
