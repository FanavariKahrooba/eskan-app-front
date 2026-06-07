import { MonitoringPageShell } from "@/features/monitoring/shared/components/monitoring-page-shell";
import { ShelterWallboard } from "@/features/monitoring/shelter/components/shelter-wallboard";

export default function ShelterWallboardPage() {
  return (
    <MonitoringPageShell
      title="Wallboard مانیتورینگ اسکان"
      subtitle="نمای زنده ظرفیت، درخواست‌ها، رزروها و هشدارهای اسکان"
      wallboard
    >
      <ShelterWallboard />
    </MonitoringPageShell>
  );
}
