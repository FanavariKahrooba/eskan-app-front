"use client";
import { useState } from "react";
import { DataGridButton, DataGridIcon, DataGridMenu } from "../shared";
import type { DataGridMenuItem } from "../shared";

export interface ColumnActionsMenuProps {
  columnId?: string;
  disabled?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pinnable?: boolean;
  hideable?: boolean;
  extraItems?: DataGridMenuItem[];
  onSortAsc?: () => void;
  onSortDesc?: () => void;
  onClearSort?: () => void;
  onOpenFilter?: () => void;
  onPinLeft?: () => void;
  onPinRight?: () => void;
  onUnpin?: () => void;
  onHide?: () => void;
}

export function ColumnActionsMenu({
  disabled,
  sortable,
  filterable,
  pinnable,
  hideable,
  extraItems = [],
  onSortAsc,
  onSortDesc,
  onClearSort,
  onOpenFilter,
  onPinLeft,
  onPinRight,
  onUnpin,
  onHide,
}: ColumnActionsMenuProps) {
  const [open, setOpen] = useState(false);

  const items: DataGridMenuItem[] = [
    ...(sortable
      ? [
          {
            id: "sort-asc",
            label: "مرتب‌سازی صعودی",
            icon: <DataGridIcon name="sortAsc" size={16} />,
            onClick: onSortAsc,
          },
          {
            id: "sort-desc",
            label: "مرتب‌سازی نزولی",
            icon: <DataGridIcon name="sortDesc" size={16} />,
            onClick: onSortDesc,
          },
          {
            id: "clear-sort",
            label: "حذف مرتب‌سازی",
            icon: <DataGridIcon name="x" size={16} />,
            onClick: onClearSort,
          },
        ]
      : []),
    ...(filterable
      ? [
          {
            id: "filter",
            label: "فیلتر این ستون",
            icon: <DataGridIcon name="filter" size={16} />,
            onClick: onOpenFilter,
          },
        ]
      : []),
    ...(pinnable
      ? [
          {
            id: "pin-left",
            label: "سنجاق به چپ",
            icon: <DataGridIcon name="settings" size={16} />,
            onClick: onPinLeft,
          },
          {
            id: "pin-right",
            label: "سنجاق به راست",
            icon: <DataGridIcon name="settings" size={16} />,
            onClick: onPinRight,
          },
          {
            id: "unpin",
            label: "حذف سنجاق",
            icon: <DataGridIcon name="x" size={16} />,
            onClick: onUnpin,
          },
        ]
      : []),
    ...(hideable
      ? [
          {
            id: "hide",
            label: "مخفی کردن ستون",
            icon: <DataGridIcon name="eyeOff" size={16} />,
            onClick: onHide,
          },
        ]
      : []),
    ...extraItems,
  ];

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <DataGridButton
        size="icon"
        variant="ghost"
        disabled={disabled}
        aria-label="عملیات ستون"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <DataGridIcon name="more" size={16} />
      </DataGridButton>

      <DataGridMenu
        open={open}
        items={items}
        align="end"
        className="w-56"
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
