"use client";

import { Moon, SunMedium } from "lucide-react";
import { useMonitoringTheme } from "../providers/monitoring-theme-provider";

export function MonitoringThemeToggle() {
  const { theme, toggleTheme } = useMonitoringTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 dark:text-white"
      aria-label="Toggle monitoring theme"
    >
      {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
