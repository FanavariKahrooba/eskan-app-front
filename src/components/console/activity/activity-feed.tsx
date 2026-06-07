"use client"

import { motion } from "framer-motion"

export default function ActivityFeed() {
  const activities = [
    { id: 1, user: "رحیم حسینی", action: "یک سفارش جدید ثبت کرد" },
    { id: 2, user: "علی حسینی", action: "پروفایل خود را بروزرسانی کرد" },
    { id: 3, user: "رضا احمدی", action: "یک محصول جدید اضافه کرد" },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-md">
      <h3 className="font-semibold text-gray-800 mb-6"> رویداد های اخیر</h3>

      <div className="relative space-y-6">
        {/* timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

        {activities.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: 4 }}
            className="flex gap-4 items-start relative"
          >
            {/* avatar */}
            <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-semibold shadow">
              {a.user[0]}
            </div>

            {/* text */}
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{a.user}</span> {a.action}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
