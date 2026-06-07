"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SpotlightSearch() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl w-[600px] shadow-2xl p-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Search size={18} />
              <input placeholder="جستجو..." className="w-full outline-none" />
            </div>

            <div className="text-sm text-gray-500 p-3">نتایج جستجو اینجا نمایش داده می‌شود</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
