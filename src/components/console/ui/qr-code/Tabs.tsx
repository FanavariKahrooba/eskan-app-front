"use client"

export default function Tabs({ tabs, active, onChange }: any) {
  return (
    <div className="flex border-b">
      {tabs.map((t: any) => (
        <button key={t.id} onClick={() => onChange(t.id)} className={`px-4 py-2 text-sm ${active === t.id ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}
