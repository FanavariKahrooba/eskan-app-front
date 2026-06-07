"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { tv } from "tailwind-variants"
import { cn } from "@/utils/tools"

const trackStyles = tv({
  base: `
    relative w-full h-2 rounded-full bg-muted/40
  `,
  variants: {
    size: {
      sm: "h-1.5",
      md: "h-2",
      lg: "h-2.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const thumbStyles = tv({
  base: `
    absolute top-1/2 -translate-y-1/2 z-10
    w-5 h-5 rounded-full 
    bg-white border shadow-sm
    flex items-center justify-center
    cursor-pointer
    transition-colors
  `,
  variants: {
    intent: {
      default: "border-input hover:border-primary",
      error: "border-red-500 hover:border-red-600",
      success: "border-green-500 hover:border-green-600",
    },
    size: {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "md",
  },
})

export function RangeSlider({ label, min = 0, max = 100, step = 1, value = [20, 80], onChange, size, intent, error, success }: any) {
  const [minVal, setMinVal] = useState(value[0])
  const [maxVal, setMaxVal] = useState(value[1])

  const trackRef = useRef(null)

  const finalIntent = error ? "error" : success ? "success" : intent

  const percent = (val: number) => ((val - min) / (max - min)) * 100

  const updateValue = (type: "min" | "max", val: number) => {
    let newMin = minVal
    let newMax = maxVal

    if (type === "min") newMin = Math.min(val, maxVal - step)
    else newMax = Math.max(val, minVal + step)

    setMinVal(newMin)
    setMaxVal(newMax)

    onChange?.([newMin, newMax])
  }

  const handleMove = (type: "min" | "max", e: PointerEvent) => {
    const track: any = trackRef.current
    if (!track) return

    const rect = track.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = Math.max(0, Math.min(1, x / rect.width))
    const raw = min + pct * (max - min)

    const snapped = Math.round(raw / step) * step
    updateValue(type, snapped)
  }

  const startDrag = (type: "min" | "max") => (e: any) => {
    e.preventDefault()

    const move = (ev: PointerEvent) => handleMove(type, ev)
    const stop = () => {
      document.removeEventListener("pointermove", move)
      document.removeEventListener("pointerup", stop)
    }

    document.addEventListener("pointermove", move)
    document.addEventListener("pointerup", stop)
  }

  return (
    <div className="w-full relative">
      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: -20,
            x: 5,
            scale: 0.9,
          }}
          className="absolute left-0 text-muted-foreground bg-white px-1 pointer-events-none"
        >
          {label}
        </motion.label>
      )}

      <div className="pt-6 pb-2">
        <div className={trackStyles({ size })} ref={trackRef}>
          {/* Active track */}
          <motion.div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${percent(minVal)}%`,
              width: `${percent(maxVal) - percent(minVal)}%`,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Min thumb */}
          <motion.div
            className={thumbStyles({ size, intent: finalIntent })}
            style={{ left: `${percent(minVal)}%` }}
            onPointerDown={startDrag("min")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          />

          {/* Max thumb */}
          <motion.div
            className={thumbStyles({ size, intent: finalIntent })}
            style={{ left: `${percent(maxVal)}%` }}
            onPointerDown={startDrag("max")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          />
        </div>
      </div>

      {/* values */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{minVal}</span>
        <span>{maxVal}</span>
      </div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 mt-1">
          {error}
        </motion.p>
      )}
    </div>
  )
}
