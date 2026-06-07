"use client"
import { DataGridButton, DataGridIcon } from "../shared";

export interface DataGridResetButtonProps {
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  confirm?: boolean;
  onReset?: () => void;
}

export function DataGridResetButton({
  disabled,
  loading,
  label = "بازنشانی",
  confirm,
  onReset,
}: DataGridResetButtonProps) {
  return (
    <DataGridButton
      variant="default"
      loading={loading}
      disabled={disabled}
      leftIcon={<DataGridIcon name="reset" />}
      onClick={() => {
        if (confirm) {
          const ok = window.confirm(
            "آیا از بازنشانی تنظیمات جدول مطمئن هستید؟",
          );
          if (!ok) return;
        }

        onReset?.();
      }}
    >
      {label}
    </DataGridButton>
  );
}
