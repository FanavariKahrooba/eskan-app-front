"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { tv } from "tailwind-variants"
import { cn } from "@/utils/tools"

const boxStyles = tv({
  base: `
    w-full rounded-lg border bg-white text-sm 
    transition-all outline-none duration-200
    focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed
  `,
  variants: {
    intent: {
      default: "border-input focus:border-primary/40 focus:ring-primary/30",
      error: "border-red-500 focus:ring-red-500/30",
      success: "border-green-600 focus:ring-green-500/30",
    },
    size: {
      sm: "h-9 px-3",
      md: "h-10 px-3",
      lg: "h-12 px-4 text-base",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "md",
  },
})

export function ComboBox({ label, value, onChange, options = [], size, intent, error, success, placeholder = "جستجو...", disabled, className }: any) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [focused, setFocused] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)

  const containerRef: any = useRef(null)

  const finalIntent = error ? "error" : success ? "success" : intent

  // فیلتر گزینه‌ها
  const filtered = options.filter((opt: any) => opt.label.toLowerCase().includes(search.toLowerCase()))

  // بستن با کلیک بیرون
  useEffect(() => {
    const handler = (e: any) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleKey = (e: any) => {
    if (!open) return

    if (e.key === "ArrowDown") {
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1))
    }
    if (e.key === "ArrowUp") {
      setHighlightIndex((i) => Math.max(i - 1, 0))
    }
    if (e.key === "Enter") {
      const item = filtered[highlightIndex]
      if (item) {
        onChange(item)
        setOpen(false)
        setSearch("")
      }
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: focused || value ? -22 : 10,
            x: 12,
            scale: focused || value ? 0.82 : 1,
          }}
          transition={{ duration: 0.22 }}
          className="absolute left-0 text-muted-foreground bg-white px-1 pointer-events-none"
        >
          {label}
        </motion.label>
      )}

      <div className={cn(boxStyles({ size, intent: finalIntent }), "flex items-center cursor-pointer", className)} onClick={() => setOpen(!open)}>
        <input
          type="text"
          disabled={disabled}
          placeholder={value ? value.label : placeholder}
          className="w-full bg-transparent outline-none text-sm"
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
          value={search}
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="
              absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg
              max-h-60 overflow-auto
            "
          >
            {filtered.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">چیزی پیدا نشد</div>}

            {filtered.map((opt: any, i: number) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                  setSearch("")
                }}
                className={cn("px-3 py-2 cursor-pointer flex items-center gap-2", "hover:bg-muted/40", i === highlightIndex && "bg-muted/50")}
              >
                {opt.icon && <div className="shrink-0">{opt.icon}</div>}

                <div className="flex flex-col">
                  <span>{opt.label}</span>
                  {opt.description && <span className="text-xs text-muted-foreground">{opt.description}</span>}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* خطا */}
      {error && (
        <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
          {error}
        </motion.p>
      )}
    </div>
  )
}
