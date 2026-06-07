"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PageActions({ actions }: { actions: { label: string; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-1.5 rounded-md hover:bg-gray-100">
        <MoreHorizontal size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="
              absolute left-0 mt-2 w-44
              bg-white border rounded-lg shadow-lg border-gray-300
              overflow-hidden
            "
          >
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  a.onClick()
                  setOpen(false)
                }}
                className="
                  w-full text-right px-3 py-2 text-sm
                  hover:bg-gray-50
                "
              >
                {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
