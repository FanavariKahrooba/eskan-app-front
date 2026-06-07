import type { ColumnDef } from '../types';

export type PermissionValue<TRow = unknown> =
    | boolean
    | ((row?: TRow) => boolean)
    | undefined;

export interface ResolveColumnPermissionOptions<TRow = unknown> {
    column: ColumnDef<TRow>;
    permission?: PermissionValue<TRow>;
    row?: TRow;
    fallback?: boolean;
}

function evaluatePermission<TRow = unknown>(
    permission: PermissionValue<TRow>,
    row?: TRow,
    fallback = true,
): boolean {
    if (typeof permission === 'boolean') {
        return permission;
    }

    if (typeof permission === 'function') {
        try {
            return permission(row);
        } catch {
            return false;
        }
    }

    return fallback;
}

export function resolveColumnPermission<TRow = unknown>(
    options: ResolveColumnPermissionOptions<TRow>,
): boolean {
    const { permission, row, fallback = true } = options;

    return evaluatePermission(permission, row, fallback);
}
