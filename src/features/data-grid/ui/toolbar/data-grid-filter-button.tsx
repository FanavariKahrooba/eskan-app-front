"use client"
import { motion } from "framer-motion";
import { DataGridButton, DataGridIcon } from "../shared";

export interface DataGridFilterButtonProps {
  activeCount?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export function DataGridFilterButton({
  activeCount = 0,
  disabled,
  onClick,
}: DataGridFilterButtonProps) {
  return (
    <DataGridButton
      variant={activeCount > 0 ? "primary" : "default"}
      disabled={disabled}
      leftIcon={<DataGridIcon name="filter" />}
      onClick={onClick}
    >
      <span>فیلترها</span>

      {activeCount > 0 ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="grid h-5 min-w-5 place-items-center rounded-full bg-white/20 px-1 text-[11px] font-black"
        >
          {activeCount.toLocaleString("fa-IR")}
        </motion.span>
      ) : null}
    </DataGridButton>
  );
}
