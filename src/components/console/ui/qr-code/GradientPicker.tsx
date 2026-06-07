"use client"

export default function GradientPicker({ config, onChange }: any) {
  return (
    <div className="space-y-4">
      <label className="text-sm text-gray-600">Enable Gradient</label>
      <input type="checkbox" checked={config.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} />

      {config.enabled && (
        <>
          <div className="space-y-2">
            <label>Start</label>
            <input type="color" value={config.start} onChange={(e) => onChange({ start: e.target.value })} className="w-full h-10" />
          </div>

          <div className="space-y-2">
            <label>End</label>
            <input type="color" value={config.end} onChange={(e) => onChange({ end: e.target.value })} className="w-full h-10" />
          </div>

          <select className="border p-2 rounded w-full" value={config.direction} onChange={(e) => onChange({ direction: e.target.value })}>
            <option value="to-br">Bottom Right</option>
            <option value="to-tr">Top Right</option>
            <option value="to-bl">Bottom Left</option>
            <option value="to-tl">Top Left</option>
          </select>
        </>
      )}
    </div>
  )
}
