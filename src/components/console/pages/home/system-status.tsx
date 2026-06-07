"use client"
import { motion } from "framer-motion"

export default function SystemStatus() {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800">وضعیت زیرساخت</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-600">عملیاتی</span>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: "پایگاه داده", val: 85, color: "bg-blue-500" },
          { label: "حافظه سرور", val: 42, color: "bg-purple-500" },
          { label: "پهنای باند", val: 12, color: "bg-emerald-500" },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
              <span>{item.label}</span>
              <span>{item.val}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} className={`h-full ${item.color}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
