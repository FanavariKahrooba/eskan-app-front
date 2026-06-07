export type RowActionVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost';

export interface RowActionContext<TRow = unknown> {
    row: TRow;
    rowId: string;
    rowIndex: number;
    state?: unknown;
    api?: unknown;
}

export interface RowAction<TRow = unknown> {
    id: string;
    label: string;
    icon?: unknown;
    tooltip?: string;
    variant?: RowActionVariant;
    order?: number;

    hidden?: boolean | ((context: RowActionContext<TRow>) => boolean);
    disabled?: boolean | ((context: RowActionContext<TRow>) => boolean);
    loading?: boolean | ((context: RowActionContext<TRow>) => boolean);

    onClick?: (context: RowActionContext<TRow>) => void | Promise<void>;
}

export interface CreateRowActionOptions<TRow = unknown>
    extends RowAction<TRow> { }

export function createRowAction<TRow = unknown>(
    options: CreateRowActionOptions<TRow>,
): RowAction<TRow> {
    return {
        variant: 'default',
        order: 0,
        ...options,
    };
}
