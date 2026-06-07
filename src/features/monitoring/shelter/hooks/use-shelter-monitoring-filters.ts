"use client";

import { useCallback, useState } from "react";
import { ShelterMonitoringFilters } from "../types/shelter-monitoring.types";

export function useShelterMonitoringFilters(
  initial?: ShelterMonitoringFilters
) {
  const [filters, setFilters] = useState<ShelterMonitoringFilters>(
    initial ?? {}
  );

  const updateFilter = useCallback(
    <K extends keyof ShelterMonitoringFilters>(
      key: K,
      value: ShelterMonitoringFilters[K]
    ) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
  };
}
