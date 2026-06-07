import {
  useMemo,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type SelectFilterPrimitiveValue = string | number | boolean;

export type SelectFilterValue =
  | SelectFilterPrimitiveValue
  | SelectFilterPrimitiveValue[]
  | null;

export interface SelectFilterOption {
  label: ReactNode;
  value: SelectFilterPrimitiveValue;
  disabled?: boolean;
  title?: string;
  group?: string;
  meta?: Record<string, unknown>;
}

export interface SelectFilterProps<TRow = unknown> {
  value?: SelectFilterValue;
  row?: TRow;
  columnId?: string;

  options: SelectFilterOption[];

  onChange: (value: SelectFilterValue) => void;
  onApply?: (value: SelectFilterValue) => void;
  onClear?: () => void;

  className?: string;
  style?: CSSProperties;

  selectClassName?: string;
  selectStyle?: CSSProperties;

  buttonClassName?: string;
  buttonStyle?: CSSProperties;

  placeholder?: ReactNode;

  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  multiple?: boolean;
  size?: number;

  allowNull?: boolean;

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
    value: SelectFilterValue,
    row?: TRow,
  ) => ReactNode | null | undefined;
}

function encodeSelectFilterValue(
  value: SelectFilterPrimitiveValue | null,
): string {
  if (value === null) {
    return "";
  }

  return `${typeof value}:${String(value)}`;
}

function decodeSelectFilterValue(
  encoded: string,
  options: SelectFilterOption[],
): SelectFilterPrimitiveValue | null {
  if (!encoded) {
    return null;
  }

  const found = options.find(
    (option) => encodeSelectFilterValue(option.value) === encoded,
  );

  return found?.value ?? null;
}

function normalizeSingleValue(value: SelectFilterValue): string {
  if (Array.isArray(value)) {
    return encodeSelectFilterValue(value[0] ?? null);
  }

  return encodeSelectFilterValue(value ?? null);
}

function normalizeMultipleValue(value: SelectFilterValue): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => encodeSelectFilterValue(item));
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [encodeSelectFilterValue(value)];
}

function renderOptionLabel(label: ReactNode, fallback: string): string {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }

  return fallback;
}

function groupOptions(options: SelectFilterOption[]) {
  const groups = new Map<string, SelectFilterOption[]>();
  const ungrouped: SelectFilterOption[] = [];

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

export function SelectFilter<TRow = unknown>({
  value = null,
  row,
  options,

  onChange,
  onApply,
  onClear,

  className,
  style,

  selectClassName,
  selectStyle,

  buttonClassName,
  buttonStyle,

  placeholder = "همه",

  disabled = false,
  readOnly = false,
  autoFocus = false,

  multiple = false,
  size,

  allowNull = true,

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
}: SelectFilterProps<TRow>) {
  const grouped = useMemo(() => groupOptions(options), [options]);

  const normalizedValue = multiple
    ? normalizeMultipleValue(value)
    : normalizeSingleValue(value);

  const validationError = validate?.(value, row);
  const resolvedError = error ?? validationError;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (readOnly) {
      return;
    }

    let nextValue: SelectFilterValue;

    if (multiple) {
      const selectedValues = Array.from(event.target.selectedOptions)
        .map((option) => decodeSelectFilterValue(option.value, options))
        .filter((item): item is SelectFilterPrimitiveValue => item !== null);

      nextValue = selectedValues.length > 0 ? selectedValues : null;
    } else {
      nextValue = decodeSelectFilterValue(event.target.value, options);
    }

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

  const renderOption = (option: SelectFilterOption) => (
    <option
      key={encodeSelectFilterValue(option.value)}
      value={encodeSelectFilterValue(option.value)}
      disabled={option.disabled}
      title={option.title}
    >
      {renderOptionLabel(option.label, String(option.value))}
    </option>
  );

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
          value={normalizedValue}
          disabled={disabled}
          aria-readonly={readOnly}
          autoFocus={autoFocus}
          multiple={multiple}
          size={size}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        >
          {!multiple && allowNull ? (
            <option value="">{renderOptionLabel(placeholder, "همه")}</option>
          ) : null}

          {grouped.ungrouped.map(renderOption)}

          {grouped.groups.map(([groupName, groupOptions]) => (
            <optgroup key={groupName} label={groupName}>
              {groupOptions.map(renderOption)}
            </optgroup>
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

export default SelectFilter;
