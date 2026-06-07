// src/features/data-grid/core/engine/apply-sorting.ts

import type { ColumnDef, SortState } from '../types'
import { getCellValue } from '../utils/get-cell-value'

function compareValues(a: unknown, b: unknown) {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime()
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export function applySorting<TData>(
  rows: TData[],
  columns: ColumnDef<TData>[],
  sorting?: SortState[]
): TData[] {
  if (!sorting?.length) return rows

  const sortableMap = new Map(columns.map((column) => [column.id, column]))

  const cloned = [...rows]

  cloned.sort((rowA, rowB) => {
    for (const sort of sorting) {
      const column = sortableMap.get(sort.field)
      if (!column) continue

      const valueA = getCellValue(rowA, column)
      const valueB = getCellValue(rowB, column)

      const comparison = compareValues(valueA, valueB)

      if (comparison !== 0) {
        return sort.direction === 'asc' ? comparison : -comparison
      }
    }

    return 0
  })

  return cloned
}
