'use client'
import { useMemo, useState } from "react";

import {
    clampNumber,
    getColumnInitialWidth,
    getColumnMaxWidth,
    getColumnMinWidth,
    getPinnedColumns,
    reorderArray,
} from "../utils/dynamic-grid-helpers";
// import { DynamicGridColumn, DynamicGridPinDirection } from "../DynamicSmartGrid";

export function useDynamicGridColumns<TData extends Record<string, any>>(
    rawColumns: any[]
) {
    const [orderedColumnIds, setOrderedColumnIds] = useState<string[]>(() =>
        rawColumns.map((column) => column.id)
    );

    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};

        rawColumns.forEach((column) => {
            initial[column.id] = getColumnInitialWidth(column);
        });

        return initial;
    });

    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
        () => {
            const initial: Record<string, boolean> = {};

            rawColumns.forEach((column) => {
                initial[column.id] = column.visible !== false;
            });

            return initial;
        }
    );

    const [columnPinning, setColumnPinning] = useState<
        Record<string, any>
    >(() => {
        const initial: Record<string, any> = {};

        rawColumns.forEach((column) => {
            initial[column.id] = column.pinned ?? false;
        });

        return initial;
    });

    const orderedColumns = useMemo(() => {
        const map = new Map(rawColumns.map((column) => [column.id, column]));

        const known = orderedColumnIds
            .map((id) => map.get(id))
            .filter(Boolean) as any[];

        const missing = rawColumns.filter(
            (column) => !orderedColumnIds.includes(column.id)
        );

        return [...known, ...missing].map((column) => ({
            ...column,
            width: columnWidths[column.id] ?? column.width ?? 160,
            pinned: columnPinning[column.id] ?? false,
        }));
    }, [rawColumns, orderedColumnIds, columnWidths, columnPinning]);

    const columns = useMemo(() => {
        return getPinnedColumns(orderedColumns, columnPinning);
    }, [orderedColumns, columnPinning]);

    const visibleColumns = useMemo(() => {
        return columns.filter((column) => columnVisibility[column.id] !== false);
    }, [columns, columnVisibility]);

    const reorderColumn = (sourceColumnId: string, targetColumnId: string) => {
        setOrderedColumnIds((prev) => {
            const sourceIndex = prev.indexOf(sourceColumnId);
            const targetIndex = prev.indexOf(targetColumnId);

            if (sourceIndex === -1 || targetIndex === -1) return prev;
            if (sourceIndex === targetIndex) return prev;

            return reorderArray(prev, sourceIndex, targetIndex);
        });
    };

    const resizeColumn = (columnId: string, nextWidth: number) => {
        const column = rawColumns.find((item) => item.id === columnId);

        if (!column) return;

        const min = getColumnMinWidth(column);
        const max = getColumnMaxWidth(column);

        setColumnWidths((prev) => ({
            ...prev,
            [columnId]: clampNumber(nextWidth, min, max),
        }));
    };

    return {
        columns,
        visibleColumns,

        orderedColumnIds,
        setOrderedColumnIds,

        columnWidths,
        setColumnWidths,

        columnVisibility,
        setColumnVisibility,

        columnPinning,
        setColumnPinning,

        reorderColumn,
        resizeColumn,
    };
}
