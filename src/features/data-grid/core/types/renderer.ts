import type { ReactNode } from 'react';

export type DataGridRenderResult = ReactNode;

export interface DataGridBaseRenderContext<TRow = unknown> {
    row?: TRow;
    rowIndex?: number;
    columnId?: string;
    isLoading?: boolean;
    isSelected?: boolean;
    isExpanded?: boolean;
    isEditing?: boolean;
    disabled?: boolean;
}

export interface DataGridCellRenderContext<TRow = unknown, TValue = unknown>
    extends DataGridBaseRenderContext<TRow> {
    row: TRow;
    value: TValue;
    rawValue: TValue;
    rowIndex: number;
    columnId: string;
    formattedValue?: string;
}

export type DataGridCellRenderer<TRow = unknown, TValue = unknown> = (
    context: DataGridCellRenderContext<TRow, TValue>,
) => DataGridRenderResult;

export interface DataGridHeaderRenderContext<TRow = unknown> {
    columnId: string;
    label?: string;
    column?: unknown;
    rows?: TRow[];
    sortable?: boolean;
    filterable?: boolean;
    resizable?: boolean;
}

export type DataGridHeaderRenderer<TRow = unknown> = (
    context: DataGridHeaderRenderContext<TRow>,
) => DataGridRenderResult;

export interface DataGridFooterRenderContext<TRow = unknown> {
    columnId: string;
    column?: unknown;
    rows: TRow[];
    visibleRows: TRow[];
}

export type DataGridFooterRenderer<TRow = unknown> = (
    context: DataGridFooterRenderContext<TRow>,
) => DataGridRenderResult;

export interface DataGridEditorRenderContext<TRow = unknown, TValue = unknown>
    extends DataGridCellRenderContext<TRow, TValue> {
    value: TValue;
    initialValue: TValue;
    onChange: (value: TValue) => void;
    onCommit: (value?: TValue) => void;
    onCancel: () => void;
    error?: string;
}

export type DataGridCellEditor<TRow = unknown, TValue = unknown> = (
    context: DataGridEditorRenderContext<TRow, TValue>,
) => DataGridRenderResult;

export interface DataGridFilterRenderContext<TValue = unknown> {
    columnId: string;
    value: TValue;
    operator?: string;
    disabled?: boolean;
    onChange: (value: TValue) => void;
    onOperatorChange?: (operator: string) => void;
    onClear: () => void;
    onApply?: () => void;
}

export type DataGridFilterRenderer<TValue = unknown> = (
    context: DataGridFilterRenderContext<TValue>,
) => DataGridRenderResult;

export interface DataGridOverlayRenderContext {
    title?: string;
    description?: string;
    error?: unknown;
    retry?: () => void;
}

export type DataGridOverlayRenderer = (
    context: DataGridOverlayRenderContext,
) => DataGridRenderResult;
