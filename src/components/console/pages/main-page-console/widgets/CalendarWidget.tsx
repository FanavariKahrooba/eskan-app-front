"use client"

import { DashboardCard } from "../DashboardCard"
import dynamic from "next/dynamic"
import { useState } from "react"

// dynamic import چون روی سرور خطا می‌دهد
const DatePicker = dynamic(() => import("react-multi-date-picker"), {
  ssr: false,
})

export function CalendarWidget() {
  const [value, setValue] = useState<any>(new Date())

  return (
    <DashboardCard title="Calendar" className="flex flex-col" headerRight={<span className="text-xs text-slate-400">React Multi Date Picker</span>}>
      <div className="text-xs text-slate-500 mb-3">Select a date to see your events.</div>
      <div className="[&_.rmdp-calendar]:w-full [&_.rmdp-calendar]:border-0 [&_.rmdp-calendar]:shadow-none [&_.rmdp-wrapper]:w-full">
        <DatePicker value={value} onChange={setValue} className="!w-full !border !border-slate-200 !rounded-xl !shadow-none" calendarPosition="bottom-right" highlightToday />
      </div>
    </DashboardCard>
  )
}
