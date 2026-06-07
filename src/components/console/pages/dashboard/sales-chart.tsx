"use client"

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { motion } from "framer-motion"

const data = [
  { name: "شنبه", sales: 4000 },
  { name: "یکشنبه", sales: 3000 },
  { name: "دوشنبه", sales: 5000 },
  { name: "سه‌شنبه", sales: 2780 },
  { name: "چهارشنبه", sales: 1890 },
  { name: "پنجشنبه", sales: 6390 },
  { name: "جمعه", sales: 3490 },
]

export default function SalesChart() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border shadow-sm">
      <h3 className="font-bold text-xl mb-6">نمودار فروش هفتگی</h3>
      <div className="h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />

            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "none",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
              }}
            />

            <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
