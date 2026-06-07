import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type DateRangeFilterMode = "date" | "datetime-local" | "time" | "month";

export interface DateRangeFilterValue {
  from?: string | null;
  to?: string | null;
}

export interface DateRangeFilterProps<TRow = unknown> {
  value?: DateRangeFilterValue | null;
  row?: TRow;
  columnId?: string;

  onChange: (value: DateRangeFilterValue | null) => void;
  onApply?: (value: DateRangeFilterValue | null) => void;
  onClear?: () => void;

  className?: string;
  style?: CSSProperties;

  inputClassName?: string;
  inputStyle?: CSSProperties;

  buttonClassName?: string;
  buttonStyle?: CSSProperties;

  mode?: DateRangeFilterMode;

  fromPlaceholder?: string;
  toPlaceholder?: string;

  disabled?: boolean;
  readOnly?: boolean;

  min?: string;
  max?: string;
  step?: number;

  showApplyButton?: boolean;
  showClearButton?: boolean;

  applyLabel?: ReactNode;
  clearLabel?: ReactNode;

  commitOnEnter?: boolean;
  clearOnEscape?: boolean;

  emptyAsNull?: boolean;

  error?: ReactNode;
  helperText?: ReactNode;

  invalidRangeMessage?: ReactNode;
  minLimitMessage?: ReactNode;
  maxLimitMessage?: ReactNode;

  validate?: (
    value: DateRangeFilterValue | null,
    row?: TRow,
  ) => ReactNode | null | undefined;
}

function normalizeDateValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return String(value);
}

function normalizeDateRangeValue(
  value: DateRangeFilterValue | null | undefined,
): DateRangeFilterValue {
  return {
    from: normalizeDateValue(value?.from),
    to: normalizeDateValue(value?.to),
  };
}

function normalizeOutputValue(
  value: DateRangeFilterValue,
  emptyAsNull: boolean,
): DateRangeFilterValue | null {
  const from = normalizeDateValue(value.from);
  const to = normalizeDateValue(value.to);

  if (emptyAsNull && !from && !to) {
    return null;
  }

  return {
    from,
    to,
  };
}

export function DateRangeFilter<TRow = unknown>({
  value,
  row,

  onChange,
  onApply,
  onClear,

  className,
  style,

  inputClassName,
  inputStyle,

  buttonClassName,
  buttonStyle,

  mode = "date",

  fromPlaceholder = "از تاریخ",
  toPlaceholder = "تا تاریخ",

  disabled = false,
  readOnly = false,

  min,
  max,
  step,

  showApplyButton = false,
  showClearButton = true,

  applyLabel = "اعمال",
  clearLabel = "پاک کردن",

  commitOnEnter = true,
  clearOnEscape = true,

  emptyAsNull = true,

  error,
  helperText,

  invalidRangeMessage = "بازه تاریخ نامعتبر است",
  minLimitMessage,
  maxLimitMessage,

  validate,
}: DateRangeFilterProps<TRow>) {
  const rangeValue = normalizeDateRangeValue(value);
  const outputValue = normalizeOutputValue(rangeValue, emptyAsNull);

  const validationError = (() => {
    if (rangeValue.from && rangeValue.to && rangeValue.from > rangeValue.to) {
      return invalidRangeMessage;
    }

    if (rangeValue.from && min && rangeValue.from < min) {
      return minLimitMessage ?? `حداقل مقدار مجاز ${min} است`;
    }

    if (rangeValue.to && max && rangeValue.to > max) {
      return maxLimitMessage ?? `حداکثر مقدار مجاز ${max} است`;
    }

    return validate?.(outputValue, row);
  })();

  const resolvedError = error ?? validationError;

  const emitChange = (nextValue: DateRangeFilterValue) => {
    onChange(normalizeOutputValue(nextValue, emptyAsNull));
  };

  const handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }

    emitChange({
      ...rangeValue,
      from: event.target.value || null,
    });
  };

  const handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }

    emitChange({
      ...rangeValue,
      to: event.target.value || null,
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
            backgroundColor: disabled ? "#f3f4f6" : "#fff",
            color: "#111827",
            ...inputStyle,
          }}
          type={mode}
          value={rangeValue.from ?? ""}
          placeholder={fromPlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          step={step}
          onChange={handleFromChange}
          onKeyDown={handleKeyDown}
        />

        <span
          style={{
            color: "#6b7280",
            fontSize: 13,
            userSelect: "none",
          }}
        >
          —
        </span>

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
            backgroundColor: disabled ? "#f3f4f6" : "#fff",
            color: "#111827",
            ...inputStyle,
          }}
          type={mode}
          value={rangeValue.to ?? ""}
          placeholder={toPlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          step={step}
          onChange={handleToChange}
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

export default DateRangeFilter;
