"use client";

import React from "react";

interface ShelterMonitoringSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function ShelterMonitoringSectionHeader({
  title,
  subtitle,
  action,
}: ShelterMonitoringSectionHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-black monitoring-title md:text-xl">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-sm monitoring-muted">{subtitle}</p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}
