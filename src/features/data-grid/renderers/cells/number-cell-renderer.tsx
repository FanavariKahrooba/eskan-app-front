import type { CSSProperties, ReactNode } from "react";

export interface NumberCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  invalidValue?: ReactNode;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function NumberCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  locale = "fa-IR",
  minimumFractionDigits,
  maximumFractionDigits,
  useGrouping = true,
  prefix,
  suffix,
  invalidValue = "Invalid number",
}: NumberCellRendererProps) {
  const numberValue = toNumber(value);

  if (numberValue === null) {
    return (
      <span className={className} style={style}>
        {value === null || value === undefined || value === ""
          ? emptyValue
          : invalidValue}
      </span>
    );
  }

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping,
  }).format(numberValue);

  return (
    <span className={className} style={style} title={String(numberValue)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default NumberCellRenderer;
