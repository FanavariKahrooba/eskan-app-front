'use client'
import { useState } from "react";
import type { DynamicGridRowId } from "../DynamicSmartGrid/DynamicSmartGrid.types";

export function useDynamicGridExpansion() {
    const [expandedIds, setExpandedIds] = useState<Set<DynamicGridRowId>>(
        () => new Set()
    );

    const toggleRowExpansion = (rowId: DynamicGridRowId) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);

            if (next.has(rowId)) {
                next.delete(rowId);
            } else {
                next.add(rowId);
            }

            return next;
        });
    };

    return {
        expandedIds,
        setExpandedIds,
        toggleRowExpansion,
    };
}
