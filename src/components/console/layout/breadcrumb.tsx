"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { findPathLineage } from "@/lib/menu-utils"

interface BreadcrumbItem {
  id: string
  title: string
  path?: string
  icon?: React.ElementType
}

export default function Breadcrumb({ currentPath }: { currentPath: string }) {
  const lineage = findPathLineage(currentPath)

  const items = lineage.length > 4 ? [lineage[0], { id: "ellipsis", title: "…" }, lineage[lineage.length - 2], lineage[lineage.length - 1]] : lineage

  return (
    <div className="w-full border-b border-gray-200 bg-white/60 backdrop-blur">
      <nav className="max-w-[1600px] mx-auto px-4 md:px-6 h-8 flex items-center text-xs text-gray-500 overflow-x-auto scrollbar-none">
        {items.map((item, index) => {
          const Icon = item.icon
          const isLast = index === items.length - 1

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center gap-1.5 shrink-0"
            >
              {index !== 0 && <ChevronRight size={16} className="text-gray-600" />}

              {item.id === "ellipsis" ? (
                <span className="px-1 text-gray-400">…</span>
              ) : item.path && !isLast ? (
                <Link href={item.path} className="flex items-center gap-1 hover:text-gray-800 transition-colors">
                  {Icon && <Icon size={16} />}
                  <span className="truncate max-w-[120px]">{item.title}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-gray-900 font-medium">
                  {Icon && <Icon size={16} />}
                  {item.title}
                </span>
              )}
            </motion.div>
          )
        })}
      </nav>
    </div>
  )
}
