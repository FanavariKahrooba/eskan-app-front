"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { tv } from "tailwind-variants"
import { cn } from "@/utils/tools"
// ------------------- Styles -------------------

const triggerStyles = tv({
  base: `
    w-full h-10 rounded-lg border flex items-center justify-between
    px-3 cursor-pointer transition-colors
    bg-white
  `,
  variants: {
    intent: {
      default: "border-input hover:border-primary/50",
      error: "border-red-500",
      success: "border-green-600",
    },
  },
  defaultVariants: {
    intent: "default",
  },
})

const svPanelSize = 180

// ------------------- Helpers -------------------

function hsvToHex(h: number, s: number, v: number) {
  // استاندارد تبدیل HSV به HEX
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    const val = v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
    return Math.round(val * 255)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(5)}${f(3)}${f(1)}`
}

export function ColorPicker({ label, value, onChange, error, success, intent, presets = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff"] }: any) {
  const [open, setOpen] = useState(false)

  // HSV state
  const [hue, setHue] = useState(0)
  const [sat, setSat] = useState(1)
  const [val, setVal] = useState(1)

  const panelRef: any = useRef(null)

  const finalIntent = error ? "error" : success ? "success" : intent

  const hex = hsvToHex(hue, sat, val)

  const setFromMouse = (e: any) => {
    if (!panelRef.current) return

    const rect = panelRef.current.getBoundingClientRect()
    let x = Math.min(Math.max(0, e.clientX - rect.left), svPanelSize)
    let y = Math.min(Math.max(0, e.clientY - rect.top), svPanelSize)

    const s = x / svPanelSize
    const v = 1 - y / svPanelSize

    setSat(s)
    setVal(v)
    onChange?.(hsvToHex(hue, s, v))
  }

  const beginDrag = (e: any) => {
    e.preventDefault()
    const move = (ev: MouseEvent) => setFromMouse(ev)
    const stop = () => {
      document.removeEventListener("mousemove", move)
      document.removeEventListener("mouseup", stop)
    }
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", stop)
  }

  const applyPreset = (hex: string) => {
    onChange(hex)
  }

  const pickWithEyedropper = async () => {
    if (!("EyeDropper" in window)) return alert("مرورگر از Eyedropper پشتیبانی نمی‌کند")
    const eye = new (window as any).EyeDropper()
    const result = await eye.open()
    onChange(result.sRGBHex)
  }

  return (
    <div className="relative">
      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: -20,
            x: 10,
            scale: 0.9,
          }}
          className="absolute left-0 bg-white text-muted-foreground px-1 pointer-events-none"
        >
          {label}
        </motion.label>
      )}

      {/* Trigger */}
      <div onClick={() => setOpen(!open)} className={cn(triggerStyles({ intent: finalIntent }), "mt-6")}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md border shadow-sm" style={{ backgroundColor: value || hex }} />
          <span className="text-sm text-muted-foreground">{value || hex}</span>
        </div>
        <span className="text-xs text-muted-foreground">انتخاب رنگ</span>
      </div>

      {/* Popover */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="
            absolute z-50 mt-2 bg-white border rounded-lg shadow-xl
            p-4 w-[260px]
          "
        >
          {/* Saturation / Value Panel */}
          <div
            ref={panelRef}
            onMouseDown={beginDrag}
            className="relative rounded-lg overflow-hidden cursor-crosshair"
            style={{
              width: svPanelSize,
              height: svPanelSize,
              background: `hsl(${hue} 100% 50%)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

            {/* Cursor */}
            <motion.div
              className="absolute w-4 h-4 rounded-full border border-white shadow"
              style={{
                left: sat * svPanelSize - 8,
                top: (1 - val) * svPanelSize - 8,
              }}
            />
          </div>

          {/* Hue Slider */}
          <div className="relative mt-3 h-3 rounded-md overflow-hidden cursor-pointer">
            <div
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const pct = (e.clientX - rect.left) / rect.width
                const h = Math.min(359, Math.max(0, pct * 360))
                setHue(h)
                onChange?.(hsvToHex(h, sat, val))
              }}
              className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500"
            />
            <motion.div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border rounded-full shadow" style={{ left: `${(hue / 360) * 100}%` }} />
          </div>

          {/* HEX Input */}
          <div className="mt-4 flex items-center gap-2">
            <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-md px-2 py-1 text-sm" />
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2 mt-4">
            {presets.map((p: string) => (
              <button key={p} onClick={() => applyPreset(p)} className="w-6 h-6 rounded-md border shadow-sm" style={{ backgroundColor: p }} />
            ))}
          </div>

          {/* Eyedropper */}
          <button
            onClick={pickWithEyedropper}
            className="
              mt-4 w-full text-sm py-1 border rounded-md hover:bg-muted 
            "
          >
            انتخاب از صفحه (Eyedropper)
          </button>
        </motion.div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
