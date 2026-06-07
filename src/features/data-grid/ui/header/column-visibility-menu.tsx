"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { DataGridButton, DataGridIcon, DataGridMenu } from "../shared";
import type { DataGridMenuItem } from "../shared";

export interface ColumnVisibilityOption {
  id: string;
  label: string;
  visible?: boolean;
  disabled?: boolean;
}

export interface ColumnVisibilityMenuProps {
  columns?: ColumnVisibilityOption[];
  disabled?: boolean;
  buttonLabel?: string;
  onToggleColumn?: (id: string, visible: boolean) => void;
  onShowAll?: () => void;
  onHideAll?: () => void;
  onReset?: () => void;
}

export function ColumnVisibilityMenu({
  columns = [],
  disabled,
  buttonLabel = "ستون‌ها",
  onToggleColumn,
  onShowAll,
  onHideAll,
  onReset,
}: ColumnVisibilityMenuProps) {
  const [open, setOpen] = useState(false);

  const items: DataGridMenuItem[] = [
    ...columns.map((column) => {
      const visible = column.visible !== false;

      return {
        id: column.id,
        disabled: column.disabled,
        icon: <DataGridIcon name={visible ? "eye" : "eyeOff"} size={16} />,
        label: (
          <span className="flex w-full items-center justify-between gap-3">
            <span className="truncate">{column.label}</span>

            <motion.span
              animate={{
                scale: visible ? 1 : 0.9,
                opacity: visible ? 1 : 0.45,
              }}
              className={[
                "grid h-5 w-5 place-items-center rounded-md border",
                visible
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 text-transparent",
              ].join(" ")}
            >
              <DataGridIcon name="check" size={12} />
            </motion.span>
          </span>
        ),
        onClick: () => onToggleColumn?.(column.id, !visible),
      };
    }),
    {
      id: "__show_all",
      label: "نمایش همه ستون‌ها",
      icon: <DataGridIcon name="eye" size={16} />,
      onClick: onShowAll,
      disabled: !onShowAll,
    },
    {
      id: "__hide_all",
      label: "مخفی کردن همه",
      icon: <DataGridIcon name="eyeOff" size={16} />,
      onClick: onHideAll,
      disabled: !onHideAll,
    },
    {
      id: "__reset",
      label: "بازنشانی ستون‌ها",
      icon: <DataGridIcon name="reset" size={16} />,
      onClick: onReset,
      disabled: !onReset,
    },
  ];

  return (
    <div className="relative">
      <DataGridButton
        variant="default"
        disabled={disabled}
        leftIcon={<DataGridIcon name="columns" />}
        rightIcon={<DataGridIcon name="chevronDown" size={15} />}
        onClick={() => setOpen((value) => !value)}
      >
        {buttonLabel}
      </DataGridButton>

      <DataGridMenu
        open={open}
        items={items}
        align="end"
        className="w-72"
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
