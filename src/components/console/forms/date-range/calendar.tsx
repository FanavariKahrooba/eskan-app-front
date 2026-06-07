"use client"

import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, format, isSameDay, isBefore, isAfter, isWithinInterval } from "date-fns"
import { faIR } from "date-fns/locale/fa-IR"

export function Calendar({ month, start, end, hoverDate, onHover, onSelect, minDate }: any) {
  const today = new Date()
  const base = addMonths(today, month)

  const monthStart = startOfMonth(base)
  const monthEnd = endOfMonth(base)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 6 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 6 })

  let days = []
  let day = startDate

  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const isInRangeHover = (d: Date) => {
    if (start && !end && hoverDate) {
      return isWithinInterval(d, {
        start: start < hoverDate ? start : hoverDate,
        end: start < hoverDate ? hoverDate : start,
      })
    }
    return false
  }

  return (
    <div className="w-[300px]">
      <div className="text-center font-semibold mb-3">{format(base, "MMMM yyyy", { locale: faIR })}</div>

      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2">
        {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const disabled = minDate && isBefore(d, minDate)

          const selected = (start && isSameDay(d, start)) || (end && isSameDay(d, end))

          const inRange =
            start &&
            end &&
            isWithinInterval(d, {
              start: start < end ? start : end,
              end: start < end ? end : start,
            })

          const hoverRange = isInRangeHover(d)

          return (
            <div
              key={i}
              onMouseEnter={() => onHover?.(d)}
              onClick={() => !disabled && onSelect?.(d)}
              className={`
                h-10 flex items-center justify-center text-sm cursor-pointer
                relative
                ${disabled ? "text-gray-300 pointer-events-none" : ""}
                ${selected ? "bg-primary text-white rounded-lg" : ""}
                ${inRange ? "bg-primary/10" : ""}
                ${hoverRange ? "bg-primary/20" : ""}
              `}
            >
              {format(d, "d")}
            </div>
          )
        })}
      </div>
    </div>
  )
}
