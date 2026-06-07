// FormDevToolsContext.ts
//-------------------------------------------
//  Context + Store برای DevTools Engine
//-------------------------------------------

"use client"

import { createContext, useContext } from "react"

export interface DevLog {
    timestamp: number
    type: string
    payload: any
}

interface DevToolsState {
    logs: DevLog[]
    renderCount: Record<string, number>
    isOpen: boolean
    toggle: () => void
    addLog: (log: DevLog) => void
    incrementRender: (name: string) => void
}

export const FormDevToolsContext = createContext<DevToolsState | null>(null)

export function useDevTools() {
    const ctx = useContext(FormDevToolsContext)
    if (!ctx)
        throw new Error("DevTools must be used inside <FormDevToolsProvider />")
    return ctx
}
