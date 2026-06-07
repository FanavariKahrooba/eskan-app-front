// src/features/data-grid/ui/data-grid.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DataAdapter, DataGridConfig } from "../core/types";
import { ArrayAdapter } from "../adapters";
import { cn } from "../core/utils/cn";
import { buildPipeline } from "../core/engine";
import { tableTheme } from "../core/theme/tokens";
import { useColumnLayout } from "../hooks/use-column-layout";
import { TableProvider, useTableStore } from "../core/store/table-context";
import { TableHeader } from "./table/table-header";
import { TableBody } from "./table/table-body";
import { TableEmpty } from "./table/table-empty";
import { GlobalSearch } from "./toolbar/global-search";
import { TablePagination } from "./pagination/table-pagination";

type DataGridInnerProps<TData> = DataGridConfig<TData>;

function DataGridInner<TData>({
  id,
  columns,
  dataSource,
  rowKey,
  mode = "client",
  features = {
    search: true,
    sorting: true,
    pagination: true,
    columnResize: true,
    columnReorder: true,
  },
  pagination,
  search,
  className,
  classNames,
  events,
}: DataGridInnerProps<TData>) {
  const page = useTableStore((state) => state.page);
  const pageSize = useTableStore((state) => state.pageSize);
  const searchValue = useTableStore((state) => state.search);
  const sorting = useTableStore((state) => state.sorting);
  const columnOrder = useTableStore((state) => state.columnOrder);
  const columnSizing = useTableStore((state) => state.columnSizing);

  const setPage = useTableStore((state) => state.setPage);
  const setSearch = useTableStore((state) => state.setSearch);
  const toggleSort = useTableStore((state) => state.toggleSort);
  const setColumnOrder = useTableStore((state) => state.setColumnOrder);
  const setColumnWidth = useTableStore((state) => state.setColumnWidth);

  const [rows, setRows] = useState<TData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adapter: DataAdapter<TData> = useMemo(() => {
    if (Array.isArray(dataSource)) {
      return new ArrayAdapter<TData>(dataSource);
    }
    return dataSource;
  }, [dataSource]);

  const visibleColumns = useColumnLayout(columns, columnOrder, columnSizing);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await adapter.load({
          page,
          pageSize,
          search: mode === "server" ? searchValue : undefined,
          sort: mode === "server" ? sorting : undefined,
        });

        if (ignore) return;

        setRows(response.rows);
        setTotal(response.total ?? response.rows.length);
        events?.onRowsLoaded?.(response.rows);
      } catch (err) {
        if (ignore) return;
        const errorObject =
          err instanceof Error ? err : new Error("خطای ناشناخته");
        setError(errorObject.message);
        events?.onError?.(errorObject);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [adapter, page, pageSize, searchValue, sorting, mode, events]);

  const pipelineResult = useMemo(() => {
    if (mode === "server") {
      return {
        searchedRows: rows,
        sortedRows: rows,
        paginatedRows: rows,
        total,
      };
    }

    return buildPipeline({
      rows,
      columns: visibleColumns,
      search: searchValue,
      sorting,
      page,
      pageSize,
      enableSearch: features.search ?? true,
      enableSorting: features.sorting ?? true,
      enablePagination: features.pagination ?? true,
    });
  }, [
    rows,
    visibleColumns,
    searchValue,
    sorting,
    page,
    pageSize,
    mode,
    total,
    features.search,
    features.sorting,
    features.pagination,
  ]);

  const displayRows = pipelineResult.paginatedRows;
  const displayTotal = mode === "server" ? total : pipelineResult.total;

  return (
    <motion.div
      id={id}
      layout
      className={cn(
        "w-full overflow-hidden rounded-xl",
        tableTheme.root,
        classNames?.root,
        className,
      )}
    >
      {(features.search ?? true) && (
        <motion.div
          layout
          className={cn(
            "flex items-center gap-3 p-3",
            tableTheme.toolbar,
            classNames?.toolbar,
          )}
        >
          <GlobalSearch
            value={searchValue}
            onChange={setSearch}
            placeholder={search?.placeholder}
          />
        </motion.div>
      )}

      <div className="w-full overflow-auto">
        <table
          className={cn(
            "w-full border-collapse",
            tableTheme.table,
            classNames?.table,
          )}
        >
          <TableHeader
            columns={visibleColumns}
            className={classNames?.header}
            sorting={sorting}
            onSort={features.sorting ? toggleSort : undefined}
            onColumnOrderChange={
              features.columnReorder ? setColumnOrder : undefined
            }
            onColumnResize={features.columnResize ? setColumnWidth : undefined}
            enableReorder={features.columnReorder}
            enableResize={features.columnResize}
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.tbody
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <tr>
                  <td
                    colSpan={visibleColumns.length}
                    className="px-3 py-10 text-center text-sm opacity-70"
                  >
                    در حال بارگذاری...
                  </td>
                </tr>
              </motion.tbody>
            ) : error ? (
              <motion.tbody
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <tr>
                  <td
                    colSpan={visibleColumns.length}
                    className="px-3 py-10 text-center text-sm text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              </motion.tbody>
            ) : displayRows.length === 0 ? (
              <motion.tbody
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <tr>
                  <td colSpan={visibleColumns.length}>
                    <TableEmpty colSpan={visibleColumns.length} />
                  </td>
                </tr>
              </motion.tbody>
            ) : (
              <motion.tbody
                key="data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TableBody
                  rows={displayRows}
                  columns={visibleColumns}
                  rowKey={rowKey}
                  onRowClick={events?.onRowClick}
                />
              </motion.tbody>
            )}
          </AnimatePresence>
        </table>
      </div>

      {(features.pagination ?? true) && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={displayTotal}
          onPageChange={setPage}
        />
      )}
    </motion.div>
  );
}

export function DataGrid<TData>(props: DataGridConfig<TData>) {
  return (
    <TableProvider
      initialState={{
        initialPagination: props.initialState?.pagination ?? {
          page: 1,
          pageSize: props.pagination?.pageSize ?? 10,
        },
        initialSearch: props.initialState?.search ?? "",
        initialSorting: props.initialState?.sorting ?? [],
        initialColumnOrder:
          props.initialState?.columnOrder ??
          props.columns.map((column) => column.id),
        initialColumnSizing: props.initialState?.columnSizing ?? {},
      }}
    >
      <DataGridInner {...props} />
    </TableProvider>
  );
}
