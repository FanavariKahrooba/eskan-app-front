"use client"

import { Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function RecentActivity() {
  const logs = [
    { text: "کاربر جدید ایجاد شد", time: "۵ دقیقه پیش" },
    { text: "گزارش ماهانه تولید شد", time: "۳۰ دقیقه پیش" },
    { text: "تنظیمات سیستم بروزرسانی شد", time: "۲ ساعت پیش" },
  ]

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Activity size={18} />
        <h3 className="font-bold text-gray-800">فعالیت‌های اخیر</h3>
      </div>

      <div className="space-y-3">
        {logs.map((l, i) => (
          <motion.div key={i} whileHover={{ x: 4 }} className="flex justify-between items-center p-3 rounded-lg border bg-gray-50 hover:bg-white hover:shadow-sm transition">
            <span className="text-sm text-gray-700">{l.text}</span>
            <span className="text-xs text-gray-400">{l.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
