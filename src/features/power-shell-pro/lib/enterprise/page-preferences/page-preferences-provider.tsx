"use client";

import { ReactNode, useEffect } from "react";
import type { PagePreferencesStorageAdapter } from "./page-preferences-types";
import { setPagePreferencesAdapter } from "./page-preferences-storage";

interface PagePreferencesProviderProps {
  children: ReactNode;
  adapter?: PagePreferencesStorageAdapter;
}

export default function PagePreferencesProvider({
  children,
  adapter,
}: PagePreferencesProviderProps) {
  useEffect(() => {
    if (adapter) {
      setPagePreferencesAdapter(adapter);
    }
  }, [adapter]);

  return <>{children}</>;
}
