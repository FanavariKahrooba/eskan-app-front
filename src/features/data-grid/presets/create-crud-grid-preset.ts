import { createRowAction } from '../actions';

export interface CrudGridPresetOptions<TRow = unknown> {
    enableCreate?: boolean;
    enableEdit?: boolean;
    enableDelete?: boolean;
    enableView?: boolean;

    onCreate?: () => void | Promise<void>;
    onEdit?: (row: TRow) => void | Promise<void>;
    onDelete?: (row: TRow) => void | Promise<void>;
    onView?: (row: TRow) => void | Promise<void>;
}

export function createCrudGridPreset<TRow = unknown>(
    options: CrudGridPresetOptions<TRow> = {},
) {
    const {
        enableCreate = true,
        enableEdit = true,
        enableDelete = true,
        enableView = false,
    } = options;

    const rowActions = [];

    if (enableView) {
        rowActions.push(
            createRowAction<TRow>({
                id: 'view',
                label: 'مشاهده',
                order: 10,
                onClick: ({ row }) => options.onView?.(row),
            }),
        );
    }

    if (enableEdit) {
        rowActions.push(
            createRowAction<TRow>({
                id: 'edit',
                label: 'ویرایش',
                variant: 'primary',
                order: 20,
                onClick: ({ row }) => options.onEdit?.(row),
            }),
        );
    }

    if (enableDelete) {
        rowActions.push(
            createRowAction<TRow>({
                id: 'delete',
                label: 'حذف',
                variant: 'danger',
                order: 30,
                onClick: ({ row }) => options.onDelete?.(row),
            }),
        );
    }

    return {
        features: {
            search: true,
            filtering: true,
            sorting: true,
            pagination: true,
            columnVisibility: true,
            columnOrdering: true,
            columnSizing: true,
            rowSelection: true,
            rowEditing: enableEdit,
            toolbar: true,
            export: true,
        },

        toolbarActions: enableCreate
            ? [
                {
                    id: 'create',
                    label: 'ایجاد',
                    variant: 'primary',
                    order: 10,
                    onClick: options.onCreate,
                },
            ]
            : [],

        rowActions,
    };
}
