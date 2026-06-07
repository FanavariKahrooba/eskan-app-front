"use client"

export default function Slider({ label, value, min, max, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">
        {label}: {value}
      </label>
      <input type="range" className="w-full" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}
