"use client";

import { MonitoringErrorState } from "../../shared/components/monitoring-error-state";
import { MonitoringSkeleton } from "../../shared/components/monitoring-skeleton";
import { useHallsOverview } from "../hooks/use-halls-overview";
import { buildHallKpis } from "../lib/halls-overview.transforms";
import { HallsKpiGrid } from "./halls-kpi-grid";
import { HallsRegionChart } from "./halls-region-chart";
import { HallsStatusChart } from "./halls-status-chart";
import { HallsTopTable } from "./halls-top-table";

export function HallsWallboard() {
  const { data, isLoading, isError, error } = useHallsOverview({
    top: 6,
  });

  if (isLoading) return <MonitoringSkeleton />;

  if (isError || !data) {
    return (
      <MonitoringErrorState
        message={error instanceof Error ? error.message : undefined}
      />
    );
  }

  // const kpis = buildHallKpis(data);

  return (
    <div className="space-y-6">
      {/* <HallsKpiGrid items={kpis} wallboard />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-4">
          <HallsStatusChart data={data.status_breakdown} wallboard />
        </div>

        <div className="2xl:col-span-8">
          <HallsRegionChart data={data.region_breakdown} wallboard />
        </div>
      </div>

      <HallsTopTable items={data.top_halls} wallboard /> */}
    </div>
  );
}
