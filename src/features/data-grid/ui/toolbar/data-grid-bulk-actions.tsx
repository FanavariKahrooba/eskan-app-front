"use client"
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DataGridButton, DataGridIcon, DataGridMenu } from "../shared";
import type { DataGridMenuItem } from "../shared";

export interface DataGridBulkActionsProps {
  selectedCount?: number;
  actions?: DataGridMenuItem[];
  onClearSelection?: () => void;
}

export function DataGridBulkActions({
  selectedCount = 0,
  actions = [],
  onClearSelection,
}: DataGridBulkActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <AnimatePresence>
      {selectedCount > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          className={[
            "flex flex-wrap items-center gap-2 rounded-2xl",
            "border border-indigo-200 bg-indigo-50/80 px-3 py-2",
            "shadow-lg shadow-indigo-500/10 backdrop-blur-xl",
          ].join(" ")}
        >
          <span className="text-xs font-bold text-indigo-700">
            {selectedCount.toLocaleString("fa-IR")} مورد انتخاب شده
          </span>

          {actions.length > 0 ? (
            <div className="relative">
              <DataGridButton
                size="sm"
                variant="primary"
                rightIcon={<DataGridIcon name="chevronDown" size={14} />}
                onClick={() => setOpen((value) => !value)}
              >
                عملیات گروهی
              </DataGridButton>

              <DataGridMenu
                open={open}
                items={actions}
                align="end"
                onClose={() => setOpen(false)}
              />
            </div>
          ) : null}

          <DataGridButton
            size="sm"
            variant="ghost"
            leftIcon={<DataGridIcon name="x" size={14} />}
            onClick={onClearSelection}
          >
            لغو انتخاب
          </DataGridButton>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
