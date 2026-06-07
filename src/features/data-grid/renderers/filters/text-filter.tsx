import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type TextFilterOperator =
  | "contains"
  | "notContains"
  | "equals"
  | "notEquals"
  | "startsWith"
  | "endsWith"
  | "empty"
  | "notEmpty";

export interface TextFilterValue {
  operator: TextFilterOperator;
  value: string;
}

export interface TextFilterOperatorOption {
  label: ReactNode;
  value: TextFilterOperator;
}

export interface TextFilterProps<TRow = unknown> {
  value?: Partial<TextFilterValue> | null;
  row?: TRow;
  columnId?: string;

  onChange: (value: TextFilterValue | null) => void;
  onApply?: (value: TextFilterValue | null) => void;
  onClear?: () => void;

  className?: string;
  style?: CSSProperties;

  inputClassName?: string;
  inputStyle?: CSSProperties;

  selectClassName?: string;
  selectStyle?: CSSProperties;

  buttonClassName?: string;
  buttonStyle?: CSSProperties;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  defaultOperator?: TextFilterOperator;
  operators?: TextFilterOperatorOption[];

  showOperator?: boolean;
  showApplyButton?: boolean;
  showClearButton?: boolean;

  applyLabel?: ReactNode;
  clearLabel?: ReactNode;

  commitOnEnter?: boolean;
  clearOnEscape?: boolean;

  emptyAsNull?: boolean;

  error?: ReactNode;
  helperText?: ReactNode;

  validate?: (
    value: TextFilterValue | null,
    row?: TRow,
  ) => ReactNode | null | undefined;
}

export const defaultTextFilterOperators: TextFilterOperatorOption[] = [
  {
    label: "شامل",
    value: "contains",
  },
  {
    label: "شامل نباشد",
    value: "notContains",
  },
  {
    label: "برابر",
    value: "equals",
  },
  {
    label: "برابر نباشد",
    value: "notEquals",
  },
  {
    label: "شروع با",
    value: "startsWith",
  },
  {
    label: "پایان با",
    value: "endsWith",
  },
  {
    label: "خالی",
    value: "empty",
  },
  {
    label: "خالی نباشد",
    value: "notEmpty",
  },
];

function normalizeTextFilterValue(
  value: Partial<TextFilterValue> | null | undefined,
  defaultOperator: TextFilterOperator,
): TextFilterValue {
  return {
    operator: value?.operator ?? defaultOperator,
    value: value?.value ?? "",
  };
}

function shouldIgnoreInput(operator: TextFilterOperator): boolean {
  return operator === "empty" || operator === "notEmpty";
}

function normalizeOutputValue(
  value: TextFilterValue,
  emptyAsNull: boolean,
): TextFilterValue | null {
  if (shouldIgnoreInput(value.operator)) {
    return {
      operator: value.operator,
      value: "",
    };
  }

  if (emptyAsNull && value.value.trim() === "") {
    return null;
  }

  return value;
}

function renderOptionLabel(label: ReactNode, fallback: string): string {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }

  return fallback;
}

export function TextFilter<TRow = unknown>({
  value,
  row,

  onChange,
  onApply,
  onClear,

  className,
  style,

  inputClassName,
  inputStyle,

  selectClassName,
  selectStyle,

  buttonClassName,
  buttonStyle,

  placeholder = "جستجو...",
  disabled = false,
  readOnly = false,
  autoFocus = false,

  defaultOperator = "contains",
  operators = defaultTextFilterOperators,

  showOperator = true,
  showApplyButton = false,
  showClearButton = true,

  applyLabel = "اعمال",
  clearLabel = "پاک کردن",

  commitOnEnter = true,
  clearOnEscape = true,

  emptyAsNull = true,

  error,
  helperText,

  validate,
}: TextFilterProps<TRow>) {
  const filterValue = normalizeTextFilterValue(value, defaultOperator);
  const outputValue = normalizeOutputValue(filterValue, emptyAsNull);
  const validationError = validate?.(outputValue, row);
  const resolvedError = error ?? validationError;

  const emitChange = (nextValue: TextFilterValue) => {
    onChange(normalizeOutputValue(nextValue, emptyAsNull));
  };

  const handleOperatorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (readOnly) {
      return;
    }

    const nextOperator = event.target.value as TextFilterOperator;

    emitChange({
      operator: nextOperator,
      value: shouldIgnoreInput(nextOperator) ? "" : filterValue.value,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }

    emitChange({
      ...filterValue,
      value: event.target.value,
    });
  };

  const clear = () => {
    onChange(null);
    onClear?.();
  };

  const apply = () => {
    if (validationError) {
      return;
    }

    onApply?.(outputValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
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

  const inputDisabled = disabled || shouldIgnoreInput(filterValue.operator);

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
        {showOperator ? (
          <select
            className={selectClassName}
            style={{
              minWidth: 120,
              border: "1px solid #d1d5db",
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
            value={filterValue.operator}
            disabled={disabled}
            aria-readonly={readOnly}
            onChange={handleOperatorChange}
          >
            {operators.map((operator) => (
              <option key={operator.value} value={operator.value}>
                {renderOptionLabel(operator.label, operator.value)}
              </option>
            ))}
          </select>
        ) : null}

        <input
          className={inputClassName}
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
            backgroundColor: inputDisabled ? "#f3f4f6" : "#fff",
            color: "#111827",
            ...inputStyle,
          }}
          type="text"
          value={filterValue.value}
          placeholder={placeholder}
          disabled={inputDisabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

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

export default TextFilter;
