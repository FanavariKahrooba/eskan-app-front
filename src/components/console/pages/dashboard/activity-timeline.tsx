"use client"

import { motion } from "framer-motion"
import { CheckCircle2, UserPlus, ShoppingCart } from "lucide-react"

const logs = [
  { icon: UserPlus, text: "کاربر جدید ثبت‌نام کرد", time: "5 دقیقه پیش" },
  { icon: ShoppingCart, text: "سفارش جدید ثبت شد", time: "1 ساعت پیش" },
  { icon: CheckCircle2, text: "پرداخت موفق", time: "2 ساعت پیش" },
]

export default function ActivityTimeline() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border rounded-3xl p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-4">فعالیت‌های اخیر</h3>

      <div className="space-y-6">
        {logs.map((l, i) => {
          const Icon = l.icon
          return (
            <motion.div key={i} className="flex items-start gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                <Icon size={20} />
              </div>

              <div>
                <p className="font-medium text-gray-700">{l.text}</p>
                <p className="text-sm text-gray-400">{l.time}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
