// "use client";

// import { MonitoringErrorState } from "../../shared/components/monitoring-error-state";
// import { MonitoringSkeleton } from "../../shared/components/monitoring-skeleton";
// import { useShelterOverview } from "../hooks/use-shelter-overview";
// import {
//   buildKpis,
//   transformAlerts,
//   transformCapacityBreakdown,
//   transformRequestPriorities,
//   transformRequestStatuses,
// } from "../lib/shelter-overview.transforms";
// import { ShelterAlertsPanel } from "./shelter-alerts-panel";
// import { ShelterCapacityDonutChart } from "./shelter-capacity-donut-chart";
// import { ShelterKpiGrid } from "./shelter-kpi-grid";
// import { ShelterRequestPriorityChart } from "./shelter-request-priority-chart";
// import { ShelterRequestStatusChart } from "./shelter-request-status-chart";
// import { ShelterTopHallsTable } from "./shelter-top-halls-table";

// export function ShelterWallboard() {
//   const { data, isLoading, isError, error } = useShelterOverview({
//     top: 6,
//     recent_requests: 5,
//     capacity_logs: 5,
//   });

//   if (isLoading) return <MonitoringSkeleton />;

//   if (isError || !data) {
//     return (
//       <MonitoringErrorState
//         message={error instanceof Error ? error.message : undefined}
//       />
//     );
//   }

//   const kpis = buildKpis(data);
//   const capacityData = transformCapacityBreakdown(data);
//   const requestStatusData = transformRequestStatuses(data);
//   const requestPriorityData = transformRequestPriorities(data);
//   const alerts = transformAlerts(data);

//   return (
//     <div className="space-y-6">
//       <ShelterKpiGrid items={kpis} />

//       <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
//         <div className="2xl:col-span-4">
//           <ShelterCapacityDonutChart data={capacityData} />
//         </div>

//         <div className="2xl:col-span-4">
//           <ShelterRequestStatusChart data={requestStatusData} />
//         </div>

//         <div className="2xl:col-span-4">
//           <ShelterRequestPriorityChart data={requestPriorityData} />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
//         <div className="2xl:col-span-7">
//           <ShelterTopHallsTable items={data.top_shelters} />
//         </div>

//         <div className="2xl:col-span-5">
//           <ShelterAlertsPanel items={alerts} />
//         </div>
//       </div>
//     </div>
//   );
// }
