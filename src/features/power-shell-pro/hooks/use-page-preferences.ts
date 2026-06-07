"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
    PagePreferencesValue,
    PageSortState,
    PageDensity,
} from "../lib/enterprise/page-preferences/page-preferences-types";
import { getPagePreferencesAdapter } from "../lib/enterprise/page-preferences/page-preferences-storage";

interface UsePagePreferencesOptions {
    pageKey: string;
    userId?: string;
    defaultValue?: PagePreferencesValue;
    saveDebounceMs?: number;
}

export function usePagePreferences({
    pageKey,
    userId,
    defaultValue = {},
    saveDebounceMs = 400,
}: UsePagePreferencesOptions) {
    const [preferences, setPreferences] =
        useState<PagePreferencesValue>(defaultValue);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const hydratedRef = useRef(false);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const adapter = useMemo(() => getPagePreferencesAdapter(), []);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                setLoading(true);

                const stored = await adapter.getPreferences({
                    pageKey,
                    userId,
                });

                if (!mounted) return;

                setPreferences({
                    ...defaultValue,
                    ...(stored || {}),
                });

                hydratedRef.current = true;
            } catch (error) {
                console.error("Failed to load page preferences:", error);

                if (mounted) {
                    setPreferences(defaultValue);
                    hydratedRef.current = true;
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            mounted = false;
        };
    }, [adapter, pageKey, userId]);

    const persist = useCallback(
        async (next: PagePreferencesValue) => {
            try {
                setSaving(true);

                await adapter.setPreferences({
                    pageKey,
                    userId,
                    value: next,
                });
            } catch (error) {
                console.error("Failed to save page preferences:", error);
            } finally {
                setSaving(false);
            }
        },
        [adapter, pageKey, userId]
    );

    const updatePreferences = useCallback(
        (
            updater:
                | PagePreferencesValue
                | ((prev: PagePreferencesValue) => PagePreferencesValue)
        ) => {
            setPreferences((prev) => {
                const next =
                    typeof updater === "function"
                        ? (updater as (prev: PagePreferencesValue) => PagePreferencesValue)(
                            prev
                        )
                        : updater;

                if (hydratedRef.current) {
                    if (saveTimerRef.current) {
                        clearTimeout(saveTimerRef.current);
                    }

                    saveTimerRef.current = setTimeout(() => {
                        persist(next);
                    }, saveDebounceMs);
                }

                return next;
            });
        },
        [persist, saveDebounceMs]
    );

    const setActiveTab = useCallback(
        (activeTab: string) => {
            updatePreferences((prev) => ({
                ...prev,
                activeTab,
            }));
        },
        [updatePreferences]
    );

    const setSearch = useCallback(
        (search: string) => {
            updatePreferences((prev) => ({
                ...prev,
                search,
            }));
        },
        [updatePreferences]
    );

    const setFilters = useCallback(
        (filters: Record<string, unknown>) => {
            updatePreferences((prev) => ({
                ...prev,
                filters,
            }));
        },
        [updatePreferences]
    );

    const setFilter = useCallback(
        (key: string, value: unknown) => {
            updatePreferences((prev) => ({
                ...prev,
                filters: {
                    ...(prev.filters || {}),
                    [key]: value,
                },
            }));
        },
        [updatePreferences]
    );

    const setSort = useCallback(
        (sort: PageSortState) => {
            updatePreferences((prev) => ({
                ...prev,
                sort,
            }));
        },
        [updatePreferences]
    );

    const setPageSize = useCallback(
        (pageSize: number) => {
            updatePreferences((prev) => ({
                ...prev,
                pageSize,
            }));
        },
        [updatePreferences]
    );

    const setVisibleColumns = useCallback(
        (visibleColumns: string[]) => {
            updatePreferences((prev) => ({
                ...prev,
                visibleColumns,
            }));
        },
        [updatePreferences]
    );

    const setDensity = useCallback(
        (density: PageDensity) => {
            updatePreferences((prev) => ({
                ...prev,
                density,
            }));
        },
        [updatePreferences]
    );

    const setCustomPreference = useCallback(
        (key: string, value: unknown) => {
            updatePreferences((prev) => ({
                ...prev,
                custom: {
                    ...(prev.custom || {}),
                    [key]: value,
                },
            }));
        },
        [updatePreferences]
    );

    const resetPreferences = useCallback(async () => {
        try {
            setSaving(true);

            await adapter.resetPreferences({
                pageKey,
                userId,
            });

            setPreferences(defaultValue);
        } catch (error) {
            console.error("Failed to reset page preferences:", error);
        } finally {
            setSaving(false);
        }
    }, [adapter, pageKey, userId, defaultValue]);

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, []);

    return {
        preferences,
        loading,
        saving,

        updatePreferences,

        setActiveTab,
        setSearch,
        setFilters,
        setFilter,
        setSort,
        setPageSize,
        setVisibleColumns,
        setDensity,
        setCustomPreference,

        resetPreferences,
    };
}
