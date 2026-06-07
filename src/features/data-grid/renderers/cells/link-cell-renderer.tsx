import type { CSSProperties, ReactNode } from "react";

export interface LinkCellRendererProps<TRow = unknown> {
  value: unknown;
  row?: TRow;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  label?: ReactNode;
  href?: string | ((value: unknown, row?: TRow) => string);
  target?: "_self" | "_blank" | "_parent" | "_top";
  rel?: string;
  prefixProtocol?: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    value: unknown,
    row?: TRow,
  ) => void;
}

function normalizeUrl(value: unknown, prefixProtocol: boolean): string {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (!prefixProtocol) {
    return trimmed;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function LinkCellRenderer<TRow = unknown>({
  value,
  row,
  className,
  style,
  emptyValue = "—",
  label,
  href,
  target = "_blank",
  rel,
  prefixProtocol = true,
  onClick,
}: LinkCellRendererProps<TRow>) {
  const url =
    typeof href === "function"
      ? href(value, row)
      : (href ?? normalizeUrl(value, prefixProtocol));

  if (!url) {
    return (
      <span className={className} style={style}>
        {emptyValue}
      </span>
    );
  }

  const resolvedRel =
    rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

  return (
    <a
      className={className}
      style={{
        color: "#2563eb",
        textDecoration: "none",
        ...style,
      }}
      href={url}
      target={target}
      rel={resolvedRel}
      title={url}
      onClick={(event) => onClick?.(event, value, row)}
    >
      {label ?? String(value)}
    </a>
  );
}

export default LinkCellRenderer;
