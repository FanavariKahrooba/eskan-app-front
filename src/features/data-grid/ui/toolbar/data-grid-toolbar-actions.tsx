"use client"
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DataGridButton, DataGridIcon } from "../shared";
import type { DataGridButtonProps } from "../shared";

export interface DataGridToolbarAction {
  id: string;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: DataGridButtonProps["variant"];
  size?: DataGridButtonProps["size"];
  title?: string;
  onClick?: () => void;
}

export interface DataGridToolbarActionsProps {
  actions?: DataGridToolbarAction[];
  selectedCount?: number;
  children?: ReactNode;
  className?: string;
  onClearSelection?: () => void;
}

export function DataGridToolbarActions({
  actions = [],
  selectedCount = 0,
  children,
  className = "",
  onClearSelection,
}: DataGridToolbarActionsProps) {
  return (
    <div className={["flex flex-wrap items-center gap-2", className].join(" ")}>
      <AnimatePresence>
        {selectedCount > 0 ? (
          <motion.div
            key="selected-count"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            className={[
              "flex items-center gap-2 rounded-2xl border border-indigo-200",
              "bg-indigo-50/80 px-3 py-2 shadow-lg shadow-indigo-500/10 backdrop-blur-xl",
            ].join(" ")}
          >
            <span className="text-xs font-black text-indigo-700">
              {selectedCount.toLocaleString("fa-IR")} انتخاب شده
            </span>

            {onClearSelection ? (
              <button
                type="button"
                onClick={onClearSelection}
                className="grid h-7 w-7 place-items-center rounded-xl text-indigo-500 transition hover:bg-indigo-100 hover:text-indigo-700"
              >
                <DataGridIcon name="x" size={14} />
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {actions.map((action) => (
        <DataGridButton
          key={action.id}
          size={action.size ?? "md"}
          variant={action.variant ?? "default"}
          loading={action.loading}
          disabled={action.disabled}
          title={action.title}
          leftIcon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </DataGridButton>
      ))}

      {children}
    </div>
  );
}
