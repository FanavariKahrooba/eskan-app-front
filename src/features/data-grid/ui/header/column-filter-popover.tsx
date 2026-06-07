"use client"
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DataGridButton, DataGridIcon } from "../shared";

export type ColumnFilterOperator =
  | "contains"
  | "equals"
  | "startsWith"
  | "endsWith"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export interface ColumnFilterValue {
  operator: ColumnFilterOperator;
  value: string;
}

export interface ColumnFilterPopoverProps {
  open?: boolean;
  title?: string;
  value?: ColumnFilterValue;
  disabled?: boolean;
  operators?: Array<{
    value: ColumnFilterOperator;
    label: string;
  }>;
  onOpenChange?: (open: boolean) => void;
  onApply?: (filter: ColumnFilterValue) => void;
  onClear?: () => void;
}

const defaultOperators: Array<{ value: ColumnFilterOperator; label: string }> =
  [
    { value: "contains", label: "شامل باشد" },
    { value: "equals", label: "برابر باشد" },
    { value: "startsWith", label: "شروع شود با" },
    { value: "endsWith", label: "تمام شود با" },
    { value: "gt", label: "بزرگ‌تر از" },
    { value: "gte", label: "بزرگ‌تر یا مساوی" },
    { value: "lt", label: "کوچک‌تر از" },
    { value: "lte", label: "کوچک‌تر یا مساوی" },
  ];

export function ColumnFilterPopover({
  open = false,
  title = "فیلتر ستون",
  value,
  disabled,
  operators = defaultOperators,
  onOpenChange,
  onApply,
  onClear,
}: ColumnFilterPopoverProps) {
  const initialOperator = value?.operator ?? operators[0]?.value ?? "contains";

  const [operator, setOperator] =
    useState<ColumnFilterOperator>(initialOperator);
  const [inputValue, setInputValue] = useState(value?.value ?? "");

  const canApply = useMemo(() => inputValue.trim().length > 0, [inputValue]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          className={[
            "absolute end-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-3xl",
            "border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/12 backdrop-blur-xl",
          ].join(" ")}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-black text-slate-800">
              <span className="grid h-8 w-8 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                <DataGridIcon name="filter" size={16} />
              </span>
              {title}
            </div>

            <button
              type="button"
              onClick={() => onOpenChange?.(false)}
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <DataGridIcon name="x" size={15} />
            </button>
          </div>

          <div className="space-y-3 p-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-500">
                نوع فیلتر
              </span>

              <select
                value={operator}
                disabled={disabled}
                onChange={(event) =>
                  setOperator(event.target.value as ColumnFilterOperator)
                }
                className={[
                  "h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none",
                  "focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10",
                ].join(" ")}
              >
                {operators.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-500">
                مقدار
              </span>

              <input
                value={inputValue}
                disabled={disabled}
                placeholder="مقدار فیلتر را وارد کنید..."
                onChange={(event) => setInputValue(event.target.value)}
                className={[
                  "h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none",
                  "placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10",
                ].join(" ")}
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
            <DataGridButton
              size="sm"
              variant="ghost"
              disabled={disabled}
              leftIcon={<DataGridIcon name="x" size={14} />}
              onClick={() => {
                setInputValue("");
                onClear?.();
                onOpenChange?.(false);
              }}
            >
              پاک کردن
            </DataGridButton>

            <DataGridButton
              size="sm"
              variant="primary"
              disabled={disabled || !canApply}
              leftIcon={<DataGridIcon name="check" size={14} />}
              onClick={() => {
                onApply?.({
                  operator,
                  value: inputValue.trim(),
                });
                onOpenChange?.(false);
              }}
            >
              اعمال
            </DataGridButton>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
