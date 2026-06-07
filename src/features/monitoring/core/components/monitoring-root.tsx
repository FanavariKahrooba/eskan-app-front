"use client";

import React from "react";
import { MonitoringThemeProvider } from "../providers/monitoring-theme-provider";

export function MonitoringRoot({ children }: { children: React.ReactNode }) {
  return <MonitoringThemeProvider>{children}</MonitoringThemeProvider>;
}
