"use client"
import { motion } from "framer-motion"
import { Users, Shield, Zap, BarChart3, Settings, Globe } from "lucide-react"

const modules = [
  { title: "مدیریت کاربران", desc: "دسترسی و نقش‌ها", icon: Users, color: "bg-blue-500" },
  { title: "امنیت سیستم", desc: "مانیتورینگ لاگ‌ها", icon: Shield, color: "bg-red-500" },
  { title: "آمار و ارقام", desc: "گزارشات پیشرفته", icon: BarChart3, color: "bg-emerald-500" },
  { title: "سرویس‌های آنی", desc: "وب‌سرویس و API", icon: Zap, color: "bg-amber-500" },
]

export default function ModuleGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {modules.map((m, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          className="group relative p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden"
        >
          <div className={`w-12 h-12 rounded-2xl ${m.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
            <m.icon size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">{m.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>

          <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <m.icon size={100} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
