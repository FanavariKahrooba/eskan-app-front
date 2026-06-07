"use client"

import { useState } from "react"
import InputMask from "react-input-mask"
import { motion } from "framer-motion"
import { tv } from "tailwind-variants"
import { cn } from "@/utils/tools"


const inputStyles = tv({
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

export function MaskedInput({ label, mask, icon, rightIcon, value, onChange, error, success, size, intent, disabled, className, ...props }: any) {
  const [focused, setFocused] = useState(false)

  const finalIntent = error ? "error" : success ? "success" : intent

  return (
    <div className="relative w-full">
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

      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-muted-foreground">{icon}</div>}

        <InputMask mask={mask} value={value} disabled={disabled} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          {(inputProps: any) => <input {...inputProps} className={cn(inputStyles({ intent: finalIntent, size }), icon ? "pl-10" : "", rightIcon ? "pr-10" : "", className)} />}
        </InputMask>

        {rightIcon && <div className="absolute right-3 text-muted-foreground">{rightIcon}</div>}
      </div>

      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-600 mt-1">
          {success}
        </motion.p>
      )}
    </div>
  )
}
