"use client";

import { useEffect, useMemo } from "react";
import { ColumnDef } from "../types/column.types";
import { createTableStore } from "./table-store";
import { applySearch } from "../engine/apply-search";
import { applyPagination, applySorting } from "../engine";
import { reorderArray } from "../utils/reorder-array";

type UseTableInstanceOptions<TData> = {
    tableId: string;
    columns: ColumnDef<TData>[];
    data: TData[];
    config?: TableConfig<TData>;
};

export function useTableInstance<TData>({
    tableId,
    columns,
    data,
    config,
}: UseTableInstanceOptions<TData>) {
    const useTableStore = useMemo(() => createTableStore(tableId), [tableId]);

    const search = useTableStore((state) => state.search);
    const sorting = useTableStore((state) => state.sorting);
    const page = useTableStore((state) => state.page);
    const pageSize = useTableStore((state) => state.pageSize);
    const columnOrder = useTableStore((state) => state.columnOrder);
    const columnSizing = useTableStore((state) => state.columnSizing);

    const setSearch = useTableStore((state) => state.setSearch);
    const setSorting = useTableStore((state) => state.setSorting);
    const setPage = useTableStore((state) => state.setPage);
    const setPageSize = useTableStore((state) => state.setPageSize);
    const setColumnOrder = useTableStore((state) => state.setColumnOrder);
    const setColumnSizing = useTableStore((state) => state.setColumnSizing);
    const resetLayout = useTableStore((state) => state.resetLayout);
    const resetTableState = useTableStore((state) => state.resetTableState);

    useEffect(() => {
        const nextIds = columns.map((column) => column.id);

        if (columnOrder.length === 0) {
            setColumnOrder(nextIds);
            return;
        }

        const mergedOrder = [
            ...columnOrder.filter((id) => nextIds.includes(id)),
            ...nextIds.filter((id) => !columnOrder.includes(id)),
        ];

        const changed =
            mergedOrder.length !== columnOrder.length ||
            mergedOrder.some((id, index) => id !== columnOrder[index]);

        if (changed) {
            setColumnOrder(mergedOrder);
        }
    }, [columns, columnOrder, setColumnOrder]);

    const orderedColumns = useMemo(() => {
        const map = new Map(columns.map((column) => [column.id, column]));

        const ordered = columnOrder
            .map((id) => map.get(id))
            .filter(Boolean) as ColumnDef<TData>[];

        const missing = columns.filter((column) => !columnOrder.includes(column.id));

        return [...ordered, ...missing];
    }, [columns, columnOrder]);

    const filteredRows = useMemo(() => {
        return applySearch(data, search, orderedColumns);
    }, [data, search, orderedColumns]);

    const sortedRows = useMemo(() => {
        return applySorting(filteredRows, sorting, orderedColumns);
    }, [filteredRows, sorting, orderedColumns]);

    const paginatedRows = useMemo(() => {
        return applyPagination(sortedRows, page, pageSize);
    }, [sortedRows, page, pageSize]);

    const totalRows = sortedRows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages, setPage]);

    const reorderColumn = (activeId: string, overId: string) => {
        if (!overId || activeId === overId) return;

        const oldIndex = columnOrder.indexOf(activeId);
        const newIndex = columnOrder.indexOf(overId);

        if (oldIndex < 0 || newIndex < 0) return;

        const nextOrder = reorderArray(columnOrder, oldIndex, newIndex);
        setColumnOrder(nextOrder);
    };

    const resizeColumn = (columnId: string, nextWidth: number) => {
        const minWidth = config?.columnResize?.minWidth ?? 80;
        const maxWidth = config?.columnResize?.maxWidth ?? 800;

        const width = Math.max(minWidth, Math.min(maxWidth, nextWidth));

        setColumnSizing({
            ...columnSizing,
            [columnId]: width,
        });
    };

    const getColumnWidth = (columnId: string) => {
        const explicitWidth = columnSizing[columnId];
        if (typeof explicitWidth === "number") return explicitWidth;

        const column = orderedColumns.find((item) => item.id === columnId);
        if (!column) return undefined;

        if (typeof column.width === "number") return column.width;
        return undefined;
    };

    const canPreviousPage = page > 1;
    const canNextPage = page < totalPages;

    return {
        tableId,

        columns,
        orderedColumns,

        rows: sortedRows,
        paginatedRows,

        totalRows,
        totalPages,

        search,
        sorting,
        page,
        pageSize,

        columnOrder,
        columnSizing,

        setSearch,
        setSorting,
        setPage,
        setPageSize,
        setColumnOrder,
        setColumnSizing,

        resetLayout,
        resetTableState,

        reorderColumn,
        resizeColumn,
        getColumnWidth,

        canPreviousPage,
        canNextPage,
    };
}
