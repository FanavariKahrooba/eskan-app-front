// src/features/data-grid/ui/toolbar/global-search.tsx

"use client";

import { cn } from "../../core/utils/cn";
import { tableTheme } from "../../core/theme/tokens";

type GlobalSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function GlobalSearch({
  value,
  onChange,
  placeholder = "جستجو...",
}: GlobalSearchProps) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-10 w-full max-w-sm rounded-md px-3 text-sm outline-none transition-colors",
        tableTheme.input,
      )}
    />
  );
}
