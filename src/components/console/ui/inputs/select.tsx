"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Select({ options = [], value, onChange, placeholder }: any) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)} className="h-10 px-3 border rounded-lg flex items-center justify-between cursor-pointer bg-white">
        <span className="text-sm text-muted-foreground">{value ? options.find((o: any) => o.value === value)?.label : placeholder}</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="
              absolute left-0 right-0 mt-2 rounded-lg border bg-white shadow-md p-1 z-10
            "
          >
            {options.map((opt: any) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className="
                  text-sm px-3 py-2 rounded-md cursor-pointer
                  hover:bg-primary/10
                "
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
