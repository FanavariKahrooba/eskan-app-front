import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TableSortState = {
    id: string;
    desc?: boolean;
};

export type TableStoreState = {
    search: string;
    sorting: TableSortState[];

    page: number;
    pageSize: number;

    columnOrder: string[];
    columnSizing: Record<string, number>;

    setSearch: (value: string) => void;
    setSorting: (value: TableSortState[]) => void;

    setPage: (value: number) => void;
    setPageSize: (value: number) => void;

    setColumnOrder: (value: string[]) => void;
    setColumnSizing: (value: Record<string, number>) => void;

    resetLayout: () => void;
    resetTableState: () => void;
};

const DEFAULT_PAGE_SIZE = 10;

export function createTableStore(tableId: string) {
    return create<TableStoreState>()(
        persist(
            (set) => ({
                search: "",
                sorting: [],

                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,

                columnOrder: [],
                columnSizing: {},

                setSearch: (value) =>
                    set(() => ({
                        search: value,
                        page: 1,
                    })),

                setSorting: (value) =>
                    set(() => ({
                        sorting: value,
                        page: 1,
                    })),

                setPage: (value) =>
                    set(() => ({
                        page: value,
                    })),

                setPageSize: (value) =>
                    set(() => ({
                        pageSize: value,
                        page: 1,
                    })),

                setColumnOrder: (value) =>
                    set(() => ({
                        columnOrder: value,
                    })),

                setColumnSizing: (value) =>
                    set(() => ({
                        columnSizing: value,
                    })),

                resetLayout: () =>
                    set(() => ({
                        columnOrder: [],
                        columnSizing: {},
                    })),

                resetTableState: () =>
                    set(() => ({
                        search: "",
                        sorting: [],
                        page: 1,
                        pageSize: DEFAULT_PAGE_SIZE,
                        columnOrder: [],
                        columnSizing: {},
                    })),
            }),
            {
                name: `data-grid:${tableId}`,
                partialize: (state) => ({
                    search: state.search,
                    sorting: state.sorting,
                    page: state.page,
                    pageSize: state.pageSize,
                    columnOrder: state.columnOrder,
                    columnSizing: state.columnSizing,
                }),
            }
        )
    );
}
