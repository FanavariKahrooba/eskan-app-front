"use client"
import { DataGridButton, DataGridIcon } from "../shared";

export interface DataGridRefreshButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onRefresh?: () => void;
}

export function DataGridRefreshButton({
  loading,
  disabled,
  onRefresh,
}: DataGridRefreshButtonProps) {
  return (
    <DataGridButton
      size="icon"
      variant="default"
      loading={loading}
      disabled={disabled}
      title="بروزرسانی"
      onClick={onRefresh}
    >
      <DataGridIcon name="refresh" />
    </DataGridButton>
  );
}
