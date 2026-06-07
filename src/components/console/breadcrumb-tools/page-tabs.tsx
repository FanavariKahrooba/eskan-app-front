"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

export default function PageTabs({ tabs }: { tabs: { label: string; href: string }[] }) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-4 relative h-10">
      {tabs.map((tab) => {
        const active = pathname === tab.href

        return (
          <Link key={tab.href} href={tab.href} className={`text-xs font-medium relative pb-2 ${active ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            {tab.label}

            {active && <motion.div layoutId="tabs-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900" />}
          </Link>
        )
      })}
    </div>
  )
}
