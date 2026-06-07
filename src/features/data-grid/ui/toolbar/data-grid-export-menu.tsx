"use client"
import { useState } from "react";
import { DataGridButton, DataGridIcon, DataGridMenu } from "../shared";
import type { DataGridMenuItem } from "../shared";

export interface DataGridExportMenuProps {
  disabled?: boolean;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onExportJson?: () => void;
  onPrint?: () => void;
}

export function DataGridExportMenu({
  disabled,
  onExportCsv,
  onExportExcel,
  onExportJson,
  onPrint,
}: DataGridExportMenuProps) {
  const [open, setOpen] = useState(false);

  const items: DataGridMenuItem[] = [
    {
      id: "csv",
      label: "خروجی CSV",
      icon: <DataGridIcon name="download" size={16} />,
      onClick: onExportCsv,
      disabled: !onExportCsv,
    },
    {
      id: "excel",
      label: "خروجی Excel",
      icon: <DataGridIcon name="download" size={16} />,
      onClick: onExportExcel,
      disabled: !onExportExcel,
    },
    {
      id: "json",
      label: "خروجی JSON",
      icon: <DataGridIcon name="download" size={16} />,
      onClick: onExportJson,
      disabled: !onExportJson,
    },
    {
      id: "print",
      label: "چاپ جدول",
      icon: <DataGridIcon name="settings" size={16} />,
      onClick: onPrint,
      disabled: !onPrint,
    },
  ];

  return (
    <div className="relative">
      <DataGridButton
        variant="secondary"
        disabled={disabled}
        leftIcon={<DataGridIcon name="download" />}
        rightIcon={<DataGridIcon name="chevronDown" size={15} />}
        onClick={() => setOpen((value) => !value)}
      >
        خروجی
      </DataGridButton>

      <DataGridMenu
        open={open}
        items={items}
        align="end"
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
