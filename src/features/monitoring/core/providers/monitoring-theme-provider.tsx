"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MonitoringTheme } from "../types/monitoring";
import { MONITORING_STORAGE_KEYS } from "../utils/monitoring-storage";
import "../styles/monitoring-theme.css";

interface MonitoringThemeContextValue {
  theme: MonitoringTheme;
  setTheme: (theme: MonitoringTheme) => void;
  toggleTheme: () => void;
}

const MonitoringThemeContext =
  createContext<MonitoringThemeContextValue | null>(null);

function getInitialTheme(): MonitoringTheme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(MONITORING_STORAGE_KEYS.THEME);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function MonitoringThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<MonitoringTheme>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(getInitialTheme());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MONITORING_STORAGE_KEYS.THEME, theme);
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next: MonitoringTheme) => setThemeState(next),
      toggleTheme: () =>
        setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return (
    <MonitoringThemeContext.Provider value={value}>
      <div
        data-monitoring-theme={theme}
        className="monitoring-root monitoring-grid-bg"
      >
        {children}
      </div>
    </MonitoringThemeContext.Provider>
  );
}

export function useMonitoringTheme() {
  const context = useContext(MonitoringThemeContext);
  if (!context) {
    throw new Error(
      "useMonitoringTheme must be used within MonitoringThemeProvider",
    );
  }
  return context;
}
