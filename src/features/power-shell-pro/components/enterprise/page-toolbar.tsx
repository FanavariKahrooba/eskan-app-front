"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { PageDensity } from "../../lib/enterprise/page-preferences/page-preferences-types";

interface PageToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;

  density?: PageDensity;
  onDensityChange?: (density: PageDensity) => void;

  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;

  onResetPreferences?: () => void;

  filtersSlot?: ReactNode;
  rightSlot?: ReactNode;

  saving?: boolean;
}

export default function PageToolbar({
  search = "",
  onSearchChange,
  density = "comfortable",
  onDensityChange,
  pageSize = 20,
  onPageSizeChange,
  onResetPreferences,
  filtersSlot,
  rightSlot,
  saving,
}: PageToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="جستجو..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-white pr-9 pl-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filtersSlot}

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <SlidersHorizontal size={16} />
              فیلترها
            </button>

            <select
              value={density}
              onChange={(event) =>
                onDensityChange?.(event.target.value as PageDensity)
              }
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-gray-400"
            >
              <option value="comfortable">نمایش عادی</option>
              <option value="compact">نمایش فشرده</option>
            </select>

            <select
              value={pageSize}
              onChange={(event) =>
                onPageSizeChange?.(Number(event.target.value))
              }
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-gray-400"
            >
              <option value={10}>۱۰ ردیف</option>
              <option value={20}>۲۰ ردیف</option>
              <option value={50}>۵۰ ردیف</option>
              <option value={100}>۱۰۰ ردیف</option>
            </select>

            <button
              type="button"
              onClick={onResetPreferences}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <RotateCcw size={16} />
              بازنشانی
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {saving && (
            <span className="text-xs text-gray-400">
              در حال ذخیره تنظیمات...
            </span>
          )}

          {rightSlot}
        </div>
      </div>
    </motion.div>
  );
}
