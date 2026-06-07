"use client"
import { motion } from "framer-motion"
import { Sparkles, Sun, Moon, Cloud } from "lucide-react"
import { useEffect, useState } from "react"

export default function Hero() {
  const [greeting, setGreeting] = useState("خوش آمدید")
  const [icon, setIcon] = useState(<Sun className="text-yellow-400" />)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("صبح بخیر")
      setIcon(<Sun />)
    } else if (hour < 18) {
      setGreeting("عصر بخیر")
      setIcon(<Cloud />)
    } else {
      setGreeting("شب بخیر")
      setIcon(<Moon className="text-indigo-300" />)
    }
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative p-10 rounded-[2rem] overflow-hidden bg-slate-900 text-white shadow-2xl">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-blue-600/30 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 bg-purple-600/20 blur-[100px] rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium mb-4 backdrop-blur-md"
          >
            {icon}
            <span>{greeting}، مدیریت عزیز</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            مرکز فرماندهی <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">سیستم هوشمند</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">امروز همه‌چیز تحت کنترل شماست. نگاهی به وضعیت سیستم بیندازید و کارهای معوقه را مدیریت کنید.</p>
        </div>

        <div className="flex gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-center min-w-[100px]">
            <div className="text-2xl font-bold">۱۲</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">تیکت باز</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-center min-w-[100px]">
            <div className="text-2xl font-bold text-emerald-400">۹۹.۹٪</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">آپ‌تایم</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
