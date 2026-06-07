"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useHallsOverview } from "../hooks/use-halls-overview";
import { MonitoringErrorState } from "../../shared/components/monitoring-error-state";
import { MonitoringSkeleton } from "../../shared/components/monitoring-skeleton";
import { HallsKpiGrid } from "./halls-kpi-grid";
import { HallsSummaryStrip } from "./halls-summary-strip";
import { HallsStatusChart } from "./halls-status-chart";
import { HallsRegionChart } from "./halls-region-chart";
import { HallsFacilitiesChart } from "./halls-facilities-chart";
import { HallsQualityPanel } from "./halls-quality-panel";
import { HallsAlertsPanel } from "./halls-alerts-panel";
import { HallsTopTable } from "./halls-top-table";
import { HallsOwnershipChart } from "./halls-ownership-chart";
import { HallsProgramActivityChart } from "./halls-program-activity-chart";

export function HallsMonitoringWallboard() {
  const [top] = useState(10);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useHallsOverview({ top });

  if (isLoading) {
    return (
      <main dir="rtl" className="min-h-screen bg-slate-950 p-6">
        <MonitoringSkeleton wallboard />
      </main>
    );
  }

  if (isError || !response?.data) {
    return (
      <main dir="rtl" className="min-h-screen bg-slate-950 p-6">
        <MonitoringErrorState
          message={error instanceof Error ? error.message : undefined}
        />
      </main>
    );
  }

  const data = response.data;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <div className="mx-auto max-w-[1900px] space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">
                  LIVE MONITORING
                </span>
              </div>

              <h1 className="text-2xl font-black md:text-4xl">
                Wallboard مانیتورینگ سراهای محله
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                پایش بلادرنگ سلامت عملیاتی، کیفیت داده و ظرفیت اسکان سراها
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/monitoring/halls"
                className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
              >
                بازگشت به داشبورد
              </Link>

              <button
                type="button"
                onClick={() => document.documentElement.requestFullscreen?.()}
                className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-400"
              >
                تمام‌صفحه
              </button>
            </div>
          </div>
        </motion.header>

        <HallsSummaryStrip generatedAt={response.generated_at} wallboard />

        <HallsKpiGrid data={data} wallboard />

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
          <div className="2xl:col-span-4">
            <HallsStatusChart data={data.status_breakdown} wallboard />
          </div>
          <div className="2xl:col-span-8">
            <HallsRegionChart data={data.region_breakdown} wallboard />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
          <div className="2xl:col-span-4">
            <HallsOwnershipChart data={data.ownership_breakdown} wallboard />
          </div>
          <div className="2xl:col-span-4">
            <HallsProgramActivityChart
              data={data.program_activity_breakdown}
              wallboard
            />
          </div>
          <div className="2xl:col-span-4">
            <HallsQualityPanel items={data.data_quality} wallboard />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
          <div className="2xl:col-span-5">
            <HallsFacilitiesChart data={data.facility_breakdown} wallboard />
          </div>
          <div className="2xl:col-span-4">
            <HallsTopTable items={data.top_halls} wallboard />
          </div>
          <div className="2xl:col-span-3">
            <HallsAlertsPanel items={data.alerts} wallboard />
          </div>
        </div>
      </div>
    </main>
  );
}
