import type { CSSProperties, ReactNode } from "react";

export type RowActionVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "ghost";

export interface RowAction<TRow = unknown> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  title?: string;
  variant?: RowActionVariant;
  disabled?: boolean | ((row?: TRow) => boolean);
  hidden?: boolean | ((row?: TRow) => boolean);
  onClick?: (row?: TRow, rowIndex?: number) => void;
  className?: string;
  style?: CSSProperties;
}

export interface ActionsCellRendererProps<TRow = unknown> {
  value?: unknown;
  row?: TRow;
  rowIndex?: number;
  className?: string;
  style?: CSSProperties;
  actions: RowAction<TRow>[] | ((row?: TRow) => RowAction<TRow>[]);
  direction?: "horizontal" | "vertical";
  gap?: number;
  showLabels?: boolean;
  emptyValue?: ReactNode;
}

const variantStyles: Record<RowActionVariant, CSSProperties> = {
  default: {
    color: "#374151",
    backgroundColor: "#f3f4f6",
  },
  primary: {
    color: "#1d4ed8",
    backgroundColor: "#dbeafe",
  },
  success: {
    color: "#166534",
    backgroundColor: "#dcfce7",
  },
  warning: {
    color: "#92400e",
    backgroundColor: "#fef3c7",
  },
  danger: {
    color: "#991b1b",
    backgroundColor: "#fee2e2",
  },
  ghost: {
    color: "#374151",
    backgroundColor: "transparent",
  },
};

function resolveBoolean<TRow>(
  value: boolean | ((row?: TRow) => boolean) | undefined,
  row?: TRow,
): boolean {
  if (typeof value === "function") {
    return value(row);
  }

  return Boolean(value);
}

export function ActionsCellRenderer<TRow = unknown>({
  row,
  rowIndex,
  className,
  style,
  actions,
  direction = "horizontal",
  gap = 6,
  showLabels = true,
  emptyValue = "—",
}: ActionsCellRendererProps<TRow>) {
  const resolvedActions =
    typeof actions === "function" ? actions(row) : actions;

  const visibleActions = resolvedActions.filter(
    (action) => !resolveBoolean(action.hidden, row),
  );

  if (!visibleActions.length) {
    return (
      <span className={className} style={style}>
        {emptyValue}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: direction === "vertical" ? "column" : "row",
        alignItems: direction === "vertical" ? "stretch" : "center",
        gap,
        ...style,
      }}
    >
      {visibleActions.map((action) => {
        const disabled = resolveBoolean(action.disabled, row);
        const variant = action.variant ?? "default";

        return (
          <button
            key={action.id}
            type="button"
            className={action.className}
            disabled={disabled}
            title={action.title}
            onClick={(event) => {
              event.stopPropagation();

              if (!disabled) {
                action.onClick?.(row, rowIndex);
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              border: 0,
              borderRadius: 6,
              padding: showLabels ? "4px 8px" : 4,
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.4,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
              whiteSpace: "nowrap",
              ...variantStyles[variant],
              ...action.style,
            }}
          >
            {action.icon}
            {showLabels ? action.label : null}
          </button>
        );
      })}
    </span>
  );
}

export default ActionsCellRenderer;
