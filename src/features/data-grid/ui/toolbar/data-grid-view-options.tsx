"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { DataGridButton, DataGridIcon, DataGridMenu } from "../shared";
import type { DataGridMenuItem } from "../shared";

export interface DataGridViewOption {
  id: string;
  label: string;
  visible?: boolean;
  disabled?: boolean;
}

export interface DataGridViewOptionsProps {
  columns?: DataGridViewOption[];
  onToggleColumn?: (id: string, visible: boolean) => void;
  onReset?: () => void;
}

export function DataGridViewOptions({
  columns = [],
  onToggleColumn,
  onReset,
}: DataGridViewOptionsProps) {
  const [open, setOpen] = useState(false);

  const items: DataGridMenuItem[] = [
    ...columns.map((column) => ({
      id: column.id,
      disabled: column.disabled,
      label: (
        <span className="flex w-full items-center justify-between gap-3">
          <span>{column.label}</span>

          <motion.span
            animate={{
              scale: column.visible === false ? 0.9 : 1,
              opacity: column.visible === false ? 0.45 : 1,
            }}
            className={[
              "grid h-5 w-5 place-items-center rounded-md border",
              column.visible === false
                ? "border-slate-300 text-transparent"
                : "border-indigo-600 bg-indigo-600 text-white",
            ].join(" ")}
          >
            <DataGridIcon name="check" size={12} />
          </motion.span>
        </span>
      ),
      icon: (
        <DataGridIcon
          name={column.visible === false ? "eyeOff" : "eye"}
          size={16}
        />
      ),
      onClick: () => onToggleColumn?.(column.id, column.visible === false),
    })),
    {
      id: "__reset",
      label: "بازنشانی چینش ستون‌ها",
      icon: <DataGridIcon name="reset" size={16} />,
      onClick: onReset,
    },
  ];

  return (
    <div className="relative">
      <DataGridButton
        variant="default"
        leftIcon={<DataGridIcon name="columns" />}
        rightIcon={<DataGridIcon name="chevronDown" size={15} />}
        onClick={() => setOpen((value) => !value)}
      >
        ستون‌ها
      </DataGridButton>

      <DataGridMenu
        open={open}
        items={items}
        align="end"
        className="w-64"
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
