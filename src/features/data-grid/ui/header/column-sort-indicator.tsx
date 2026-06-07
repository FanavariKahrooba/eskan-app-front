import { motion } from "framer-motion";
import { DataGridIcon } from "../shared";

export type ColumnSortDirection = "asc" | "desc" | false;

export interface ColumnSortIndicatorProps {
  direction?: ColumnSortDirection;
  active?: boolean;
  className?: string;
}

export function ColumnSortIndicator({
  direction = false,
  active,
  className = "",
}: ColumnSortIndicatorProps) {
  const isActive = active ?? Boolean(direction);

  return (
    <motion.span
      aria-hidden="true"
      animate={{
        opacity: isActive ? 1 : 0.35,
        rotate: direction === "desc" ? 180 : 0,
        scale: isActive ? 1 : 0.92,
      }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className={[
        "inline-grid h-5 w-5 place-items-center text-slate-400 transition-colors",
        isActive ? "text-indigo-600" : "group-hover:text-indigo-500",
        className,
      ].join(" ")}
    >
      <DataGridIcon
        name={direction === "desc" ? "sortDesc" : "sortAsc"}
        size={15}
      />
    </motion.span>
  );
}
