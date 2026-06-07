"use client"

import { motion } from "framer-motion"
import { GitBranch, Cloud, PenTool, Mail, Globe } from "lucide-react"

const portals = [
  {
    title: "Git",
    desc: "Repository & Version Control",
    url: "https://git.hooshsevom.ir",
    icon: GitBranch,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Cloud",
    desc: "Infrastructure Management",
    url: "https://cloud.hooshsevom.ir",
    icon: Cloud,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Penpot",
    desc: "Design Collaboration",
    url: "https://penpot.hooshsevom.ir",
    icon: PenTool,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Mail",
    desc: "Organization Email",
    url: "https://mail.hooshsevom.ir",
    icon: Mail,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Website",
    desc: "Main Platform",
    url: "https://hooshsevom.ir",
    icon: Globe,
    color: "from-purple-500 to-indigo-600",
  },
]

export default function PortalHub() {
  return (
    <div className="relative">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Service Portals</h3>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        {portals.map((portal, i) => (
          <motion.a
            key={i}
            href={portal.url}
            target="_blank"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="group relative rounded-2xl p-[1px] overflow-hidden"
          >
            {/* gradient border */}
            <div className={`absolute inset-0 bg-gradient-to-r ${portal.color} opacity-0 group-hover:opacity-100 transition duration-300 blur`} />

            <div className="relative bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 h-full flex flex-col items-center text-center shadow-sm group-hover:shadow-2xl transition">
              {/* status */}
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>

              {/* icon */}
              <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r ${portal.color} text-white shadow-lg group-hover:scale-110 transition`}>
                <portal.icon size={24} />
              </div>

              <h4 className="font-semibold text-slate-800">{portal.title}</h4>

              <p className="text-xs text-slate-500 mt-1">{portal.desc}</p>

              <div className="text-[11px] text-slate-400 mt-3 opacity-0 group-hover:opacity-100 transition">Open Portal →</div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
