import { HallsMonitoringDashboard } from "@/features/monitoring/halls/components/halls-monitoring-dashboard";
import { MonitoringPageShell } from "@/features/monitoring/shared/components/monitoring-page-shell";

export default function HallsMonitoringPage() {
  return (
    <MonitoringPageShell
      title="مانیتورینگ سراهای محله"
      description="پایش وضعیت عملیاتی، کیفیت داده، امکانات و ظرفیت اسکان سراهای محله"
      wallboardHref="/monitoring/halls/wallboard"
      backHref="/console/monitoring"
    >
      <HallsMonitoringDashboard />
    </MonitoringPageShell>
  );
}
