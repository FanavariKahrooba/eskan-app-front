"use client"

import { motion } from "framer-motion"
import { Cpu, Activity, Gauge } from "lucide-react"

const metrics = [
  { title: "CPU Load", value: "36%", icon: Cpu, color: "blue" },
  { title: "RAM Usage", value: "8.5GB", icon: Activity, color: "purple" },
  { title: "Latency", value: "120ms", icon: Gauge, color: "rose" },
]

export default function PerformanceMetrics() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border p-6 rounded-3xl shadow-sm">
      <h3 className="font-bold text-lg mb-4">عملکرد لحظه‌ای سیستم</h3>

      <div className="space-y-6">
        {metrics.map((m, i) => {
          const Icon = m.icon
          return (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }} className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{m.title}</p>
                <p className="text-xl font-semibold">{m.value}</p>
              </div>

              <div className={`p-3 rounded-xl bg-${m.color}-100 text-${m.color}-600`}>
                <Icon size={20} />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
