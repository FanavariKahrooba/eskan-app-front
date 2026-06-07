"use client"

import { motion } from "framer-motion"
import { Wallet, ShoppingBag, Users, TrendingUp } from "lucide-react"

const stats = [
  { title: "درآمد امروز", value: "۱۲,۴۵۰,۰۰۰ تومان", icon: Wallet, color: "indigo" },
  { title: "سفارشات جدید", value: "۳۴۲", icon: ShoppingBag, color: "purple" },
  { title: "کاربران فعال", value: "۱,۲۵۰", icon: Users, color: "green" },
  { title: "نرخ رشد", value: "%۱۸+", icon: TrendingUp, color: "orange" },
]

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((s, i) => {
        const Icon = s.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="p-6 bg-white border rounded-3xl shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{s.title}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>

              <div className={`p-3 rounded-xl bg-${s.color}-100 text-${s.color}-600`}>
                <Icon size={22} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
