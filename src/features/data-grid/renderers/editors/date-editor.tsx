import {
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type DateEditorMode = "date" | "datetime-local" | "time" | "month";

export interface DateEditorProps<TRow = unknown> {
  value: unknown;
  row?: TRow;
  rowIndex?: number;
  columnId?: string;

  onChange: (value: string | null) => void;
  onCommit?: (value: string | null) => void;
  onCancel?: () => void;

  className?: string;
  style?: CSSProperties;

  mode?: DateEditorMode;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  min?: string;
  max?: string;
  step?: number;
  required?: boolean;
  allowNull?: boolean;

  commitOnBlur?: boolean;
  commitOnEnter?: boolean;
  cancelOnEscape?: boolean;

  inputClassName?: string;
  inputStyle?: CSSProperties;

  error?: ReactNode;
  helperText?: ReactNode;

  requiredMessage?: ReactNode;
  minMessage?: ReactNode;
  maxMessage?: ReactNode;

  validate?: (
    value: string | null,
    row?: TRow,
  ) => string | ReactNode | null | undefined;

  /**
   * اگر دیتای ورودی ISO کامل باشد، برای input استاندارد HTML
   * تبدیل می‌شود.
   */
  normalizeIsoValue?: boolean;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function dateToInputDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function dateToInputDateTimeLocal(date: Date): string {
  return `${dateToInputDate(date)}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}

function normalizeDateValue(
  value: unknown,
  mode: DateEditorMode,
  normalizeIsoValue: boolean,
): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    if (mode === "datetime-local") {
      return dateToInputDateTimeLocal(value);
    }

    if (mode === "time") {
      return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
    }

    if (mode === "month") {
      return `${value.getFullYear()}-${pad(value.getMonth() + 1)}`;
    }

    return dateToInputDate(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    if (!normalizeIsoValue) {
      return trimmed;
    }

    const date = new Date(trimmed);

    if (Number.isNaN(date.getTime())) {
      return trimmed;
    }

    if (mode === "datetime-local") {
      return dateToInputDateTimeLocal(date);
    }

    if (mode === "time") {
      if (/^\d{2}:\d{2}/.test(trimmed)) {
        return trimmed.slice(0, 5);
      }

      return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    if (mode === "month") {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
    }

    return dateToInputDate(date);
  }

  if (typeof value === "number") {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    if (mode === "datetime-local") {
      return dateToInputDateTimeLocal(date);
    }

    if (mode === "time") {
      return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    if (mode === "month") {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
    }

    return dateToInputDate(date);
  }

  return null;
}

export function DateEditor<TRow = unknown>({
  value,
  row,
  onChange,
  onCommit,
  onCancel,

  className,
  style,

  mode = "date",

  placeholder,
  disabled = false,
  readOnly = false,
  autoFocus = true,

  min,
  max,
  step,
  required = false,
  allowNull = true,

  commitOnBlur = true,
  commitOnEnter = true,
  cancelOnEscape = true,

  inputClassName,
  inputStyle,

  error,
  helperText,

  requiredMessage = "این فیلد الزامی است",
  minMessage,
  maxMessage,

  validate,

  normalizeIsoValue = true,
}: DateEditorProps<TRow>) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dateValue = normalizeDateValue(value, mode, normalizeIsoValue);
  const inputValue = dateValue ?? "";

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    inputRef.current?.focus();
  }, [autoFocus]);

  const validationError = useMemo(() => {
    if (required && !dateValue) {
      return requiredMessage;
    }

    if (!allowNull && !dateValue) {
      return requiredMessage;
    }

    if (dateValue && min && dateValue < min) {
      return minMessage ?? `حداقل مقدار مجاز ${min} است`;
    }

    if (dateValue && max && dateValue > max) {
      return maxMessage ?? `حداکثر مقدار مجاز ${max} است`;
    }

    return validate?.(dateValue, row);
  }, [
    allowNull,
    dateValue,
    max,
    maxMessage,
    min,
    minMessage,
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

    onCommit?.(dateValue);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (!nextValue) {
      onChange(null);
      return;
    }

    onChange(nextValue);
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
          cursor: disabled || readOnly ? "not-allowed" : undefined,
          ...inputStyle,
        }}
        type={mode}
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
        required={required}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (commitOnBlur) {
            commit();
          }
        }}
      />

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

export default DateEditor;
