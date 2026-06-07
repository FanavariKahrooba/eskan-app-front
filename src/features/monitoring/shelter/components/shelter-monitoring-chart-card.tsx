"use client";

import React from "react";
import { MonitoringSurface } from "@/features/monitoring/core/components/monitoring-surface";
import { ShelterMonitoringSectionHeader } from "./shelter-monitoring-section-header";

interface ShelterMonitoringChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function ShelterMonitoringChartCard({
  title,
  subtitle,
  children,
  action,
  className,
}: ShelterMonitoringChartCardProps) {
  return (
    <MonitoringSurface className={`p-6 ${className ?? ""}`}>
      <ShelterMonitoringSectionHeader
        title={title}
        subtitle={subtitle}
        action={action}
      />
      {children}
    </MonitoringSurface>
  );
}
