"use client"

import { motion } from "framer-motion"

export default function WidgetCard({ title, icon: Icon, children }: any) {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} />
        <h3 className="font-semibold">{title}</h3>
      </div>

      {children}
    </motion.div>
  )
}
