import { motion } from "framer-motion";
import type { MouseEventHandler, PointerEventHandler } from "react";

export interface ColumnResizeHandleProps {
  disabled?: boolean;
  active?: boolean;
  className?: string;
  onResizeStart?: PointerEventHandler<HTMLDivElement>;
  onDoubleClick?: MouseEventHandler<HTMLDivElement>;
}
export function ColumnResizeHandle({
  disabled,
  active,
  className = "",
  onResizeStart,
  onDoubleClick,
}: ColumnResizeHandleProps) {
  return (
    <motion.div
      role="separator"
      aria-orientation="vertical"
      tabIndex={disabled ? -1 : 0}
      whileHover={!disabled ? { scaleX: 1.35 } : undefined}
      onPointerDown={(event) => {
        if (disabled) return;
        event.preventDefault();
        event.stopPropagation();
        onResizeStart?.(event);
      }}
      onDoubleClick={(event) => {
        if (disabled) return;
        event.preventDefault();
        event.stopPropagation();
        onDoubleClick?.(event);
      }}
      className={[
        "absolute -end-1 top-1/2 h-8 w-2 -translate-y-1/2 rounded-full",
        "transition-colors",
        disabled ? "cursor-default opacity-0" : "cursor-col-resize",
        active
          ? "bg-indigo-500/50"
          : "bg-transparent hover:bg-indigo-500/25 group-hover:bg-slate-300/60",
        className,
      ].join(" ")}
    />
  );
}
