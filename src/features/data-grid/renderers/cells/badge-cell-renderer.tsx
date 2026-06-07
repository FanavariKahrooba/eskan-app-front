import type { CSSProperties, ReactNode } from "react";

export type BadgeCellColor =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

export interface BadgeCellOption {
  label?: ReactNode;
  color?: BadgeCellColor;
  className?: string;
  style?: CSSProperties;
}

export interface BadgeCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  options?: Record<string, BadgeCellOption | string>;
  getLabel?: (value: unknown) => ReactNode;
  getColor?: (value: unknown) => BadgeCellColor;
  pill?: boolean;
}

const colorStyles: Record<BadgeCellColor, CSSProperties> = {
  default: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },
  primary: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  warning: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  danger: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  info: {
    backgroundColor: "#cffafe",
    color: "#155e75",
  },
  muted: {
    backgroundColor: "#e5e7eb",
    color: "#4b5563",
  },
};

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function BadgeCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  options,
  getLabel,
  getColor,
  pill = true,
}: BadgeCellRendererProps) {
  const key = stringifyValue(value);

  if (!key) {
    return (
      <span className={className} style={style}>
        {emptyValue}
      </span>
    );
  }

  const option = options?.[key];

  const optionObject: BadgeCellOption | undefined =
    typeof option === "string" ? { label: option } : option;

  const label = getLabel ? getLabel(value) : (optionObject?.label ?? key);

  const color = getColor ? getColor(value) : (optionObject?.color ?? "default");

  return (
    <span
      className={[className, optionObject?.className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        borderRadius: pill ? 999 : 6,
        padding: "2px 8px",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
        ...colorStyles[color],
        ...optionObject?.style,
        ...style,
      }}
      title={key}
    >
      {label}
    </span>
  );
}

export default BadgeCellRenderer;
