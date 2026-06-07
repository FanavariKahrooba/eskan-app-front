// بهتر: VirtualizedFieldRenderer.tsx

"use client"

import { AutoFieldRenderer } from "./AutoFieldRenderer"


export function VirtualizedFieldRenderer({ schema, index }: any) {
  const field = schema[index]
  return <AutoFieldRenderer field={field} />
}
