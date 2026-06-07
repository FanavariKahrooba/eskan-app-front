"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", sales: 400 },
  { name: "Tue", sales: 700 },
  { name: "Wed", sales: 500 },
  { name: "Thu", sales: 900 },
  { name: "Fri", sales: 750 },
]

export default function SalesChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="
        bg-white/80 backdrop-blur-xl
        border border-gray-200
        rounded-2xl p-6
        shadow-md
        h-[320px]
        transition-all
      "
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>

        <span className="text-xs text-gray-400">Weekly</span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />

          <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />

          <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            }}
          />

          <Line type="monotone" dataKey="sales" stroke="url(#salesGradient)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
