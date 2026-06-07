"use client"

import { motion } from "framer-motion"
import { Plus, UserPlus, Rocket, FileText } from "lucide-react"

const actions = [
  { title: "پروژه جدید", icon: Plus },
  { title: "افزودن کاربر", icon: UserPlus },
  { title: "دیپلوی", icon: Rocket },
  { title: "ایجاد گزارش", icon: FileText },
]

export default function QuickActions() {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold mb-4 text-gray-800">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((a, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 p-3 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
          >
            <a.icon size={16} />
            <span className="text-sm">{a.title}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
