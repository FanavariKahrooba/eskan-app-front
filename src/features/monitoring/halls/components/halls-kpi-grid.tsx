"use client";

import { HallsOverviewData } from "../types/halls-overview.types";
import { buildHallKpis } from "../lib/halls-overview.transforms";
import { MonitoringStatCard } from "../../shared/components/monitoring-stat-card";
import {
  MonitoringStagger,
  MonitoringStaggerItem,
} from "../../shared/components/monitoring-stagger";

export function HallsKpiGrid({
  data,
  wallboard = false,
}: {
  data: HallsOverviewData;
  wallboard?: boolean;
}) {
  const items = buildHallKpis(data);

  return (
    <MonitoringStagger>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <MonitoringStaggerItem key={item.key}>
            <MonitoringStatCard
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
              tone={item.tone}
              wallboard={wallboard}
            />
          </MonitoringStaggerItem>
        ))}
      </div>
    </MonitoringStagger>
  );
}
