"use client"
import type { HTMLAttributes, ReactNode } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface DataGridHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

export function DataGridHeader({
  children,
  className,
  ...props
}: DataGridHeaderProps) {
  return (
    <thead className={cn("bg-slate-50 text-slate-700", className)} {...props}>
      {children}
    </thead>
  );
}
