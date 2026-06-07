"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export function FileUpload({ onChange }: any) {
  const [drag, setDrag] = useState(false)

  return (
    <motion.div
      animate={{ scale: drag ? 1.02 : 1 }}
      className="
        border-2 border-dashed rounded-xl p-6
        flex flex-col items-center justify-center gap-2
        cursor-pointer bg-white transition
      "
      onDragEnter={() => setDrag(true)}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        onChange(e.dataTransfer.files[0])
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <p className="text-sm text-muted-foreground">Drag & Drop files here</p>

      <input type="file" className="hidden" onChange={(e) => onChange(e.target.files?.[0])} />
    </motion.div>
  )
}
