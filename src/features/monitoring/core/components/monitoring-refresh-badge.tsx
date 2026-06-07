"use client";

import { RefreshCcw } from "lucide-react";

interface MonitoringRefreshBadgeProps {
  lastUpdatedLabel?: string;
  autoRefreshLabel?: string;
}

export function MonitoringRefreshBadge({
  lastUpdatedLabel,
  autoRefreshLabel = "Auto Refresh",
}: MonitoringRefreshBadgeProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
      <RefreshCcw className="h-4 w-4" />
      <div className="flex flex-col leading-tight">
        <span className="font-medium">{autoRefreshLabel}</span>
        {lastUpdatedLabel ? <span className="text-xs text-cyan-100/80">{lastUpdatedLabel}</span> : null}
      </div>
    </div>
  );
}
