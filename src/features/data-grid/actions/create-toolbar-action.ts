export type ToolbarActionVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost';

export interface ToolbarActionContext {
    state?: unknown;
    api?: unknown;
    selectedRowIds?: string[];
    selectedRows?: unknown[];
}

export interface ToolbarAction {
    id: string;
    label: string;
    icon?: unknown;
    tooltip?: string;
    variant?: ToolbarActionVariant;
    order?: number;

    hidden?: boolean | ((context: ToolbarActionContext) => boolean);
    disabled?: boolean | ((context: ToolbarActionContext) => boolean);
    loading?: boolean | ((context: ToolbarActionContext) => boolean);

    onClick?: (context: ToolbarActionContext) => void | Promise<void>;
}

export interface CreateToolbarActionOptions extends ToolbarAction { }

export function createToolbarAction(
    options: CreateToolbarActionOptions,
): ToolbarAction {
    return {
        variant: 'default',
        order: 0,
        ...options,
    };
}
