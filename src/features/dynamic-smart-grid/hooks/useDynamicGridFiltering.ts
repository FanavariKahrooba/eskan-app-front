'use client'
import { useMemo, useState } from "react";
import type { DynamicGridColumn } from "../DynamicSmartGrid";
import { getCellValue } from "../utils/dynamic-grid-helpers";

function normalizeValue(value: unknown) {
    if (value === null || value === undefined) return "";

    if (value instanceof Date) {
        return value.toLocaleString();
    }

    if (typeof value === "object") {
        try {
            return JSON.stringify(value);
        } catch {
            return "";
        }
    }

    return String(value);
}

function includesText(value: unknown, search: string) {
    return normalizeValue(value)
        .toLowerCase()
        .includes((search ?? "").trim().toLowerCase());
}

export function useDynamicGridFiltering<TData extends Record<string, any>>(
    rows?: TData[],
    columns?: DynamicGridColumn<TData>[]
) {
    const safeRows = Array.isArray(rows) ? rows : [];
    const safeColumns = Array.isArray(columns) ? columns : [];

    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

    const filteredRows = useMemo(() => {
        const safeGlobalFilter = globalFilter ?? "";
        const safeColumnFilters = columnFilters ?? {};

        const hasGlobalFilter = safeGlobalFilter.trim().length > 0;

        const activeColumnFilters = Object.entries(safeColumnFilters).filter(
            ([, value]) => String(value ?? "").trim().length > 0
        );

        if (!safeRows.length) return [];

        if (!hasGlobalFilter && !activeColumnFilters.length) {
            return safeRows;
        }

        return safeRows.filter((row) => {
            const passesGlobalFilter = !hasGlobalFilter
                ? true
                : safeColumns.some((column) => {
                    try {
                        const value = getCellValue(row, column);
                        return includesText(value, safeGlobalFilter);
                    } catch {
                        return false;
                    }
                });

            if (!passesGlobalFilter) return false;

            const passesColumnFilters = activeColumnFilters.every(
                ([columnId, filterValue]) => {
                    const column = safeColumns.find((item) => item.id === columnId);

                    if (!column) return true;

                    try {
                        const value = getCellValue(row, column);
                        return includesText(value, filterValue);
                    } catch {
                        return false;
                    }
                }
            );

            return passesColumnFilters;
        });
    }, [safeRows, safeColumns, globalFilter, columnFilters]);

    const setColumnFilter = (columnId: string, value: string) => {
        if (!columnId) return;

        setColumnFilters((prev) => {
            const safePrev = prev ?? {};

            if (!value || !value.trim()) {
                const next = { ...safePrev };
                delete next[columnId];
                return next;
            }

            return {
                ...safePrev,
                [columnId]: value,
            };
        });
    };

    const clearColumnFilter = (columnId: string) => {
        if (!columnId) return;

        setColumnFilters((prev) => {
            const safePrev = prev ?? {};
            const next = { ...safePrev };
            delete next[columnId];
            return next;
        });
    };

    const clearFilters = () => {
        setGlobalFilter("");
        setColumnFilters({});
    };

    return {
        globalFilter,
        setGlobalFilter,
        columnFilters,
        setColumnFilters,
        setColumnFilter,
        clearColumnFilter,
        filteredRows,
        clearFilters,
    };
}
