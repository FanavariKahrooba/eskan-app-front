"use client";

import { useState } from "react";
import { MonitoringErrorState } from "../../shared/components/monitoring-error-state";
import { MonitoringSkeleton } from "../../shared/components/monitoring-skeleton";
import { MonitoringFadeIn } from "../../shared/components/monitoring-fade-in";
import { useHallsOverview } from "../hooks/use-halls-overview";
import { HallsAlertsPanel } from "./halls-alerts-panel";
import { HallsFacilitiesChart } from "./halls-facilities-chart";
import { HallsFiltersBar } from "./halls-filters-bar";
import { HallsKpiGrid } from "./halls-kpi-grid";
import { HallsOwnershipChart } from "./halls-ownership-chart";
import { HallsProgramActivityChart } from "./halls-program-activity-chart";
import { HallsQualityPanel } from "./halls-quality-panel";
import { HallsRegionChart } from "./halls-region-chart";
import { HallsStatusChart } from "./halls-status-chart";
import { HallsSummaryStrip } from "./halls-summary-strip";
import { HallsTopTable } from "./halls-top-table";

export function HallsMonitoringDashboard() {
  const [filters, setFilters] = useState<{
    region_id?: number | null;
    district_id?: number | null;
    top?: number;
  }>({
    region_id: null,
    district_id: null,
    top: 8,
  });

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useHallsOverview(filters);

  if (isLoading) return <MonitoringSkeleton />;

  if (isError || !response?.data) {
    return (
      <MonitoringErrorState
        message={error instanceof Error ? error.message : undefined}
      />
    );
  }

  const data = response.data;

  return (
    <div className="space-y-6">
      <MonitoringFadeIn>
        <HallsFiltersBar
          data={data}
          regionId={filters.region_id}
          districtId={filters.district_id}
          top={filters.top}
          onChange={setFilters}
        />
      </MonitoringFadeIn>

      <MonitoringFadeIn delay={0.03}>
        <HallsSummaryStrip generatedAt={response.generated_at} />
      </MonitoringFadeIn>

      <MonitoringFadeIn delay={0.05}>
        <HallsKpiGrid data={data} />
      </MonitoringFadeIn>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-5">
          <HallsStatusChart data={data.status_breakdown} />
        </div>
        <div className="2xl:col-span-7">
          <HallsRegionChart data={data.region_breakdown} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-6">
          <HallsFacilitiesChart data={data.facility_breakdown} />
        </div>
        <div className="2xl:col-span-6">
          <HallsQualityPanel items={data.data_quality} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-6">
          <HallsOwnershipChart data={data.ownership_breakdown} />
        </div>
        <div className="2xl:col-span-6">
          <HallsProgramActivityChart data={data.program_activity_breakdown} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-7">
          <HallsTopTable items={data.top_halls} />
        </div>
        <div className="2xl:col-span-5">
          <HallsAlertsPanel items={data.alerts} />
        </div>
      </div>
    </div>
  );
}
