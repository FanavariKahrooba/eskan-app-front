"use client"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function Tooltip({ text, children, expanded }: any) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  // اگر سایدبار باز است، نیازی به تولتیپ نیست
  if (expanded) return <>{children}</>

  const handleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setCoords({ x: rect.right + 10, y: rect.top + rect.height / 2 })
      setOpen(true)
    }
  }

  return (
    <>
      <div ref={ref} onMouseEnter={handleOpen} onMouseLeave={() => setOpen(false)} className="w-full">
        {children}
      </div>
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ position: "fixed", top: coords.y, left: coords.x, transform: "translateY(-50%)" }}
            className="z-[9999] px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl pointer-events-none whitespace-nowrap"
          >
            {text}
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-gray-900" />
          </motion.div>,
          document.body,
        )}
    </>
  )
}
