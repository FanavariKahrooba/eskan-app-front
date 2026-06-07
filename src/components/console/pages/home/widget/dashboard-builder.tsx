"use client"

import { useState } from "react"
// import GridLayout, { WidthProvider } from "react-grid-layout"

import { Plus } from "lucide-react"

import WidgetCard from "./widget-card"
import WidgetSelectorModal from "./widget-selector-modal"

// const RGL = WidthProvider(GridLayout)

export default function DashboardBuilder() {
  const [widgets, setWidgets] = useState<any[]>([])
  const [layout, setLayout] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  const addWidget = (widget: any) => {
    if (widgets.find((w) => w.id === widget.id)) return

    const newLayout = {
      i: widget.id,
      x: (layout.length * 3) % 12,
      y: Infinity,
      w: 3,
      h: 2,
    }

    setWidgets([...widgets, widget])
    setLayout([...layout, newLayout])
  }

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id))
    setLayout(layout.filter((l) => l.i !== id))
  }

  return (
    <div className="relative p-8">
      {/* <RGL layout={layout} cols={12} rowHeight={110} width={1200} onLayoutChange={(l) => setLayout(l)}> */}
        {widgets.map((w) => (
          <div key={w.id}>
            <WidgetCard widget={w} onRemove={removeWidget} />
          </div>
        ))}
      {/* </RGL> */}

      <button
        onClick={() => setOpen(true)}
        className="
    fixed
    bottom-10
    right-10
    w-14
    h-14
    rounded-full
    bg-black
    text-white
    flex
    items-center
    justify-center
    shadow-xl
    hover:scale-110
    transition
    "
      >
        <Plus size={24} />
      </button>

      <WidgetSelectorModal open={open} onClose={() => setOpen(false)} onAdd={addWidget} activeIds={widgets.map((w) => w.id)} />
    </div>
  )
}
