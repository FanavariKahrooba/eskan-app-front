import type { CSSProperties, ReactNode } from "react";

export interface PercentCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  invalidValue?: ReactNode;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  /**
   * اگر مقدار دیتابیس مثلا 25 باشد و منظور 25% باشد،
   * این گزینه را true کن.
   *
   * اگر مقدار دیتابیس 0.25 است و منظور 25% است،
   * این گزینه false بماند.
   */
  valueIsWholePercent?: boolean;
  showSign?: boolean;
}

function toPercentNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace("%", "").replace(/,/g, "");
    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function PercentCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  invalidValue = "Invalid percent",
  locale = "fa-IR",
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
  valueIsWholePercent = false,
  showSign = false,
}: PercentCellRendererProps) {
  const numberValue = toPercentNumber(value);

  if (numberValue === null) {
    return (
      <span className={className} style={style}>
        {value === null || value === undefined || value === ""
          ? emptyValue
          : invalidValue}
      </span>
    );
  }

  const normalizedValue = valueIsWholePercent ? numberValue / 100 : numberValue;

  const formatted = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits,
    signDisplay: showSign ? "exceptZero" : "auto",
  }).format(normalizedValue);

  return (
    <span className={className} style={style} title={String(numberValue)}>
      {formatted}
    </span>
  );
}

export default PercentCellRenderer;
