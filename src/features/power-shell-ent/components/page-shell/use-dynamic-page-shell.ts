'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PageShellModuleConfig } from './page-shell-types'
import { getDefaultPageShellLayout } from './page-shell-layouts'
import { filterModulesByPermissions } from './page-shell-permissions'

interface UseDynamicPageShellOptions {
    pageKey: string
    userPermissions?: string[]
    defaultModules?: PageShellModuleConfig[]
    storageKeyPrefix?: string

    loadLayout?: (pageKey: string) => Promise<PageShellModuleConfig[] | null>
    saveLayout?: (
        pageKey: string,
        modules: PageShellModuleConfig[]
    ) => Promise<void> | void

    debounceMs?: number
}

export function useDynamicPageShell({
    pageKey,
    userPermissions = [],
    defaultModules,
    storageKeyPrefix = 'dynamic-page-shell',
    loadLayout,
    saveLayout,
    debounceMs = 500,
}: UseDynamicPageShellOptions) {
    const [modules, setModules] = useState<PageShellModuleConfig[]>([])
    const [loading, setLoading] = useState(true)
    const [hydrated, setHydrated] = useState(false)

    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const initialLoadedRef = useRef(false)

    const storageKey = `${storageKeyPrefix}:${pageKey}`

    const resolvedDefaultModules = useMemo(() => {
        return defaultModules?.length
            ? defaultModules
            : getDefaultPageShellLayout(pageKey)
    }, [defaultModules, pageKey])

    const visibleByPermissionModules = useMemo(() => {
        return filterModulesByPermissions(modules, userPermissions)
    }, [modules, userPermissions])

    const defaultVisibleByPermissionModules = useMemo(() => {
        return filterModulesByPermissions(resolvedDefaultModules, userPermissions)
    }, [resolvedDefaultModules, userPermissions])

    const readFromLocalStorage = useCallback(() => {
        if (typeof window === 'undefined') return null

        try {
            const raw = window.localStorage.getItem(storageKey)
            if (!raw) return null

            const parsed = JSON.parse(raw)

            if (!Array.isArray(parsed)) return null

            return parsed as PageShellModuleConfig[]
        } catch {
            return null
        }
    }, [storageKey])

    const writeToLocalStorage = useCallback(
        (nextModules: PageShellModuleConfig[]) => {
            if (typeof window === 'undefined') return

            try {
                window.localStorage.setItem(storageKey, JSON.stringify(nextModules))
            } catch {
                // ignored
            }
        },
        [storageKey]
    )

    useEffect(() => {
        let mounted = true

        async function boot() {
            setLoading(true)

            try {
                let loaded: PageShellModuleConfig[] | null = null

                if (loadLayout) {
                    loaded = await loadLayout(pageKey)
                } else {
                    loaded = readFromLocalStorage()
                }

                if (!mounted) return

                const finalModules =
                    loaded && loaded.length > 0 ? loaded : resolvedDefaultModules

                setModules(finalModules)
                setHydrated(true)
                initialLoadedRef.current = true
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        boot()

        return () => {
            mounted = false
        }
    }, [pageKey, loadLayout, readFromLocalStorage, resolvedDefaultModules])

    const persist = useCallback(
        (nextModules: PageShellModuleConfig[]) => {
            if (!initialLoadedRef.current) return

            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current)
            }

            saveTimerRef.current = setTimeout(async () => {
                if (saveLayout) {
                    await saveLayout(pageKey, nextModules)
                } else {
                    writeToLocalStorage(nextModules)
                }
            }, debounceMs)
        },
        [debounceMs, pageKey, saveLayout, writeToLocalStorage]
    )

    const updateModules = useCallback(
        (nextModules: PageShellModuleConfig[]) => {
            setModules(nextModules)
            persist(nextModules)
        },
        [persist]
    )

    const resetLayout = useCallback(() => {
        setModules(resolvedDefaultModules)
        persist(resolvedDefaultModules)
    }, [persist, resolvedDefaultModules])

    const mergeWithDefaults = useCallback(() => {
        const currentIds = new Set(modules.map((item) => item.id))
        const missing = resolvedDefaultModules.filter(
            (item) => !currentIds.has(item.id)
        )

        const merged = [...modules, ...missing].map((item, index) => ({
            ...item,
            order: index,
        }))

        setModules(merged)
        persist(merged)
    }, [modules, persist, resolvedDefaultModules])

    return {
        modules,
        filteredModules: visibleByPermissionModules,
        defaultModules: defaultVisibleByPermissionModules,
        rawDefaultModules: resolvedDefaultModules,
        loading,
        hydrated,
        setModules: updateModules,
        resetLayout,
        mergeWithDefaults,
    }
}
