"use client"

import { Globe, Cloud, GitBranch, Mail, PenTool } from "lucide-react"
import { motion } from "framer-motion"

const portals = [
  { title: "Git", icon: GitBranch, url: "https://git.hooshsevom.ir", color: "bg-blue-500" },
  { title: "Cloud", icon: Cloud, url: "https://cloud.hooshsevom.ir", color: "bg-cyan-500" },
  { title: "Penpot", icon: PenTool, url: "https://penpot.hooshsevom.ir", color: "bg-pink-500" },
  { title: "Mail", icon: Mail, url: "https://mail.hooshsevom.ir", color: "bg-amber-500" },
  { title: "سایت اصلی", icon: Globe, url: "https://hooshsevom.ir", color: "bg-purple-500" },
]

export default function PortalLinks() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-6">درگاه‌های سامانه</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {portals.map((p, i) => (
          <motion.a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            className="group text-center rounded-xl p-4 border border-slate-100 bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer"
          >
            <div className={`w-10 h-10 mx-auto mb-3 rounded-full ${p.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
              <p.icon size={20} />
            </div>
            <div className="text-sm font-medium text-slate-700">{p.title}</div>
            <p className="text-xs text-slate-400 mt-1">باز کردن در تب جدید</p>
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}
