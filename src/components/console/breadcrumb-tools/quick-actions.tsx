"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function QuickActions({ actions }: { actions: { label: string; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-2 flex flex-col gap-2">
            {actions.map((a, i) => (
              <button key={i} onClick={a.onClick} className="bg-white border shadow-sm text-xs px-3 py-2 rounded-md">
                {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen(!open)} className="w-10 h-10 rounded-full bg-gray-900 text-white text-lg">
        +
      </button>
    </div>
  )
}
