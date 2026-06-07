'use client'

import { useMemo, useState } from "react";
import type { DynamicGridRowId } from "../DynamicSmartGrid/DynamicSmartGrid.types";

export function useDynamicGridSelection<TData extends Record<string, any>>(params: {
    visibleRows: TData[];
    getRowId: (row: TData, index: number) => DynamicGridRowId;
    isRowSelectable?: (row: TData) => boolean;
    onSelectionChange?: (selectedIds: DynamicGridRowId[]) => void;
}) {
    const { visibleRows, getRowId, isRowSelectable, onSelectionChange } = params;

    const [selectedIds, setSelectedIdsState] = useState<Set<DynamicGridRowId>>(
        () => new Set()
    );

    const setSelectedIds: typeof setSelectedIdsState = (value) => {
        setSelectedIdsState((prev) => {
            const next =
                typeof value === "function"
                    ? (value as (prev: Set<DynamicGridRowId>) => Set<DynamicGridRowId>)(prev)
                    : value;

            onSelectionChange?.([...next]);

            return next;
        });
    };

    const selectableVisibleRowIds = useMemo(() => {
        return visibleRows
            .map((row, index) => ({
                row,
                rowId: getRowId(row, index),
            }))
            .filter(({ row }) => (isRowSelectable ? isRowSelectable(row) : true))
            .map(({ rowId }) => rowId);
    }, [visibleRows, getRowId, isRowSelectable]);

    const isAllVisibleRowsSelected =
        selectableVisibleRowIds.length > 0 &&
        selectableVisibleRowIds.every((rowId) => selectedIds.has(rowId));

    const isSomeVisibleRowsSelected =
        selectableVisibleRowIds.some((rowId) => selectedIds.has(rowId)) &&
        !isAllVisibleRowsSelected;

    const toggleRowSelection = (rowId: DynamicGridRowId) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);

            if (next.has(rowId)) {
                next.delete(rowId);
            } else {
                next.add(rowId);
            }

            return next;
        });
    };

    const toggleAllVisibleRowsSelection = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);

            if (isAllVisibleRowsSelected) {
                selectableVisibleRowIds.forEach((rowId) => next.delete(rowId));
            } else {
                selectableVisibleRowIds.forEach((rowId) => next.add(rowId));
            }

            return next;
        });
    };

    const clearSelection = () => {
        setSelectedIds(new Set());
    };

    return {
        selectedIds,
        setSelectedIds,
        toggleRowSelection,
        toggleAllVisibleRowsSelection,
        clearSelection,
        isAllVisibleRowsSelected,
        isSomeVisibleRowsSelected,
    };
}
