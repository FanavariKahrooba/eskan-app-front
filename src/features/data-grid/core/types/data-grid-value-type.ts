export type DataGridPrimitiveValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | Date;

export type DataGridValueType =
    | 'text'
    | 'number'
    | 'currency'
    | 'percent'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'time'
    | 'email'
    | 'url'
    | 'image'
    | 'badge'
    | 'tags'
    | 'json'
    | 'actions'
    | 'custom';

export type DataGridValueFormatter<TValue = unknown, TRow = unknown> = (
    value: TValue,
    row: TRow,
    context: DataGridValueFormatterContext<TRow, TValue>,
) => string;

export interface DataGridValueFormatterContext<TRow = unknown, TValue = unknown> {
    rowIndex: number;
    columnId: string;
    valueType?: DataGridValueType;
    rawValue: TValue;
    locale?: string;
    timezone?: string;
}

export interface DataGridNumberFormatOptions {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: boolean;
}

export interface DataGridCurrencyFormatOptions extends DataGridNumberFormatOptions {
    currency: string;
    currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';
}

export interface DataGridPercentFormatOptions extends DataGridNumberFormatOptions {
    multiplier?: number;
}

export interface DataGridDateFormatOptions {
    locale?: string;
    timezone?: string;
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    format?: string;
}

export interface DataGridBadgeValue {
    label: string;
    value?: string | number | boolean | null;
    color?: string;
    variant?: 'solid' | 'soft' | 'outline' | 'ghost';
}

export interface DataGridTagValue {
    label: string;
    value?: string | number;
    color?: string;
}

export type DataGridCellValue =
    | DataGridPrimitiveValue
    | DataGridBadgeValue
    | DataGridTagValue[]
    | Record<string, unknown>
    | unknown[];
