import {
  useEffect,
  useRef,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface TextEditorProps<TRow = unknown> {
  value: unknown;
  row?: TRow;
  rowIndex?: number;
  columnId?: string;

  onChange: (value: string) => void;
  onCommit?: (value: string) => void;
  onCancel?: () => void;

  className?: string;
  style?: CSSProperties;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  multiline?: boolean;
  rows?: number;

  minLength?: number;
  maxLength?: number;
  required?: boolean;

  trimOnCommit?: boolean;
  commitOnBlur?: boolean;
  commitOnEnter?: boolean;
  cancelOnEscape?: boolean;

  prefix?: ReactNode;
  suffix?: ReactNode;

  inputClassName?: string;
  inputStyle?: CSSProperties;

  error?: ReactNode;
  helperText?: ReactNode;

  validate?: (
    value: string,
    row?: TRow,
  ) => string | ReactNode | null | undefined;
}

function normalizeTextValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function TextEditor<TRow = unknown>({
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

  multiline = false,
  rows = 3,

  minLength,
  maxLength,
  required = false,

  trimOnCommit = false,
  commitOnBlur = true,
  commitOnEnter = true,
  cancelOnEscape = true,

  prefix,
  suffix,

  inputClassName,
  inputStyle,

  error,
  helperText,

  validate,
}: TextEditorProps<TRow>) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const textValue = normalizeTextValue(value);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const element = inputRef.current;

    if (!element) {
      return;
    }

    element.focus();
    element.select?.();
  }, [autoFocus]);

  const validationError = validate?.(textValue, row);
  const resolvedError = error ?? validationError;

  const commit = () => {
    const nextValue = trimOnCommit ? textValue.trim() : textValue;

    if (required && !nextValue) {
      return;
    }

    if (minLength !== undefined && nextValue.length < minLength) {
      return;
    }

    if (maxLength !== undefined && nextValue.length > maxLength) {
      return;
    }

    if (validationError) {
      return;
    }

    onCommit?.(nextValue);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === "Escape" && cancelOnEscape) {
      event.stopPropagation();
      onCancel?.();
      return;
    }

    if (
      event.key === "Enter" &&
      commitOnEnter &&
      !multiline &&
      !event.shiftKey
    ) {
      event.preventDefault();
      event.stopPropagation();
      commit();
    }

    if (event.key === "Enter" && commitOnEnter && multiline && event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
      commit();
    }
  };

  const commonInputStyle: CSSProperties = {
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
          alignItems: multiline ? "flex-start" : "center",
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

        {multiline ? (
          <textarea
            ref={(node) => {
              inputRef.current = node;
            }}
            className={inputClassName}
            style={{
              ...commonInputStyle,
              resize: "vertical",
            }}
            value={textValue}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            minLength={minLength}
            maxLength={maxLength}
            required={required}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (commitOnBlur) {
                commit();
              }
            }}
          />
        ) : (
          <input
            ref={(node) => {
              inputRef.current = node;
            }}
            className={inputClassName}
            style={commonInputStyle}
            type="text"
            value={textValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            minLength={minLength}
            maxLength={maxLength}
            required={required}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (commitOnBlur) {
                commit();
              }
            }}
          />
        )}

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

export default TextEditor;
