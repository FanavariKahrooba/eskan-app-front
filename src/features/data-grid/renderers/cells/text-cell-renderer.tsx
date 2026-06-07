import type { CSSProperties, ReactNode } from "react";

export interface TextCellRendererProps<TRow = unknown> {
  value: unknown;
  row?: TRow;
  rowIndex?: number;
  columnId?: string;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  maxLength?: number;
  title?: string;
  transform?: (value: string, row?: TRow) => ReactNode;
}

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return String(value);
}

export function TextCellRenderer<TRow = unknown>({
  value,
  row,
  className,
  style,
  emptyValue = "—",
  maxLength,
  title,
  transform,
}: TextCellRendererProps<TRow>) {
  const rawText = normalizeText(value);

  if (!rawText) {
    return (
      <span className={className} style={style}>
        {emptyValue}
      </span>
    );
  }

  const displayText =
    typeof maxLength === "number" && maxLength > 0 && rawText.length > maxLength
      ? `${rawText.slice(0, maxLength)}…`
      : rawText;

  return (
    <span className={className} style={style} title={title ?? rawText}>
      {transform ? transform(rawText, row) : displayText}
    </span>
  );
}

export default TextCellRenderer;
