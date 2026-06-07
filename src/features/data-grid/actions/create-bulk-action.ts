export type BulkActionVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost';

export interface BulkActionContext<TRow = unknown> {
    selectedRowIds: string[];
    selectedRows: TRow[];
    state?: unknown;
    api?: unknown;
}

export interface BulkAction<TRow = unknown> {
    id: string;
    label: string;
    icon?: unknown;
    tooltip?: string;
    variant?: BulkActionVariant;
    order?: number;

    requireSelection?: boolean;

    hidden?: boolean | ((context: BulkActionContext<TRow>) => boolean);
    disabled?: boolean | ((context: BulkActionContext<TRow>) => boolean);
    loading?: boolean | ((context: BulkActionContext<TRow>) => boolean);

    onClick?: (context: BulkActionContext<TRow>) => void | Promise<void>;
}

export interface CreateBulkActionOptions<TRow = unknown>
    extends BulkAction<TRow> { }

export function createBulkAction<TRow = unknown>(
    options: CreateBulkActionOptions<TRow>,
): BulkAction<TRow> {
    return {
        variant: 'default',
        order: 0,
        requireSelection: true,
        ...options,
    };
}
