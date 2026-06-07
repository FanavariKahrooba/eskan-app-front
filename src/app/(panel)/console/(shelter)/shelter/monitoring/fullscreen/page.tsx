import { MonitoringRoot } from "@/features/monitoring/core/components/monitoring-root";
import { ShelterMonitoringFullscreenPage } from "@/features/monitoring/shelter/views/shelter-monitoring-fullscreen-page";

export default function Page() {
  return (
    <MonitoringRoot>
      <ShelterMonitoringFullscreenPage />
    </MonitoringRoot>
  );
}
