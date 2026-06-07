import type { CSSProperties, ReactNode } from "react";

export interface CurrencyCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  invalidValue?: ReactNode;
  locale?: string;
  currency?: string;
  currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSign?: boolean;
}

function toCurrencyNumber(value: unknown): number | null {
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

export function CurrencyCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  invalidValue = "Invalid currency",
  locale = "fa-IR",
  currency = "IRR",
  currencyDisplay = "symbol",
  minimumFractionDigits,
  maximumFractionDigits,
  showSign = false,
}: CurrencyCellRendererProps) {
  const numberValue = toCurrencyNumber(value);

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
    style: "currency",
    currency,
    currencyDisplay,
    minimumFractionDigits,
    maximumFractionDigits,
    signDisplay: showSign ? "exceptZero" : "auto",
  }).format(numberValue);

  return (
    <span className={className} style={style} title={String(numberValue)}>
      {formatted}
    </span>
  );
}

export default CurrencyCellRenderer;
