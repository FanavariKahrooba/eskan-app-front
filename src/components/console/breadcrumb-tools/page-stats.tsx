"use client"

import { motion } from "framer-motion"

interface Stat {
  label: string
  value: string
}

export default function PageStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex flex-col">
          <span className="text-xs text-gray-500">{stat.label}</span>

          <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
        </motion.div>
      ))}
    </div>
  )
}
