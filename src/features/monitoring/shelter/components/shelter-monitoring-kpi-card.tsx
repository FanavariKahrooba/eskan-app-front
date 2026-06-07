"use client";

import React from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
} from "lucide-react";
import { ShelterMonitoringKpiItem } from "../types/shelter-monitoring.types";
import { getSeverityClasses } from "../utils/shelter-monitoring-ui";

function SeverityIcon({
  severity,
}: {
  severity?: ShelterMonitoringKpiItem["severity"];
}) {
  switch (severity) {
    case "success":
      return <CheckCircle2 className="h-5 w-5" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5" />;
    case "danger":
      return <ShieldAlert className="h-5 w-5" />;
    case "info":
      return <Info className="h-5 w-5" />;
    default:
      return <Activity className="h-5 w-5" />;
  }
}

export function ShelterMonitoringKpiCard({
  item,
  large,
}: {
  item: ShelterMonitoringKpiItem;
  large?: boolean;
}) {
  const classes = getSeverityClasses(item.severity);

  return (
    <div
      className={`monitoring-kpi-glow rounded-3xl border p-5 transition ${classes.card} ${
        large ? "min-h-[170px]" : "min-h-[150px]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm monitoring-muted">{item.label}</div>
        <div className={`rounded-2xl border p-2 ${classes.badge}`}>
          <SeverityIcon severity={item.severity} />
        </div>
      </div>

      <div
        className={`mt-5 font-black tracking-tight monitoring-title ${large ? "text-5xl" : "text-4xl"}`}
      >
        {item.value}
      </div>

      {item.hint ? (
        <div className="mt-3 text-xs leading-6 monitoring-muted">
          {item.hint}
        </div>
      ) : null}

      {item.trendLabel ? (
        <div className={`mt-4 text-xs font-semibold ${classes.accent}`}>
          {item.trendLabel}
        </div>
      ) : null}
    </div>
  );
}
