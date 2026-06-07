import type { CSSProperties, ReactNode } from "react";

export interface BooleanCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  trueLabel?: ReactNode;
  falseLabel?: ReactNode;
  variant?: "text" | "badge" | "icon";
  trueIcon?: ReactNode;
  falseIcon?: ReactNode;
  trueClassName?: string;
  falseClassName?: string;
}

function toBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "y", "active", "enabled"].includes(normalized)) {
      return true;
    }

    if (
      ["false", "0", "no", "n", "inactive", "disabled"].includes(normalized)
    ) {
      return false;
    }
  }

  return null;
}

export function BooleanCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  trueLabel = "بله",
  falseLabel = "خیر",
  variant = "badge",
  trueIcon = "✓",
  falseIcon = "×",
  trueClassName,
  falseClassName,
}: BooleanCellRendererProps) {
  const boolValue = toBoolean(value);

  if (boolValue === null) {
    return (
      <span className={className} style={style}>
        {emptyValue}
      </span>
    );
  }

  const stateClassName = boolValue ? trueClassName : falseClassName;

  if (variant === "icon") {
    return (
      <span
        className={[className, stateClassName].filter(Boolean).join(" ")}
        style={style}
        aria-label={boolValue ? "true" : "false"}
        title={boolValue ? String(trueLabel) : String(falseLabel)}
      >
        {boolValue ? trueIcon : falseIcon}
      </span>
    );
  }

  if (variant === "text") {
    return (
      <span
        className={[className, stateClassName].filter(Boolean).join(" ")}
        style={style}
      >
        {boolValue ? trueLabel : falseLabel}
      </span>
    );
  }

  return (
    <span
      className={[className, stateClassName].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "2px 8px",
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: boolValue ? "#dcfce7" : "#fee2e2",
        color: boolValue ? "#166534" : "#991b1b",
        ...style,
      }}
    >
      {boolValue ? trueLabel : falseLabel}
    </span>
  );
}

export default BooleanCellRenderer;
