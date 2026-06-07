'use client'

import { useMemo, useState } from "react";

import { getCellValue } from "../utils/dynamic-grid-helpers";
// import { DynamicGridColumn, DynamicGridSortItem } from "../DynamicSmartGrid";

function compareValues(a: any, b: any) {
    if (a === b) return 0;
    if (a === null || a === undefined) return -1;
    if (b === null || b === undefined) return 1;

    if (typeof a === "number" && typeof b === "number") {
        return a - b;
    }

    const dateA = a instanceof Date ? a.getTime() : Date.parse(a);
    const dateB = b instanceof Date ? b.getTime() : Date.parse(b);

    if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) {
        return dateA - dateB;
    }

    return String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: "base",
    });
}

export function useDynamicGridSorting<TData extends Record<string, any>>(
    rows: TData[],
    columns: any[],
    enableMultiSort?: boolean
) {
    const [sorting, setSorting] = useState<any[]>([]);

    const sortedRows = useMemo(() => {
        if (!sorting.length) return rows;

        return [...rows].sort((rowA, rowB) => {
            for (const sort of sorting) {
                const column = columns.find((item) => item.id === sort.id);
                if (!column) continue;

                const valueA = column.sortValue
                    ? column.sortValue(rowA)
                    : getCellValue(rowA, column);

                const valueB = column.sortValue
                    ? column.sortValue(rowB)
                    : getCellValue(rowB, column);

                const result = compareValues(valueA, valueB);

                if (result !== 0) {
                    return sort.direction === "asc" ? result : -result;
                }
            }

            return 0;
        });
    }, [rows, columns, sorting]);

    const toggleSort = (columnId: string, multi?: boolean) => {
        setSorting((prev) => {
            const existing = prev.find((item) => item.id === columnId);
            const shouldMulti = Boolean(enableMultiSort && multi);

            if (!existing) {
                const next: any = {
                    id: columnId,
                    direction: "asc",
                };

                return shouldMulti ? [...prev, next] : [next];
            }

            if (existing.direction === "asc") {
                const next = prev.map((item) =>
                    item.id === columnId ? { ...item, direction: "desc" as const } : item
                );

                return shouldMulti ? next : next.filter((item) => item.id === columnId);
            }

            const next = prev.filter((item) => item.id !== columnId);
            return shouldMulti ? next : [];
        });
    };

    return {
        sorting,
        setSorting,
        sortedRows,
        toggleSort,
    };
}
