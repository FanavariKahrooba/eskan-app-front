import {
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type SelectEditorValue = string | number | boolean | null;

export interface SelectEditorOption {
  label: ReactNode;
  value: Exclude<SelectEditorValue, null>;
  disabled?: boolean;
  title?: string;
  group?: string;
  meta?: Record<string, unknown>;
}

export interface SelectEditorProps<TRow = unknown> {
  value: unknown;
  row?: TRow;
  rowIndex?: number;
  columnId?: string;

  options: SelectEditorOption[];

  onChange: (value: SelectEditorValue) => void;
  onCommit?: (value: SelectEditorValue) => void;
  onCancel?: () => void;

  className?: string;
  style?: CSSProperties;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  required?: boolean;
  allowNull?: boolean;

  commitOnChange?: boolean;
  commitOnBlur?: boolean;
  commitOnEnter?: boolean;
  cancelOnEscape?: boolean;

  selectClassName?: string;
  selectStyle?: CSSProperties;

  error?: ReactNode;
  helperText?: ReactNode;

  requiredMessage?: ReactNode;

  validate?: (
    value: SelectEditorValue,
    row?: TRow,
  ) => string | ReactNode | null | undefined;
}

function normalizeSelectValue(value: unknown): SelectEditorValue {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return String(value);
}

function encodeOptionValue(value: SelectEditorValue): string {
  if (value === null) {
    return "";
  }

  return `${typeof value}:${String(value)}`;
}

function decodeOptionValue(
  encoded: string,
  options: SelectEditorOption[],
): SelectEditorValue {
  if (!encoded) {
    return null;
  }

  const option = options.find(
    (item) => encodeOptionValue(item.value) === encoded,
  );

  return option?.value ?? null;
}

function groupOptions(options: SelectEditorOption[]) {
  const groups = new Map<string, SelectEditorOption[]>();
  const ungrouped: SelectEditorOption[] = [];

  options.forEach((option) => {
    if (!option.group) {
      ungrouped.push(option);
      return;
    }

    const group = groups.get(option.group) ?? [];
    group.push(option);
    groups.set(option.group, group);
  });

  return {
    ungrouped,
    groups: Array.from(groups.entries()),
  };
}

export function SelectEditor<TRow = unknown>({
  value,
  row,
  options,

  onChange,
  onCommit,
  onCancel,

  className,
  style,

  placeholder = "انتخاب کنید",
  disabled = false,
  readOnly = false,
  autoFocus = true,

  required = false,
  allowNull = true,

  commitOnChange = true,
  commitOnBlur = false,
  commitOnEnter = true,
  cancelOnEscape = true,

  selectClassName,
  selectStyle,

  error,
  helperText,

  requiredMessage = "این فیلد الزامی است",

  validate,
}: SelectEditorProps<TRow>) {
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const selectedValue = normalizeSelectValue(value);
  const encodedValue = encodeOptionValue(selectedValue);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    selectRef.current?.focus();
  }, [autoFocus]);

  const validationError = useMemo(() => {
    if (required && selectedValue === null) {
      return requiredMessage;
    }

    if (!allowNull && selectedValue === null) {
      return requiredMessage;
    }

    return validate?.(selectedValue, row);
  }, [allowNull, required, requiredMessage, row, selectedValue, validate]);

  const resolvedError = error ?? validationError;

  const grouped = useMemo(() => groupOptions(options), [options]);

  const commit = (nextValue = selectedValue) => {
    if (validationError) {
      return;
    }

    onCommit?.(nextValue);
  };

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (readOnly) {
      return;
    }

    const nextValue = decodeOptionValue(event.target.value, options);

    onChange(nextValue);

    if (commitOnChange) {
      onCommit?.(nextValue);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSelectElement>) => {
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
      <select
        ref={selectRef}
        className={selectClassName}
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
          cursor: disabled || readOnly ? "not-allowed" : "pointer",
          ...selectStyle,
        }}
        value={encodedValue}
        disabled={disabled}
        aria-readonly={readOnly}
        required={required}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (commitOnBlur) {
            commit();
          }
        }}
      >
        {allowNull ? (
          <option value="" disabled={!allowNull && required}>
            {placeholder}
          </option>
        ) : null}

        {grouped.ungrouped.map((option) => (
          <option
            key={encodeOptionValue(option.value)}
            value={encodeOptionValue(option.value)}
            disabled={option.disabled}
            title={option.title}
          >
            {typeof option.label === "string" ||
            typeof option.label === "number"
              ? option.label
              : String(option.value)}
          </option>
        ))}

        {grouped.groups.map(([groupName, groupOptions]) => (
          <optgroup key={groupName} label={groupName}>
            {groupOptions.map((option) => (
              <option
                key={encodeOptionValue(option.value)}
                value={encodeOptionValue(option.value)}
                disabled={option.disabled}
                title={option.title}
              >
                {typeof option.label === "string" ||
                typeof option.label === "number"
                  ? option.label
                  : String(option.value)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

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

export default SelectEditor;
