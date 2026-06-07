"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { SelectBox } from "./neighborhood-hall-monitoring-shared";
import type { MonitoringFilterState } from "../types/neighborhood-hall-monitoring-types";

export default function NeighborhoodHallMonitoringFilters({
  filters,
  onChange,
  regions,
}: {
  filters: MonitoringFilterState;
  onChange: (next: MonitoringFilterState) => void;
  regions: Array<{ id: string; name: string }>;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
        <Filter size={16} />
        فیلترها
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SelectBox
          value={filters.regionId}
          onChange={(value) => onChange({ ...filters, regionId: value })}
          options={[
            { label: "همه مناطق", value: "all" },
            ...regions.map((item) => ({
              label: item.name,
              value: item.id,
            })),
          ]}
        />

        <SelectBox
          value={filters.serviceStatus}
          onChange={(value) =>
            onChange({
              ...filters,
              serviceStatus: value as MonitoringFilterState["serviceStatus"],
            })
          }
          options={[
            { label: "همه وضعیت‌ها", value: "all" },
            { label: "آنلاین", value: "online" },
            { label: "افت کیفیت", value: "degraded" },
            { label: "آفلاین", value: "offline" },
          ]}
        />
      </div>
    </div>
  );
}
