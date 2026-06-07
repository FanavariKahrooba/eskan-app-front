// useAsyncOptions.ts
//-------------------------------------------
//  Debounced, Cached, Abort-Safe Async Fetch Engine
//-------------------------------------------

"use client"

import { useRef, useEffect, useState, useCallback } from "react"

export interface UseAsyncOptionsConfig<T> {
    fetcher: (query: string) => Promise<T[]>
    debounce?: number
    enabled?: boolean
    cache?: boolean
}

interface AsyncState<T> {
    loading: boolean
    error: string | null
    data: T[]
    query: string
}

const globalCache = new Map<string, any>()

export function useAsyncOptions<T = any>({
    fetcher,
    debounce = 300,
    enabled = true,
    cache = true
}: UseAsyncOptionsConfig<T>) {
    const [state, setState] = useState<AsyncState<T>>({
        loading: false,
        error: null,
        data: [],
        query: ""
    })

    const debounceTimer = useRef<any>(null)
    const abortRef = useRef<AbortController | null>(null)

    const runFetch = useCallback(
        async (query: string) => {
            if (!enabled) return

            setState((s) => ({ ...s, loading: true, error: null }))

            // cache
            if (cache && globalCache.has(query)) {
                const cached = globalCache.get(query)
                setState((s) => ({ ...s, data: cached, loading: false }))
                return
            }

            // cancel previous request
            if (abortRef.current) abortRef.current.abort()
            const controller = new AbortController()
            abortRef.current = controller

            try {
                const result = await fetcher(query)
                if (cache) globalCache.set(query, result)

                setState((s) => ({ ...s, data: result, loading: false }))
            } catch (err: any) {
                if (err.name === "AbortError") return
                setState((s) => ({
                    ...s,
                    error: err?.message || "Error fetching data",
                    loading: false
                }))
            }
        },
        [fetcher, enabled, cache]
    )

    const setQuery = useCallback(
        (q: string) => {
            setState((s) => ({ ...s, query: q }))

            clearTimeout(debounceTimer.current)
            debounceTimer.current = setTimeout(() => {
                runFetch(q)
            }, debounce)
        },
        [runFetch, debounce]
    )

    return {
        ...state,
        setQuery
    }
}
