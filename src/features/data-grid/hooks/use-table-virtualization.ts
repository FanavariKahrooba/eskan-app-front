
"use client"
import { useCallback, useMemo } from 'react';

import type {
    DataGridTableInstance,
    TableVirtualizationConfig,
    UseTableVirtualizationResult,
} from '../core/types';

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function useTableVirtualization(
    instance: DataGridTableInstance,
    config?: TableVirtualizationConfig,
): UseTableVirtualizationResult {
    const resolvedConfig = config ?? instance.virtualization ?? {};

    const rowHeight = resolvedConfig.rowHeight ?? 44;
    const overscan = resolvedConfig.overscan ?? 6;
    const containerHeight = resolvedConfig.containerHeight ?? 480;
    const totalRows = resolvedConfig.totalRows ?? 0;
    const scrollTop = resolvedConfig.scrollTop ?? 0;

    const totalHeight = totalRows * rowHeight;

    const startIndex = useMemo(() => {
        return clamp(
            Math.floor(scrollTop / rowHeight) - overscan,
            0,
            Math.max(totalRows - 1, 0),
        );
    }, [overscan, rowHeight, scrollTop, totalRows]);

    const endIndex = useMemo(() => {
        const visibleCount = Math.ceil(containerHeight / rowHeight);

        return clamp(
            startIndex + visibleCount + overscan * 2,
            0,
            totalRows,
        );
    }, [containerHeight, overscan, rowHeight, startIndex, totalRows]);

    const offsetTop = startIndex * rowHeight;
    const visibleRange = useMemo(
        () => ({
            startIndex,
            endIndex,
        }),
        [endIndex, startIndex],
    );

    const getOffsetForIndex = useCallback(
        (index: number) => index * rowHeight,
        [rowHeight],
    );

    return {
        enabled: resolvedConfig.enabled ?? false,
        rowHeight,
        overscan,
        containerHeight,
        totalRows,
        totalHeight,
        scrollTop,
        visibleRange,
        offsetTop,
        getOffsetForIndex,
        instance,
    };
}
