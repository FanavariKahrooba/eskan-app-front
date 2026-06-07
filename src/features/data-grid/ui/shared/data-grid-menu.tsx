"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface DataGridMenuItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  onClick?: () => void;
}

export interface DataGridMenuProps {
  open: boolean;
  items: DataGridMenuItem[];
  align?: "start" | "end";
  className?: string;
  onClose?: () => void;
}

export function DataGridMenu({
  open,
  items,
  align = "end",
  className = "",
  onClose,
}: DataGridMenuProps) {
  const visibleItems = items.filter((item) => !item.hidden);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="data-grid-menu-backdrop"
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            aria-label="Close menu"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            key="data-grid-menu-panel"
            initial={{ opacity: 0, y: -6, scale: 0.96, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, scale: 0.96, filter: "blur(6px)" }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={[
              "absolute z-50 mt-2 min-w-48 overflow-hidden rounded-2xl",
              "border border-white/60 bg-white/90 p-1.5 text-sm text-slate-700",
              "shadow-2xl shadow-slate-900/10 backdrop-blur-xl",
              align === "end" ? "right-0" : "left-0",
              className,
            ].join(" ")}
          >
            {visibleItems.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400">
                موردی وجود ندارد
              </div>
            ) : (
              visibleItems.map((item, index) => (
                <button
                  key={item.id || `data-grid-menu-item-${index}`}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    onClose?.();
                  }}
                  className={[
                    "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-start",
                    "transition-colors duration-150",
                    item.danger
                      ? "text-rose-600 hover:bg-rose-50"
                      : "hover:bg-slate-100",
                    item.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer",
                  ].join(" ")}
                >
                  {item.icon ? (
                    <span className="grid h-5 w-5 place-items-center">
                      {item.icon}
                    </span>
                  ) : null}

                  <span className="flex-1">{item.label}</span>
                </button>
              ))
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
