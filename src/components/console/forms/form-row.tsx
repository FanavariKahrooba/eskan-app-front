// components/forms/form-row.tsx
import { ReactNode } from "react"

export default function FormRow({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  const map = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
  }

  return <div className={`grid gap-5 ${map[cols]}`}>{children}</div>
}
