import * as React from "react";
import { cn } from "../../lib/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "premium";

type BadgeSize = "sm" | "default" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground shadow-sm",

  secondary: "border-transparent bg-secondary text-secondary-foreground",

  outline: "border-border bg-background text-foreground",

  ghost: "border-transparent bg-muted/50 text-muted-foreground",

  destructive:
    "border-transparent bg-destructive text-destructive-foreground shadow-sm",

  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

  warning: "border-amber-500/20 bg-amber-500/10 text-amber-400",

  info: "border-sky-500/20 bg-sky-500/10 text-sky-400",

  premium:
    "border-transparent bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-sm shadow-violet-500/20",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  default: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

const dotClasses: Record<BadgeVariant, string> = {
  default: "bg-primary-foreground",
  secondary: "bg-secondary-foreground",
  outline: "bg-foreground",
  ghost: "bg-muted-foreground",
  destructive: "bg-destructive-foreground",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  info: "bg-sky-400",
  premium: "bg-white",
};

export function Badge({
  className,
  variant = "default",
  size = "default",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border font-medium leading-none",
        "transition-colors",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            dotClasses[variant],
          )}
        />
      )}
      {children}
    </div>
  );
}
