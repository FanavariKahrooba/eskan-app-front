"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/locales/persian_fa"
import persianCalendar from "react-date-object/calendars/persian"
import { tv } from "tailwind-variants"
import { cn } from "@/utils/tools"


const dpStyles = tv({
  base: `
    w-full rounded-lg border bg-white text-sm h-10 px-3
    flex items-center cursor-pointer
    transition-all duration-200 outline-none
    focus:ring-2 focus:ring-primary/30
  `,
  variants: {
    intent: {
      default: "border-input",
      error: "border-red-500 focus:ring-red-500/30",
      success: "border-green-500 focus:ring-green-500/30",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
  },
})

export function DatePickerInput({ label, value, onChange, range = false, multiple = false, time = false, locale = "fa", error, success, className, disabled }: any) {
  const [focused, setFocused] = useState(false)
  const [internal, setInternal] = useState(value)

  useEffect(() => setInternal(value), [value])

  const intent = error ? "error" : success ? "success" : "default"

  return (
    <div className="relative w-full">
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: focused || internal ? -22 : 10,
            x: 12,
            scale: focused || internal ? 0.82 : 1,
            opacity: 1,
          }}
          transition={{ duration: 0.22 }}
          className="absolute left-0 text-muted-foreground bg-white px-1 pointer-events-none"
        >
          {label}
        </motion.label>
      )}

      <DatePicker
        value={internal}
        onChange={(v) => {
          setInternal(v)
          onChange?.(v)
        }}
        range={range}
        multiple={multiple}
        disableDayPicker={false}
        calendar={locale === "fa" ? persianCalendar : undefined}
        locale={locale === "fa" ? persian : undefined}
        format="YYYY/MM/DD"
        calendarPosition="bottom-center"
        inputClass={cn(dpStyles({ intent, disabled }), className)}
        containerClassName="w-full"
        onOpen={() => setFocused(true)}
        onClose={() => setFocused(false)}
        disabled={disabled}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
        }}
      />

      {error && (
        <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-600 mt-1">
          {success}
        </motion.p>
      )}
    </div>
  )
}
