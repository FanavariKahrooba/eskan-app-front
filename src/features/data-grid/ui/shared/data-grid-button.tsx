import type { ButtonHTMLAttributes, ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";

export type DataGridButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "success";

export type DataGridButtonSize = "sm" | "md" | "lg" | "icon";

export interface DataGridButtonProps extends HTMLMotionProps<"button"> {
  variant?: DataGridButtonVariant;
  size?: DataGridButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

const variantClass: Record<DataGridButtonVariant, string> = {
  default:
    "bg-white/80 text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
  primary:
    "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white border border-indigo-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30",
  secondary:
    "bg-slate-900 text-white border border-slate-800 shadow-lg shadow-slate-900/10 hover:bg-slate-800",
  danger:
    "bg-gradient-to-r from-rose-600 to-red-600 text-white border border-rose-500 shadow-lg shadow-rose-500/20",
  ghost:
    "bg-transparent text-slate-600 border border-transparent hover:bg-slate-100",
  success:
    "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-500 shadow-lg shadow-emerald-500/20",
};

const sizeClass: Record<DataGridButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-xl",
  md: "h-10 px-4 text-sm rounded-2xl",
  lg: "h-12 px-5 text-base rounded-2xl",
  icon: "h-9 w-9 p-0 rounded-xl",
};

export function DataGridButton({
  children,
  variant = "default",
  size = "md",
  leftIcon,
  rightIcon,
  loading,
  disabled,
  className = "",
  type = "button",
  ...props
}: DataGridButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { y: -1, scale: 1.015 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
        "transition-all duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}

      {children}

      {rightIcon}
    </motion.button>
  );
}
