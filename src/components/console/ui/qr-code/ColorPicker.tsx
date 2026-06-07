"use client"

export default function ColorPicker({ value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">Color</label>
      <input type="color" value={value} className="w-full h-12 rounded" onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
