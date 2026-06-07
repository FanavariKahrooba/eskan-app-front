import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface NumberRangeFilterValue {
  min?: number | null;
  max?: number | null;
}

export interface NumberRangeFilterProps<TRow = unknown> {
  value?: NumberRangeFilterValue | null;
  row?: TRow;
  columnId?: string;

  onChange: (value: NumberRangeFilterValue | null) => void;
  onApply?: (value: NumberRangeFilterValue | null) => void;
  onClear?: () => void;

  className?: string;
  style?: CSSProperties;

  inputClassName?: string;
  inputStyle?: CSSProperties;

  buttonClassName?: string;
  buttonStyle?: CSSProperties;

  minPlaceholder?: string;
  maxPlaceholder?: string;

  disabled?: boolean;
  readOnly?: boolean;

  min?: number;
  max?: number;
  step?: number;
  integerOnly?: boolean;

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
    value: NumberRangeFilterValue | null,
    row?: TRow,
  ) => ReactNode | null | undefined;
}

function normalizeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeNumberRangeValue(
  value: NumberRangeFilterValue | null | undefined,
): NumberRangeFilterValue {
  return {
    min: normalizeNumber(value?.min),
    max: normalizeNumber(value?.max),
  };
}

function numberToInputValue(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function normalizeOutputValue(
  value: NumberRangeFilterValue,
  emptyAsNull: boolean,
): NumberRangeFilterValue | null {
  const min = normalizeNumber(value.min);
  const max = normalizeNumber(value.max);

  if (emptyAsNull && min === null && max === null) {
    return null;
  }

  return {
    min,
    max,
  };
}

export function NumberRangeFilter<TRow = unknown>({
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

  minPlaceholder = "از",
  maxPlaceholder = "تا",

  disabled = false,
  readOnly = false,

  min,
  max,
  step = 1,
  integerOnly = false,

  showApplyButton = false,
  showClearButton = true,

  applyLabel = "اعمال",
  clearLabel = "پاک کردن",

  commitOnEnter = true,
  clearOnEscape = true,

  emptyAsNull = true,

  error,
  helperText,

  invalidRangeMessage = "بازه عددی نامعتبر است",
  minLimitMessage,
  maxLimitMessage,

  validate,
}: NumberRangeFilterProps<TRow>) {
  const rangeValue: any = normalizeNumberRangeValue(value);
  const outputValue = normalizeOutputValue(rangeValue, emptyAsNull);

  const validationError = (() => {
    if (
      rangeValue.min !== null &&
      rangeValue.max !== null &&
      rangeValue.min > rangeValue.max
    ) {
      return invalidRangeMessage;
    }

    if (rangeValue.min !== null && min !== undefined && rangeValue.min < min) {
      return minLimitMessage ?? `حداقل مقدار مجاز ${min} است`;
    }

    if (rangeValue.max !== null && max !== undefined && rangeValue.max > max) {
      return maxLimitMessage ?? `حداکثر مقدار مجاز ${max} است`;
    }

    return validate?.(outputValue, row);
  })();

  const resolvedError = error ?? validationError;

  const emitChange = (nextValue: NumberRangeFilterValue) => {
    onChange(normalizeOutputValue(nextValue, emptyAsNull));
  };

  const parseInputValue = (raw: string): number | null => {
    if (raw.trim() === "") {
      return null;
    }

    const parsed = integerOnly ? Number.parseInt(raw, 10) : Number(raw);

    if (!Number.isFinite(parsed)) {
      return null;
    }

    return parsed;
  };

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }

    emitChange({
      ...rangeValue,
      min: parseInputValue(event.target.value),
    });
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }

    emitChange({
      ...rangeValue,
      max: parseInputValue(event.target.value),
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
          type="number"
          value={numberToInputValue(rangeValue.min)}
          placeholder={minPlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          step={integerOnly ? 1 : step}
          inputMode={integerOnly ? "numeric" : "decimal"}
          onChange={handleMinChange}
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
          type="number"
          value={numberToInputValue(rangeValue.max)}
          placeholder={maxPlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          step={integerOnly ? 1 : step}
          inputMode={integerOnly ? "numeric" : "decimal"}
          onChange={handleMaxChange}
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

export default NumberRangeFilter;
