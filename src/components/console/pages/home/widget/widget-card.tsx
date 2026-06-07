"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import Link from "next/link"

export default function WidgetCard({ widget, onRemove }: any) {
  const Icon = widget.icon

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      className="
   group
   bg-white/80
   backdrop-blur
   border border-gray-200
   rounded-2xl
   p-5
   h-full
   shadow
   hover:shadow-xl
   transition
   relative
   "
    >
      <button
        onClick={() => onRemove(widget.id)}
        className="
    absolute
    top-3
    right-3
    opacity-0
    group-hover:opacity-100
    transition
    p-1
    rounded-md
    hover:bg-red-100
    text-red-500
    "
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="
    w-10 h-10
    rounded-xl
    bg-blue-100
    flex items-center justify-center
    text-blue-600
    "
        >
          <Icon size={18} />
        </div>

        <span className="font-medium">{widget.title}</span>
      </div>

      <Link
        href={widget.path}
        className="
    text-sm
    text-blue-600
    hover:underline
    "
      >
        باز کردن صفحه
      </Link>
    </motion.div>
  )
}
