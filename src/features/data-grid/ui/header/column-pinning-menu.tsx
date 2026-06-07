"use client";
import { useState } from "react";
import { DataGridButton, DataGridIcon, DataGridMenu } from "../shared";
import type { DataGridMenuItem } from "../shared";

export type ColumnPinningState = "left" | "right" | false;

export interface ColumnPinningMenuProps {
  pinned?: ColumnPinningState;
  disabled?: boolean;
  onPinLeft?: () => void;
  onPinRight?: () => void;
  onUnpin?: () => void;
}

export function ColumnPinningMenu({
  pinned = false,
  disabled,
  onPinLeft,
  onPinRight,
  onUnpin,
}: ColumnPinningMenuProps) {
  const [open, setOpen] = useState(false);

  const items: DataGridMenuItem[] = [
    {
      id: "pin-left",
      label: "سنجاق به چپ",
      icon: <DataGridIcon name="settings" size={16} />,
      onClick: onPinLeft,
      disabled: pinned === "left" || !onPinLeft,
    },
    {
      id: "pin-right",
      label: "سنجاق به راست",
      icon: <DataGridIcon name="settings" size={16} />,
      onClick: onPinRight,
      disabled: pinned === "right" || !onPinRight,
    },
    {
      id: "unpin",
      label: "حذف سنجاق",
      icon: <DataGridIcon name="x" size={16} />,
      onClick: onUnpin,
      disabled: !pinned || !onUnpin,
    },
  ];

  return (
    <div className="relative">
      <DataGridButton
        size="icon"
        variant={pinned ? "secondary" : "ghost"}
        disabled={disabled}
        aria-label="سنجاق ستون"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <DataGridIcon name="settings" size={16} />
      </DataGridButton>

      <DataGridMenu
        open={open}
        items={items}
        align="end"
        className="w-52"
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
