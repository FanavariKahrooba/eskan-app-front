export type PermissionDecision = boolean | 'hidden' | 'disabled' | 'readonly';

export interface PermissionContext<TRow = unknown> {
    row?: TRow;
    rowIndex?: number;
    columnId?: string;
    actionId?: string;
    user?: unknown;
    permissions?: string[];
    roles?: string[];
    meta?: Record<string, unknown>;
}

export type PermissionResolver<TRow = unknown> = (
    context: PermissionContext<TRow>,
) => PermissionDecision;

export interface PermissionRule<TRow = unknown> {
    id?: string;
    description?: string;
    when?: PermissionResolver<TRow>;
    allow?: boolean;
    effect?: PermissionDecision;
    reason?: string;
}

export type PermissionRuleInput<TRow = unknown> =
    | PermissionDecision
    | PermissionResolver<TRow>
    | PermissionRule<TRow>
    | Array<PermissionRule<TRow>>;

export interface ResolvedPermission {
    allowed: boolean;
    visible: boolean;
    disabled: boolean;
    readonly: boolean;
    reason?: string;
}
