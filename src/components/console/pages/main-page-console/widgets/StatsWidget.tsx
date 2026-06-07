"use client"

import { DashboardCard } from "../DashboardCard"

const stats = [
  { label: "Storage used", value: "72%", detail: "144 GB of 200 GB" },
  { label: "Files", value: "1,284", detail: "24 added this week" },
  { label: "Shared links", value: "18", detail: "3 active right now" },
]

export function StatsWidget() {
  return (
    <DashboardCard title="Overview">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400 mb-1">{s.label}</p>
            <p className="text-lg font-semibold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.detail}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
