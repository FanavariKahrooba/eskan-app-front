"use client";

import { motion } from "framer-motion";
import { HallsOverviewData } from "../types/halls-overview.types";

interface HallsFiltersBarProps {
  data?: HallsOverviewData;
  regionId?: number | null;
  districtId?: number | null;
  top?: number;
  onChange: (filters: {
    region_id?: number | null;
    district_id?: number | null;
    top?: number;
  }) => void;
  wallboard?: boolean;
}

export function HallsFiltersBar({
  data,
  regionId,
  districtId,
  top = 8,
  onChange,
  wallboard = false,
}: HallsFiltersBarProps) {
  const regions = data?.region_breakdown ?? [];
  const districts = data?.district_breakdown ?? [];

  const containerClass = wallboard
    ? "rounded-3xl border border-slate-800 bg-slate-900 p-4 text-white"
    : "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm";

  const inputClass = wallboard
    ? "rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
    : "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={containerClass}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-bold opacity-70">
            منطقه
          </label>
          <select
            className={inputClass}
            value={regionId ?? ""}
            onChange={(e) =>
              onChange({
                region_id: e.target.value ? Number(e.target.value) : null,
                district_id: null,
                top,
              })
            }
          >
            <option value="">همه مناطق</option>
            {regions.map((item) => (
              <option
                key={item.region_id ?? "unknown"}
                value={item.region_id ?? ""}
              >
                {item.region_name ?? "نامشخص"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold opacity-70">
            ناحیه
          </label>
          <select
            className={inputClass}
            value={districtId ?? ""}
            onChange={(e) =>
              onChange({
                region_id: regionId ?? null,
                district_id: e.target.value ? Number(e.target.value) : null,
                top,
              })
            }
          >
            <option value="">همه نواحی</option>
            {districts.map((item) => (
              <option
                key={item.district_id ?? "unknown"}
                value={item.district_id ?? ""}
              >
                {item.district_name ?? "نامشخص"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold opacity-70">
            تعداد سراهای اولویت‌دار
          </label>
          <select
            className={inputClass}
            value={top}
            onChange={(e) =>
              onChange({
                region_id: regionId ?? null,
                district_id: districtId ?? null,
                top: Number(e.target.value),
              })
            }
          >
            {[5, 8, 10, 15, 20].map((value) => (
              <option key={value} value={value}>
                {value} مورد
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() =>
              onChange({ region_id: null, district_id: null, top: 8 })
            }
            className={
              wallboard
                ? "w-full rounded-2xl bg-slate-800 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-slate-700"
                : "w-full rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            }
          >
            حذف فیلترها
          </button>
        </div>
      </div>
    </motion.div>
  );
}
