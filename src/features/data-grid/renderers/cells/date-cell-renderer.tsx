import type { CSSProperties, ReactNode } from "react";

export interface DateCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  invalidValue?: ReactNode;
  locale?: string;
  calendar?: string;
  numberingSystem?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  formatOptions?: Intl.DateTimeFormatOptions;
}

function toDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number" || typeof value === "string") {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function DateCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  invalidValue = "Invalid date",
  locale = "fa-IR",
  calendar,
  numberingSystem,
  dateStyle = "medium",
  formatOptions,
}: DateCellRendererProps) {
  const date = toDate(value);

  if (!date) {
    return (
      <span className={className} style={style}>
        {value === null || value === undefined || value === ""
          ? emptyValue
          : invalidValue}
      </span>
    );
  }

  const resolvedLocale = new Intl.Locale(locale, {
    calendar,
    numberingSystem,
  }).toString();

  const formatted = new Intl.DateTimeFormat(resolvedLocale, {
    dateStyle,
    ...formatOptions,
  }).format(date);

  return (
    <time
      className={className}
      style={style}
      dateTime={date.toISOString()}
      title={date.toISOString()}
    >
      {formatted}
    </time>
  );
}

export default DateCellRenderer;
