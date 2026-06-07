"use client"

import { useState } from "react"
import WidgetSelectorModal from "./widget-selector-modal"

export default function DashboardBuilder() {
  const [open, setOpen] = useState(false)

  const [selected, setSelected] = useState<string[]>([])

  return (
    <div>
      <button onClick={() => setOpen(true)} className="mb-6 bg-black text-white px-4 py-2 rounded-lg">
        افزودن ویجت
      </button>

      <WidgetSelectorModal open={open} onClose={() => setOpen(false)} selected={selected} setSelected={setSelected} />
    </div>
  )
}
