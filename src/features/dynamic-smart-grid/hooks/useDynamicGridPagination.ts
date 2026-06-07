'use client'
import { useMemo, useState } from "react";
import type { DynamicGridPaginationState } from "../DynamicSmartGrid/DynamicSmartGrid.types";

export function useDynamicGridPagination<TData>(
    rows: TData[],
    initialPageSize = 25
) {
    const [pagination, setPagination] = useState<DynamicGridPaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });

    const pageCount = Math.max(1, Math.ceil(rows.length / pagination.pageSize));

    const paginatedRows = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;

        return rows.slice(start, end);
    }, [rows, pagination.pageIndex, pagination.pageSize]);

    return {
        pagination,
        setPagination,
        paginatedRows,
        pageCount,
    };
}
