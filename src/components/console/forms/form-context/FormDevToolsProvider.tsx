// FormDevToolsProvider.tsx
//-------------------------------------------
//  Provider برای مدیریت DevTools
//-------------------------------------------

"use client"

import React, { useState, useCallback, useMemo } from "react"
import { FormDevToolsContext, DevLog } from "./FormDevToolsContext"

export function FormDevToolsProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<DevLog[]>([])
  const [renderCount, setRenderCount] = useState<Record<string, number>>({})
  const [isOpen, setOpen] = useState(false)

  const addLog = useCallback((log: DevLog) => {
    setLogs((prev) => [...prev, log])
  }, [])

  const incrementRender = useCallback((name: string) => {
    setRenderCount((prev) => ({
      ...prev,
      [name]: (prev[name] || 0) + 1,
    }))
  }, [])

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const value = useMemo(
    () => ({
      logs,
      renderCount,
      isOpen,
      addLog,
      incrementRender,
      toggle,
    }),
    [logs, renderCount, isOpen],
  )

  return <FormDevToolsContext.Provider value={value}>{children}</FormDevToolsContext.Provider>
}
