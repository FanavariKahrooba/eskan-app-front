// src/features/data-grid/ui/table/resize-handle.tsx

"use client";

import { motion } from "framer-motion";
import { cn } from "../../core/utils/cn";
import { tableTheme } from "../../core/theme/tokens";

type ResizeHandleProps = {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export function ResizeHandle({ onMouseDown }: ResizeHandleProps) {
  return (
    <motion.div
      layout
      onMouseDown={onMouseDown}
      className={cn(
        "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none",
        tableTheme.resizeHandle,
      )}
      whileHover={{ scaleX: 1.5 }}
      whileTap={{ scaleX: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
}
