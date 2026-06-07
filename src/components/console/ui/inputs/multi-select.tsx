"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { tv } from "tailwind-variants"
import { cn } from "@/utils/tools"

const boxStyles = tv({
  base: `
    w-full rounded-lg border bg-white text-sm
    transition-all outline-none duration-200
    focus-within:ring-2 disabled:opacity-60 disabled:cursor-not-allowed
    min-h-[42px] flex items-center flex-wrap gap-1 px-2
    cursor-text
  `,
  variants: {
    intent: {
      default: "border-input focus-within:border-primary/40 focus-within:ring-primary/30",
      error: "border-red-500 focus-within:ring-red-500/30",
      success: "border-green-600 focus-within:ring-green-500/30",
    },
    size: {
      sm: "min-h-[36px] py-1 text-sm",
      md: "min-h-[42px] py-1.5",
      lg: "min-h-[50px] py-2 text-base",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "md",
  },
})

// انیمیشن تگ
const tagAnim = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}

export function MultiSelect({ label, value = [], onChange, options = [], placeholder = "جستجو...", size, intent, error, success, disabled }: any) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [highlightIndex, setHighlightIndex] = useState(0)

  const containerRef: any = useRef(null)
  const inputRef: any = useRef(null)

  const finalIntent = error ? "error" : success ? "success" : intent

  const selectedValues = value.map((v: any) => v.value)

  // فیلتر
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

  const toggleItem = (item: any) => {
    if (selectedValues.includes(item.value)) {
      onChange(value.filter((v: any) => v.value !== item.value))
    } else {
      onChange([...value, item])
    }
    setSearch("")
    setOpen(true)
  }

  const removeItem = (val: string) => {
    onChange(value.filter((v: any) => v.value !== val))
  }

  const handleKey = (e: any) => {
    if (!open) return

    if (e.key === "ArrowDown") {
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1))
    }
    if (e.key === "ArrowUp") {
      setHighlightIndex((i) => Math.max(i - 1, 0))
    }
    if (e.key === "Enter") {
      toggleItem(filtered[highlightIndex])
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Floating label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: value.length > 0 || search ? -22 : 10,
            x: 12,
            scale: value.length > 0 || search ? 0.82 : 1,
          }}
          transition={{ duration: 0.22 }}
          className="absolute left-0 bg-white text-muted-foreground px-1 pointer-events-none"
        >
          {label}
        </motion.label>
      )}

      {/* Input box */}
      <div
        className={cn(boxStyles({ size, intent: finalIntent }))}
        onClick={() => {
          setOpen(true)
          inputRef.current?.focus()
        }}
      >
        <AnimatePresence>
          {value.map((item: any) => (
            <motion.div
              key={item.value}
              {...tagAnim}
              className="
                flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 
                rounded-md text-xs cursor-default
              "
            >
              {item.icon && <div>{item.icon}</div>}
              {item.label}
              <button className="text-primary hover:text-red-500 ml-1" onClick={() => removeItem(item.value)}>
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          value={search}
          disabled={disabled}
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && search === "" && value.length > 0) {
              removeItem(value[value.length - 1].value)
            }
            handleKey(e)
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none min-w-[60px]"
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="
              absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg 
              max-h-60 overflow-auto text-sm
            "
          >
            {filtered.map((opt: any, i: number) => {
              const isSelected = selectedValues.includes(opt.value)
              const isHighlighted = i === highlightIndex

              return (
                <div
                  key={opt.value}
                  onClick={() => toggleItem(opt)}
                  className={cn(
                    "px-3 py-2 cursor-pointer flex items-center gap-2",
                    isHighlighted && "bg-muted/50",
                    !isHighlighted && "hover:bg-mute40",
                    isSelected && "bg-primary/10",
                  )}
                >
                  {opt.icon && <div>{opt.icon}</div>}
                  <div>{opt.label}</div>
                  {opt.description && <div className="text-xs text-muted-foreground">{opt.description}</div>}
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
          {error}
        </motion.p>
      )}
    </div>
  )
}

// <MultiSelect
//   label="اعضای پروژه"
//   value={members}
//   onChange={setMembers}
//   options={[
//     { value: "1", label: "علی", icon: <Avatar src="/1.png" /> },
//     { value: "2", label: "سارا" },
//     { value: "3", label: "رضا" },
//     { value: "4", label: "نگین", description: "طراح" }
//   ]}
// />

{
  /* <MultiSelect
  label="دسته‌بندی‌ها"
  value={cats}
  onChange={setCats}
  options={[
    { value: "design", label: "طراحی" },
    { value: "frontend", label: "فرانت" },
    { value: "backend", label: "بک‌اند" },
    { value: "marketing", label: "مارکتینگ" }
  ]}
/> */
}
