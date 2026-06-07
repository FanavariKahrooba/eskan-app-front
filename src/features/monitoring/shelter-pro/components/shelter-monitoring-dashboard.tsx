"use client";

import { useShelterOverview } from "../hooks/use-shelter-overview";
import {
  buildKpis,
  transformAlerts,
  transformCapacityBreakdown,
  transformRequestPriorities,
  transformRequestStatuses,
  transformSpaceTypes,
} from "../lib/shelter-overview.transforms";
import { ShelterAlertsPanel } from "./shelter-alerts-panel";
import { ShelterCapacityDonutChart } from "./shelter-capacity-donut-chart";
import { ShelterCapacityLogs } from "./shelter-capacity-logs";
import { ShelterKpiGrid } from "./shelter-kpi-grid";
import { ShelterRecentRequests } from "./shelter-recent-requests";
import { ShelterRequestPriorityChart } from "./shelter-request-priority-chart";
import { ShelterRequestStatusChart } from "./shelter-request-status-chart";
import { ShelterSpaceTypesChart } from "./shelter-space-types-chart";
import { ShelterTopHallsTable } from "./shelter-top-halls-table";

export function ShelterMonitoringDashboard() {
  const { data, isLoading, isError, error } = useShelterOverview({
    top: 5,
    recent_requests: 8,
    capacity_logs: 8,
  });

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        در حال بارگذاری مانیتورینگ اسکان...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        خطا در دریافت اطلاعات مانیتورینگ
        {error instanceof Error ? `: ${error.message}` : null}
      </div>
    );
  }

  const kpis = buildKpis(data);
  const capacityData = transformCapacityBreakdown(data);
  const requestStatusData = transformRequestStatuses(data);
  const requestPriorityData = transformRequestPriorities(data);
  const spaceTypesData = transformSpaceTypes(data);
  const alerts = transformAlerts(data);

  return (
    <div className="space-y-6">
      <ShelterKpiGrid items={kpis} />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-5">
          <ShelterCapacityDonutChart data={capacityData} />
        </div>
        <div className="2xl:col-span-7">
          <ShelterRequestStatusChart data={requestStatusData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-5">
          <ShelterRequestPriorityChart data={requestPriorityData} />
        </div>
        <div className="2xl:col-span-7">
          <ShelterSpaceTypesChart data={spaceTypesData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-5">
          <ShelterTopHallsTable items={data.top_shelters} />
        </div>
        <div className="2xl:col-span-7">
          <ShelterAlertsPanel items={alerts} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-6">
          <ShelterRecentRequests
            items={data.recent_requests.map((item) => ({
              id: item.id,
              request_number: item.request_number,
              hall_name: item.hall_name,
              preferred_space_name: item.preferred_space_name,
              applicant_name: item.applicant_name,
              priority_label: item.priority_label,
              status_label: item.status_label,
              household_size: item.household_size,
              created_at: item.created_at,
            }))}
          />
        </div>

        <div className="2xl:col-span-6">
          <ShelterCapacityLogs
            items={data.capacity_logs.map((item) => ({
              id: item.id,
              hall_name: item.hall_name,
              space_name: item.space_name,
              user_name: item.user_name,
              action_label: item.action_label,
              delta_available: item.delta_available,
              delta_reserved: item.delta_reserved,
              delta_occupied: item.delta_occupied,
              created_at: item.created_at,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
