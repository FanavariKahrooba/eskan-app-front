import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export interface JsonCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  invalidValue?: ReactNode;
  pretty?: boolean;
  maxLength?: number;
  expandable?: boolean;
}

function stringifyJson(value: unknown, pretty: boolean): string | null {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  try {
    if (typeof value === "string") {
      const parsed = JSON.parse(value);

      return JSON.stringify(parsed, null, pretty ? 2 : 0);
    }

    return JSON.stringify(value, null, pretty ? 2 : 0);
  } catch {
    return null;
  }
}

export function JsonCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  invalidValue = "Invalid JSON",
  pretty = true,
  maxLength = 120,
  expandable = true,
}: JsonCellRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const json = stringifyJson(value, pretty);

  if (json === "") {
    return (
      <span className={className} style={style}>
        {emptyValue}
      </span>
    );
  }

  if (json === null) {
    return (
      <span className={className} style={style}>
        {invalidValue}
      </span>
    );
  }

  const shouldTruncate =
    !expanded &&
    typeof maxLength === "number" &&
    maxLength > 0 &&
    json.length > maxLength;

  const displayText = shouldTruncate ? `${json.slice(0, maxLength)}…` : json;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: 6,
        maxWidth: "100%",
        ...style,
      }}
    >
      <code
        style={{
          display: "inline-block",
          maxWidth: "100%",
          whiteSpace: expanded ? "pre-wrap" : "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 12,
          backgroundColor: "#f3f4f6",
          color: "#111827",
          borderRadius: 6,
          padding: "2px 6px",
        }}
        title={json}
      >
        {displayText}
      </code>

      {expandable && json.length > maxLength ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            border: 0,
            background: "transparent",
            color: "#2563eb",
            cursor: "pointer",
            padding: 0,
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          {expanded ? "کمتر" : "بیشتر"}
        </button>
      ) : null}
    </span>
  );
}

export default JsonCellRenderer;
