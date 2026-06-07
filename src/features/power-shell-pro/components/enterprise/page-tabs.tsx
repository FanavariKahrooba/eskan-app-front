"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export interface PageTabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: ReactNode;
  disabled?: boolean;
}

interface PageTabsProps {
  tabs: PageTabItem[];
  value?: string;
  onChange?: (value: string) => void;
}

export default function PageTabs({ tabs, value, onChange }: PageTabsProps) {
  if (!tabs.length) return null;

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full items-center gap-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const active = value === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => {
                if (!tab.disabled) onChange?.(tab.id);
              }}
              className={[
                "relative inline-flex h-11 items-center gap-2 px-4 text-sm font-medium transition",
                "disabled:cursor-not-allowed disabled:opacity-50",
                active ? "text-gray-950" : "text-gray-500 hover:text-gray-900",
              ].join(" ")}
            >
              {tab.icon && <span>{tab.icon}</span>}

              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[11px]",
                    active
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500",
                  ].join(" ")}
                >
                  {tab.badge}
                </span>
              )}

              {active && (
                <motion.span
                  layoutId="page-tabs-active-indicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gray-950"
                  transition={{ duration: 0.22, ease: "easeOut" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
