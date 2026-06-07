import type {
    DataGridCurrencyFormatOptions,
    DataGridDateFormatOptions,
    DataGridNumberFormatOptions,
    DataGridPercentFormatOptions,
} from './data-grid-value-type';

export interface ColumnMeta {
    description?: string;
    placeholder?: string;
    helpText?: string;

    align?: 'left' | 'center' | 'right';
    headerAlign?: 'left' | 'center' | 'right';

    className?: string;
    headerClassName?: string;
    cellClassName?: string;
    footerClassName?: string;

    testId?: string;

    color?: string;
    icon?: unknown;

    format?: ColumnFormatMeta;

    searchableText?: boolean;

    exportable?: boolean;
    exportHeader?: string;
    exportOrder?: number;

    printHidden?: boolean;

    [key: string]: unknown;
}

export interface ColumnFormatMeta {
    number?: DataGridNumberFormatOptions;
    currency?: DataGridCurrencyFormatOptions;
    percent?: DataGridPercentFormatOptions;
    date?: DataGridDateFormatOptions;
    datetime?: DataGridDateFormatOptions;
}
