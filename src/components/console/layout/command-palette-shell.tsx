"use client"

import { useEffect, useState } from "react"
import { Command } from "cmdk"

export default function CommandPaletteShell() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center pt-32 z-50">
      <Command className="bg-white rounded-xl shadow-xl w-[520px] border">
        <Command.Input placeholder="Search pages..." className="w-full px-4 py-3 outline-none border-b" />

        <Command.List className="max-h-[320px] overflow-auto">
          <Command.Item className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Dashboard</Command.Item>

          <Command.Item className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Orders</Command.Item>

          <Command.Item className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Analytics</Command.Item>
        </Command.List>
      </Command>
    </div>
  )
}
