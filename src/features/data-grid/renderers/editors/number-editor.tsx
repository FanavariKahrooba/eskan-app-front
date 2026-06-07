import {
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface NumberEditorProps<TRow = unknown> {
  value: unknown;
  row?: TRow;
  rowIndex?: number;
  columnId?: string;

  onChange: (value: number | null) => void;
  onCommit?: (value: number | null) => void;
  onCancel?: () => void;

  className?: string;
  style?: CSSProperties;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  min?: number;
  max?: number;
  step?: number;
  required?: boolean;

  allowNull?: boolean;
  integerOnly?: boolean;

  commitOnBlur?: boolean;
  commitOnEnter?: boolean;
  cancelOnEscape?: boolean;

  prefix?: ReactNode;
  suffix?: ReactNode;

  inputClassName?: string;
  inputStyle?: CSSProperties;

  error?: ReactNode;
  helperText?: ReactNode;

  invalidNumberMessage?: ReactNode;
  minMessage?: ReactNode;
  maxMessage?: ReactNode;
  requiredMessage?: ReactNode;

  validate?: (
    value: number | null,
    row?: TRow,
  ) => string | ReactNode | null | undefined;
}

function normalizeNumberValue(value: unknown): number | null {
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

function numberToInputValue(value: number | null): string {
  if (value === null) {
    return "";
  }

  return String(value);
}

export function NumberEditor<TRow = unknown>({
  value,
  row,
  onChange,
  onCommit,
  onCancel,

  className,
  style,

  placeholder,
  disabled = false,
  readOnly = false,
  autoFocus = true,

  min,
  max,
  step = 1,
  required = false,

  allowNull = true,
  integerOnly = false,

  commitOnBlur = true,
  commitOnEnter = true,
  cancelOnEscape = true,

  prefix,
  suffix,

  inputClassName,
  inputStyle,

  error,
  helperText,

  invalidNumberMessage = "عدد نامعتبر است",
  minMessage,
  maxMessage,
  requiredMessage = "این فیلد الزامی است",

  validate,
}: NumberEditorProps<TRow>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const numberValue = normalizeNumberValue(value);
  const inputValue = numberToInputValue(numberValue);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const element = inputRef.current;

    if (!element) {
      return;
    }

    element.focus();
    element.select();
  }, [autoFocus]);

  const validationError = useMemo(() => {
    if (required && numberValue === null) {
      return requiredMessage;
    }

    if (!allowNull && numberValue === null) {
      return requiredMessage;
    }

    if (numberValue !== null && integerOnly && !Number.isInteger(numberValue)) {
      return invalidNumberMessage;
    }

    if (numberValue !== null && min !== undefined && numberValue < min) {
      return minMessage ?? `حداقل مقدار مجاز ${min} است`;
    }

    if (numberValue !== null && max !== undefined && numberValue > max) {
      return maxMessage ?? `حداکثر مقدار مجاز ${max} است`;
    }

    return validate?.(numberValue, row);
  }, [
    allowNull,
    integerOnly,
    invalidNumberMessage,
    max,
    maxMessage,
    min,
    minMessage,
    numberValue,
    required,
    requiredMessage,
    row,
    validate,
  ]);

  const resolvedError = error ?? validationError;

  const commit = () => {
    if (validationError) {
      return;
    }

    onCommit?.(numberValue);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;

    if (raw === "") {
      onChange(null);
      return;
    }

    const parsed = integerOnly ? Number.parseInt(raw, 10) : Number(raw);

    if (!Number.isFinite(parsed)) {
      return;
    }

    onChange(parsed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && cancelOnEscape) {
      event.stopPropagation();
      onCancel?.();
      return;
    }

    if (event.key === "Enter" && commitOnEnter) {
      event.preventDefault();
      event.stopPropagation();
      commit();
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
        {prefix ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#6b7280",
              flexShrink: 0,
            }}
          >
            {prefix}
          </span>
        ) : null}

        <input
          ref={inputRef}
          className={inputClassName}
          style={{
            width: "100%",
            minWidth: 0,
            border: "1px solid",
            borderColor: resolvedError ? "#ef4444" : "#d1d5db",
            borderRadius: 6,
            padding: "6px 8px",
            fontSize: 14,
            lineHeight: 1.5,
            outline: "none",
            backgroundColor: disabled ? "#f3f4f6" : "#fff",
            color: "#111827",
            ...inputStyle,
          }}
          type="number"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          step={integerOnly ? 1 : step}
          required={required}
          inputMode={integerOnly ? "numeric" : "decimal"}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (commitOnBlur) {
              commit();
            }
          }}
        />

        {suffix ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#6b7280",
              flexShrink: 0,
            }}
          >
            {suffix}
          </span>
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

export default NumberEditor;
