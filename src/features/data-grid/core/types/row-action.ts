import type { ReactNode } from 'react';
import type { PermissionRuleInput } from './permission-rule';

export type RowActionVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'ghost';

export type RowActionDisplay = 'button' | 'icon' | 'menu-item';

export interface RowActionContext<TRow = unknown> {
    row: TRow;
    rowId: string;
    rowIndex: number;
    selectedRows?: TRow[];
    meta?: Record<string, unknown>;
}

export type RowActionHandler<TRow = unknown> = (
    context: RowActionContext<TRow>,
) => void | Promise<void>;

export interface RowActionStateContext<TRow = unknown>
    extends RowActionContext<TRow> {
    loading?: boolean;
}

export type RowActionStateResolver<TRow = unknown> = (
    context: RowActionStateContext<TRow>,
) => Partial<Pick<RowAction<TRow>, 'label' | 'disabled' | 'hidden' | 'loading'>>;

export interface RowAction<TRow = unknown> {
    id: string;
    label: string;
    icon?: ReactNode;
    tooltip?: string;
    variant?: RowActionVariant;
    display?: RowActionDisplay;
    order?: number;

    disabled?: boolean;
    hidden?: boolean;
    loading?: boolean;
    confirm?: boolean | RowActionConfirmConfig<TRow>;

    permission?: PermissionRuleInput<TRow>;
    resolveState?: RowActionStateResolver<TRow>;

    onClick: RowActionHandler<TRow>;
}

export interface RowActionConfirmConfig<TRow = unknown> {
    title?: string;
    description?: string | ((context: RowActionContext<TRow>) => string);
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger';
}

export interface BulkActionContext<TRow = unknown> {
    rows: TRow[];
    rowIds: string[];
    meta?: Record<string, unknown>;
}

export type BulkActionHandler<TRow = unknown> = (
    context: BulkActionContext<TRow>,
) => void | Promise<void>;

export interface BulkAction<TRow = unknown> {
    id: string;
    label: string;
    icon?: ReactNode;
    tooltip?: string;
    variant?: RowActionVariant;
    order?: number;

    disabled?: boolean;
    hidden?: boolean;
    loading?: boolean;
    confirm?: boolean | BulkActionConfirmConfig<TRow>;

    permission?: PermissionRuleInput<TRow>;

    onClick: BulkActionHandler<TRow>;
}

export interface BulkActionConfirmConfig<TRow = unknown> {
    title?: string;
    description?: string | ((context: BulkActionContext<TRow>) => string);
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger';
}
