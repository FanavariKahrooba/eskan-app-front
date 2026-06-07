import type { ReactNode } from 'react';

export type DataGridFilterOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'isEmpty'
    | 'isNotEmpty'
    | 'greaterThan'
    | 'greaterThanOrEqual'
    | 'lessThan'
    | 'lessThanOrEqual'
    | 'between'
    | 'in'
    | 'notIn'
    | 'before'
    | 'after'
    | 'onOrBefore'
    | 'onOrAfter'
    | 'custom';

export type DataGridFilterInputType =
    | 'text'
    | 'number'
    | 'number-range'
    | 'date'
    | 'date-range'
    | 'boolean'
    | 'select'
    | 'multi-select'
    | 'custom';

export interface DataGridFilterOption<TValue = unknown> {
    label: string;
    value: TValue;
    icon?: ReactNode;
    disabled?: boolean;
}

export interface DataGridColumnFilterContext<TRow = unknown, TValue = unknown> {
    row: TRow;
    value: TValue;
    filterValue: unknown;
    operator: DataGridFilterOperator;
    columnId: string;
}

export type DataGridColumnFilterPredicate<TRow = unknown, TValue = unknown> = (
    context: DataGridColumnFilterContext<TRow, TValue>,
) => boolean;

export interface ColumnFilterDef<TRow = unknown, TValue = unknown> {
    enabled?: boolean;
    inputType?: DataGridFilterInputType;
    operators?: DataGridFilterOperator[];
    defaultOperator?: DataGridFilterOperator;
    options?: Array<DataGridFilterOption>;
    placeholder?: string;
    debounceMs?: number;
    predicate?: DataGridColumnFilterPredicate<TRow, TValue>;
    rendererKey?: string;
    meta?: Record<string, unknown>;
}
