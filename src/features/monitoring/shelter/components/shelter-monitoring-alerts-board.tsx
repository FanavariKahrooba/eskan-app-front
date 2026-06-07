"use client";

import { ShieldCheck, ShieldAlert, TriangleAlert, Info } from "lucide-react";
import { ShelterMonitoringAlert } from "../types/shelter-monitoring.types";
import { getSeverityClasses } from "../utils/shelter-monitoring-ui";
import { formatDateTimeFa } from "../utils/shelter-monitoring-format";
import { ShelterMonitoringEmptyState } from "./shelter-monitoring-empty-state";
import { MonitoringSurface } from "@/features/monitoring/core/components/monitoring-surface";
import { ShelterMonitoringSectionHeader } from "./shelter-monitoring-section-header";

function AlertIcon({
  severity,
}: {
  severity: ShelterMonitoringAlert["severity"];
}) {
  switch (severity) {
    case "success":
      return <ShieldCheck className="h-5 w-5" />;
    case "danger":
      return <ShieldAlert className="h-5 w-5" />;
    case "warning":
      return <TriangleAlert className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
}

export function ShelterMonitoringAlertsBoard({
  alerts,
  compact,
}: {
  alerts: ShelterMonitoringAlert[];
  compact?: boolean;
}) {
  return (
    <MonitoringSurface className="p-6">
      <ShelterMonitoringSectionHeader
        title="هشدارهای تحلیلی"
        subtitle="تحلیل خودکار بر اساس ظرفیت، درخواست‌ها و وضعیت بهره‌برداری"
      />

      {!alerts.length ? (
        <ShelterMonitoringEmptyState />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const classes = getSeverityClasses(alert.severity);

            return (
              <div
                key={alert.id}
                className={`rounded-3xl border p-4 ${classes.card}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-2xl border p-2 ${classes.badge}`}>
                    <AlertIcon severity={alert.severity} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold monitoring-title">
                        {alert.title}
                      </h4>

                      {alert.metric !== undefined ? (
                        <span
                          className={`rounded-xl border px-2 py-1 text-xs ${classes.badge}`}
                        >
                          {String(alert.metric)}
                        </span>
                      ) : null}
                    </div>

                    <p
                      className={`mt-2 text-sm leading-6 ${compact ? "line-clamp-2" : ""} monitoring-muted`}
                    >
                      {alert.description}
                    </p>

                    <div className="mt-3 text-xs monitoring-muted">
                      {formatDateTimeFa(alert.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MonitoringSurface>
  );
}
