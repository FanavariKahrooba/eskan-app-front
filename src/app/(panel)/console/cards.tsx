"use client"

import { motion } from "framer-motion"

export default function DashboardCards() {
  const cards = [
    { title: "جمع کل فروش", value: "1,250,000" },
    { title: "تعداد سفارش", value: "320" },
    { title: "تعداد ویزیت", value: "8,210" },
    { title: "حجم فروش", value: "4.3%" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          }}
          className="
            relative rounded-2xl p-6 cursor-pointer
            bg-white/70 backdrop-blur-xl
            border border-gray-200 shadow-md
            hover:border-blue-500 transition-all
          "
        >
          {/* افکت گرادیانت گوشه */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 hover:opacity-40 transition-all pointer-events-none"></div>

          <div className="text-gray-600 text-sm font-medium relative z-10">{card.title}</div>

          <div className="text-3xl font-bold mt-3 text-gray-900 relative z-10">{card.value}</div>
        </motion.div>
      ))}
    </div>
  )
}
