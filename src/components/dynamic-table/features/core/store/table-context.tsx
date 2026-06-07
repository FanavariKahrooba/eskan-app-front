// src/features/data-grid/core/store/table-context.tsx

"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import { createTableStore, type TableStore } from "./create-table-store";

type TableStoreApi = ReturnType<typeof createTableStore>;

const TableStoreContext = createContext<TableStoreApi | null>(null);

type TableProviderProps = {
  children: ReactNode;
  initialState: Parameters<typeof createTableStore>[0];
};

export function TableProvider({ children, initialState }: TableProviderProps) {
  const storeRef = useRef<TableStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createTableStore(initialState);
  }

  return (
    <TableStoreContext.Provider value={storeRef.current}>
      {children}
    </TableStoreContext.Provider>
  );
}

export function useTableStore<T>(selector: (state: TableStore) => T): T {
  const store = useContext(TableStoreContext);

  if (!store) {
    throw new Error("useTableStore must be used within TableProvider");
  }

  return useStore(store, selector);
}
