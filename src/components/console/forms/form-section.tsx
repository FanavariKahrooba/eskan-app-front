// components/forms/form-section.tsx
"use client"
import { ReactNode } from "react"
import { motion } from "framer-motion"

interface Props {
  title?: string
  description?: string
  children: ReactNode
}

export default function FormSection({ title, description, children }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="
        space-y-6 rounded-xl border bg-white/70
        backdrop-blur p-6 shadow-sm
        transition-all duration-300 hover:shadow-md
      "
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}

      <div className="space-y-5">{children}</div>
    </motion.section>
  )
}
