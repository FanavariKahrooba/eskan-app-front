"use client"

// import { ALL_WIDGETS } from "@/lib/menu-widgets"

export default function WidgetSelector({ selected, setSelected }: any) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x: any) => x !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  return (
    <div className="bg-white border rounded-xl p-4">
      <h3 className="font-bold mb-4">انتخاب ویجت‌ها</h3>

      <div className="grid grid-cols-2 gap-2">
        {/* {ALL_WIDGETS.map((w) => {
          const Icon = w.icon

          return (
            <button
              key={w.id}
              onClick={() => toggle(w.id)}
              className={`p-3 border rounded-lg flex gap-2 items-center text-sm
              ${selected?.includes(w.id) ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50"}`}
            >
              <Icon size={16} />

              {w.title}
            </button>
          )
        })} */}
      </div>
    </div>
  )
}
