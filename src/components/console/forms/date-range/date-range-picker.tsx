"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addMonths, format, isBefore, isAfter, isSameDay } from "date-fns"
import { Calendar } from "./calendar"
import { tv } from "tailwind-variants"
import { cn } from "@/utils/tools"
const triggerStyles = tv({

  base: `
    w-full h-10 rounded-lg border bg-white
    flex items-center justify-between
    px-3 cursor-pointer
    transition-colors text-sm
  `,
  variants: {
    intent: {
      default: "border-input hover:border-primary/40",
      error: "border-red-500",
      success: "border-green-600",
    }
  },
  defaultVariants: {
    intent: "default"
  }
})

export function DateRangePicker({
  label,
  value,
  onChange,
  minDate,
  intent,
  error,
  success,
  presets = true
}: any) {
  const [open, setOpen] = useState(false)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const [start, setStart] = useState<Date | null>(value?.start ?? null)
  const [end, setEnd] = useState<Date | null>(value?.end ?? null)

  const finalIntent = error ? "error" : success ? "success" : intent

  const selectDate = (day: Date) => {
    if (!start || (start && end)) {
      setStart(day)
      setEnd(null)
      onChange?.({ start: day, end: null })
    } else if (start && !end) {
      if (isBefore(day, start)) {
        setEnd(start)
        setStart(day)
        onChange?.({ start: day, end: start })
      } else {
        setEnd(day)
        onChange?.({ start, end: day })
      }
    }
  }

  const displayText = start && end
    ? `${format(start, "yyyy/MM/dd")} - ${format(end, "yyyy/MM/dd")}`
    : "انتخاب بازه تاریخ"

  return (
    <div className="relative">
      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: -22,
            x: 10,
            scale: 0.9,
          }}
          className="absolute left-0 top-0 bg-white text-muted-foreground px-1 mt-0.5 pointer-events-none"
        >
          {label}
        </motion.label>
      )}

      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className={cn(triggerStyles({ intent: finalIntent }), "mt-6")}
      >
        <span className="text-muted-foreground">{displayText}</span>
        <span className="text-xs text-muted-foreground">📅</span>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="
              absolute z-50 mt-2 p-4 bg-white border rounded-lg shadow-xl
              w-[650px] flex gap-4
            "
          >
            {/* Left Calendar */}
            <Calendar
              month={0}
              start={start}
              end={end}
              hoverDate={hoverDate}
              onHover={setHoverDate}
              onSelect={selectDate}
              minDate={minDate}
            />

            {/* Right Calendar */}
            <Calendar
              month={1}
              start={start}
              end={end}
              hoverDate={hoverDate}
              onHover={setHoverDate}
              onSelect={selectDate}
              minDate={minDate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}


{/* <DateRangePicker
  label="بازه زمانی"
  value={range}
  onChange={setRange}
  minDate={new Date(2020, 0, 1)}
/> */}