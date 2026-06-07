import type { CSSProperties, ReactNode } from "react";

export interface TagItem {
  label: ReactNode;
  value?: string | number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  style?: CSSProperties;
}

export interface TagsCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  separator?: string;
  maxVisible?: number;
  getTag?: (item: unknown, index: number) => TagItem;
}

function normalizeTags(value: unknown, separator: string): unknown[] {
  if (value === null || value === undefined || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(separator)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [value];
}

function defaultGetTag(item: unknown): TagItem {
  if (item && typeof item === "object" && "label" in item) {
    return item as TagItem;
  }

  return {
    label: String(item),
    value:
      typeof item === "string" || typeof item === "number" ? item : undefined,
  };
}

export function TagsCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  separator = ",",
  maxVisible,
  getTag = defaultGetTag,
}: TagsCellRendererProps) {
  const rawTags = normalizeTags(value, separator);

  if (!rawTags.length) {
    return (
      <span className={className} style={style}>
        {emptyValue}
      </span>
    );
  }

  const visibleTags =
    typeof maxVisible === "number" && maxVisible > 0
      ? rawTags.slice(0, maxVisible)
      : rawTags;

  const hiddenCount = rawTags.length - visibleTags.length;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 4,
        ...style,
      }}
    >
      {visibleTags.map((item, index) => {
        const tag = getTag(item, index);

        return (
          <span
            key={`${String(tag.value ?? tag.label)}-${index}`}
            className={tag.className}
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 999,
              padding: "2px 8px",
              fontSize: 12,
              fontWeight: 500,
              backgroundColor: tag.backgroundColor ?? "#f3f4f6",
              color: tag.color ?? "#374151",
              whiteSpace: "nowrap",
              ...tag.style,
            }}
            title={String(tag.value ?? tag.label)}
          >
            {tag.label}
          </span>
        );
      })}

      {hiddenCount > 0 ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: 12,
            backgroundColor: "#e5e7eb",
            color: "#374151",
          }}
        >
          +{hiddenCount}
        </span>
      ) : null}
    </span>
  );
}

export default TagsCellRenderer;
