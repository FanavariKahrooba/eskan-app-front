"use client";

import React from "react";
import { mcn } from "../utils/monitoring-cn";

interface MonitoringSurfaceProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  soft?: boolean;
}

export function MonitoringSurface({
  children,
  className,
  strong,
  soft,
}: MonitoringSurfaceProps) {
  return (
    <div
      className={mcn(
        "rounded-3xl",
        strong ? "monitoring-panel-strong" : soft ? "monitoring-panel-soft" : "monitoring-panel",
        className
      )}
    >
      {children}
    </div>
  );
}
