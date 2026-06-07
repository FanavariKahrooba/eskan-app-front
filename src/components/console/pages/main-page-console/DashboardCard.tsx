"use client"

import { motion } from "framer-motion"
import React from "react"

interface DashboardCardProps {
  title?: string
  className?: string
  children: React.ReactNode
  headerRight?: React.ReactNode
}

export function DashboardCard({ title, className = "", children, headerRight }: DashboardCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`bg-white/90 border border-slate-100 shadow-[0_10px_40px_rgba(15,23,42,0.08)] 
                  rounded-2xl p-4 sm:p-5 backdrop-blur-sm ${className}`}
    >
      {(title || headerRight) && (
        <div className="flex items-center justify-between mb-3">
          {title && <h3 className="text-sm font-semibold text-slate-800 tracking-tight">{title}</h3>}
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}
