"use client"

import { motion } from "framer-motion"
import QRCode from "qrcode"

import { useEffect, useState } from "react"

export default function QRPreview({ config }: any) {
  const [src, setSrc] = useState("")

  useEffect(() => {
    async function generate() {
      let options = {
        width: config.size,
        margin: config.margin,
        color: {
          dark: config.gradient.enabled ? config.gradient.start : config.color,
        },
      }

      const data = await QRCode.toDataURL("https://preview-link.com", options)

      setSrc(data)
    }

    generate()
  }, [config])

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="p-6 bg-white shadow rounded-xl">
      <img src={src} alt="QR Preview" className="rounded-xl shadow mx-auto" width={config.size} height={config.size} />

      {config.logo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={config.logo} className="w-16 h-16 object-contain rounded" />
        </div>
      )}
    </motion.div>
  )
}
