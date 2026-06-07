import { MonitoringRoot } from "@/features/monitoring/core/components/monitoring-root";
import { ShelterMonitoringPage } from "@/features/monitoring/shelter/views/shelter-monitoring-page";

export default function Page() {
  return (
    <MonitoringRoot>
      <ShelterMonitoringPage />
    </MonitoringRoot>
  );
}
