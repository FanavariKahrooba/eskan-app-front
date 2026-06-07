import {
    isBefore,
    isAfter,
    isSameDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    addDays,
    isWithinInterval,
} from "date-fns"

/* ensure start <= end */
export const normalizeRange = (start: Date, end: Date) => {
    return isBefore(start, end)
        ? { start, end }
        : { start: end, end: start }
}

/* Is date disabled? */
export const isDisabled = (d: Date, minDate?: Date) => {
    if (!minDate) return false
    return isBefore(d, minDate)
}

/* Check if date is (start or end) */
export const isSelected = (d: Date, start?: Date | null, end?: Date | null) => {
    return (
        (start && isSameDay(d, start)) ||
        (end && isSameDay(d, end))
    )
}

/* Check if date is inside the selected range */
export const isInRange = (d: Date, start?: Date | null, end?: Date | null) => {
    if (!start || !end) return false

    const { start: s, end: e } = normalizeRange(start, end)

    return isWithinInterval(d, { start: s, end: e })
}

/* Check hover range preview */
export const isHoverRange = (d: Date, start?: Date | null, hover?: Date | null) => {
    if (!start || !hover) return false

    const { start: s, end: e } = normalizeRange(start, hover)
    return isWithinInterval(d, { start: s, end: e })
}

/* Generate all days for a specific month grid */
export const generateMonthDays = (base: Date) => {
    const monthStart = startOfMonth(base)
    const monthEnd = endOfMonth(base)

    const gridStart = startOfWeek(monthStart, { weekStartsOn: 6 })
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 6 })

    let days: Date[] = []
    let d = gridStart

    while (d <= gridEnd) {
        days.push(d)
        d = addDays(d, 1)
    }
    return days
}
