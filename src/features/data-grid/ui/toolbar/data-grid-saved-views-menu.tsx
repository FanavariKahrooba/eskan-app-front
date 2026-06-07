"use client"
import { useState } from "react";
import { DataGridButton, DataGridIcon, DataGridMenu } from "../shared";
import type { DataGridMenuItem } from "../shared";

export interface DataGridSavedView {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
  disabled?: boolean;
}

export interface DataGridSavedViewsMenuProps {
  views?: DataGridSavedView[];
  disabled?: boolean;
  activeViewId?: string;
  onSelectView?: (viewId: string) => void;
  onSaveCurrentView?: () => void;
  onRenameView?: (viewId: string) => void;
  onDeleteView?: (viewId: string) => void;
  onResetView?: () => void;
}

export function DataGridSavedViewsMenu({
  views = [],
  disabled,
  activeViewId,
  onSelectView,
  onSaveCurrentView,
  onRenameView,
  onDeleteView,
  onResetView,
}: DataGridSavedViewsMenuProps) {
  const [open, setOpen] = useState(false);

  const items: DataGridMenuItem[] = [
    ...views.map((view) => {
      const active = view.active || view.id === activeViewId;

      return {
        id: view.id,
        disabled: view.disabled,
        icon: active ? (
          <DataGridIcon name="check" size={16} />
        ) : (
          <DataGridIcon name="settings" size={16} />
        ),
        label: (
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-bold">{view.name}</span>
            {view.description ? (
              <span className="truncate text-[11px] font-medium text-slate-400">
                {view.description}
              </span>
            ) : null}
          </span>
        ),
        onClick: () => onSelectView?.(view.id),
      };
    }),
    {
      id: "__save_current",
      label: "ذخیره نمای فعلی",
      icon: <DataGridIcon name="check" size={16} />,
      onClick: onSaveCurrentView,
      disabled: !onSaveCurrentView,
    },
    {
      id: "__reset_view",
      label: "بازنشانی نما",
      icon: <DataGridIcon name="reset" size={16} />,
      onClick: onResetView,
      disabled: !onResetView,
    },
    ...(activeViewId
      ? [
          {
            id: "__rename_view",
            label: "تغییر نام نمای فعلی",
            icon: <DataGridIcon name="settings" size={16} />,
            onClick: () => onRenameView?.(activeViewId),
            disabled: !onRenameView,
          },
          {
            id: "__delete_view",
            label: "حذف نمای فعلی",
            icon: <DataGridIcon name="x" size={16} />,
            danger: true,
            onClick: () => onDeleteView?.(activeViewId),
            disabled: !onDeleteView,
          },
        ]
      : []),
  ];

  return (
    <div className="relative">
      <DataGridButton
        variant="default"
        disabled={disabled}
        leftIcon={<DataGridIcon name="settings" />}
        rightIcon={<DataGridIcon name="chevronDown" size={15} />}
        onClick={() => setOpen((value) => !value)}
      >
        نماهای ذخیره‌شده
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
