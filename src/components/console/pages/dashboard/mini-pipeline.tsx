"use client"

import { motion } from "framer-motion"

const cols = [
  { title: "جدید", count: 12, color: "blue" },
  { title: "در حال پردازش", count: 8, color: "amber" },
  { title: "ارسال شده", count: 5, color: "green" },
]

export default function MiniPipeline() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border p-6 rounded-3xl shadow-sm">
      <h3 className="font-bold text-lg mb-4">وضعیت سفارشات</h3>

      <div className="grid grid-cols-3 gap-4">
        {cols.map((c, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} className={`p-4 rounded-2xl border bg-${c.color}-50`}>
            <p className="text-sm text-gray-500">{c.title}</p>
            <p className="text-2xl font-bold text-${c.color}-600 mt-1">{c.count}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
