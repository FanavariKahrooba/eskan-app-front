import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type BooleanFilterValue = boolean | null;

export interface BooleanFilterOption {
  label: ReactNode;
  value: BooleanFilterValue;
}

export interface BooleanFilterProps<TRow = unknown> {
  value?: BooleanFilterValue;
  row?: TRow;
  columnId?: string;

  onChange: (value: BooleanFilterValue) => void;
  onApply?: (value: BooleanFilterValue) => void;
  onClear?: () => void;

  className?: string;
  style?: CSSProperties;

  selectClassName?: string;
  selectStyle?: CSSProperties;

  buttonClassName?: string;
  buttonStyle?: CSSProperties;

  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  trueLabel?: ReactNode;
  falseLabel?: ReactNode;
  allLabel?: ReactNode;

  options?: BooleanFilterOption[];

  showApplyButton?: boolean;
  showClearButton?: boolean;

  applyLabel?: ReactNode;
  clearLabel?: ReactNode;

  commitOnChange?: boolean;
  commitOnEnter?: boolean;
  clearOnEscape?: boolean;

  error?: ReactNode;
  helperText?: ReactNode;

  validate?: (
    value: BooleanFilterValue,
    row?: TRow,
  ) => ReactNode | null | undefined;
}

function encodeBooleanValue(value: BooleanFilterValue): string {
  if (value === true) {
    return "true";
  }

  if (value === false) {
    return "false";
  }

  return "";
}

function decodeBooleanValue(value: string): BooleanFilterValue {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return null;
}

function renderOptionLabel(label: ReactNode, fallback: string): string {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }

  return fallback;
}

export function BooleanFilter<TRow = unknown>({
  value = null,
  row,

  onChange,
  onApply,
  onClear,

  className,
  style,

  selectClassName,
  selectStyle,

  buttonClassName,
  buttonStyle,

  disabled = false,
  readOnly = false,
  autoFocus = false,

  trueLabel = "بله",
  falseLabel = "خیر",
  allLabel = "همه",

  options,

  showApplyButton = false,
  showClearButton = true,

  applyLabel = "اعمال",
  clearLabel = "پاک کردن",

  commitOnChange = true,
  commitOnEnter = true,
  clearOnEscape = true,

  error,
  helperText,

  validate,
}: BooleanFilterProps<TRow>) {
  const resolvedOptions = options ?? [
    {
      label: allLabel,
      value: null,
    },
    {
      label: trueLabel,
      value: true,
    },
    {
      label: falseLabel,
      value: false,
    },
  ];

  const validationError = validate?.(value, row);
  const resolvedError = error ?? validationError;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (readOnly) {
      return;
    }

    const nextValue = decodeBooleanValue(event.target.value);

    onChange(nextValue);

    if (commitOnChange) {
      onApply?.(nextValue);
    }
  };

  const clear = () => {
    onChange(null);
    onClear?.();
  };

  const apply = () => {
    if (validationError) {
      return;
    }

    onApply?.(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSelectElement>) => {
    if (event.key === "Enter" && commitOnEnter) {
      event.preventDefault();
      event.stopPropagation();
      apply();
      return;
    }

    if (event.key === "Escape" && clearOnEscape) {
      event.preventDefault();
      event.stopPropagation();
      clear();
    }
  };

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
        ...style,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          width: "100%",
        }}
      >
        <select
          className={selectClassName}
          style={{
            width: "100%",
            minWidth: 0,
            border: "1px solid",
            borderColor: resolvedError ? "#ef4444" : "#d1d5db",
            borderRadius: 6,
            padding: "6px 8px",
            fontSize: 13,
            lineHeight: 1.5,
            outline: "none",
            backgroundColor: disabled ? "#f3f4f6" : "#fff",
            color: "#111827",
            cursor: disabled || readOnly ? "not-allowed" : "pointer",
            ...selectStyle,
          }}
          value={encodeBooleanValue(value)}
          disabled={disabled}
          aria-readonly={readOnly}
          autoFocus={autoFocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        >
          {resolvedOptions.map((option) => (
            <option
              key={encodeBooleanValue(option.value)}
              value={encodeBooleanValue(option.value)}
            >
              {renderOptionLabel(
                option.label,
                option.value === null ? "همه" : String(option.value),
              )}
            </option>
          ))}
        </select>

        {showApplyButton ? (
          <button
            type="button"
            className={buttonClassName}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              lineHeight: 1.5,
              backgroundColor: "#fff",
              color: "#111827",
              cursor: disabled ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              ...buttonStyle,
            }}
            disabled={disabled}
            onClick={apply}
          >
            {applyLabel}
          </button>
        ) : null}

        {showClearButton ? (
          <button
            type="button"
            className={buttonClassName}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              lineHeight: 1.5,
              backgroundColor: "#fff",
              color: "#374151",
              cursor: disabled ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              ...buttonStyle,
            }}
            disabled={disabled}
            onClick={clear}
          >
            {clearLabel}
          </button>
        ) : null}
      </span>

      {resolvedError ? (
        <span
          style={{
            color: "#dc2626",
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          {resolvedError}
        </span>
      ) : helperText ? (
        <span
          style={{
            color: "#6b7280",
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          {helperText}
        </span>
      ) : null}
    </span>
  );
}

export default BooleanFilter;
