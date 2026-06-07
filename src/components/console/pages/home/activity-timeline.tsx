"use client"

import { motion } from "framer-motion"
import { GitBranch, Cloud, Mail, PenTool, Globe, CheckCircle2, AlertCircle } from "lucide-react"

const activities = [
  {
    type: "git",
    icon: GitBranch,
    title: "Merge انجام شد در مخزن 'core'",
    desc: "تغییر در کنترل دسترسی‌ها اعمال شد",
    time: "۵ دقیقه پیش",
    color: "bg-blue-500",
  },
  {
    type: "cloud",
    icon: Cloud,
    title: "دیپلوی جدید انجام شد",
    desc: "نسخه v2.3.5 روی محیط Production فعال شد",
    time: "۱ ساعت پیش",
    color: "bg-emerald-500",
  },
  {
    type: "mail",
    icon: Mail,
    title: "اعلان سیستم ارسال شد",
    desc: "اطلاع‌رسانی به مدیران درباره بروزرسانی امنیتی",
    time: "۲ ساعت پیش",
    color: "bg-violet-500",
  },
  {
    type: "alert",
    icon: AlertCircle,
    title: "هشدار CPU بالا در سرور",
    desc: "CPU مصرفی به ۸۵٪ رسیده است",
    time: "دیروز",
    color: "bg-red-500",
  },
]

export default function ActivityTimeline() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.12 }} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
      <h3 className="text-slate-800 font-bold mb-8">فعالیت‌های اخیر</h3>

      <div className="relative pl-6">
        {/* خط اصلی تایم‌لاین */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200"></div>

        <div className="space-y-8">
          {activities.map((act, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="relative flex gap-4 items-start">
              {/* نقطه تایم‌لاین */}
              <div className={`absolute left-0 w-6 h-6 rounded-full ${act.color} flex items-center justify-center text-white shadow-lg`}>
                <act.icon size={14} />
              </div>

              {/* محتوا */}
              <div className="ml-8">
                <h4 className="font-medium text-slate-800 flex items-center gap-2">{act.title}</h4>
                <p className="text-sm text-slate-500 mt-1 mb-2">{act.desc}</p>
                <span className="text-xs text-slate-400">{act.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
