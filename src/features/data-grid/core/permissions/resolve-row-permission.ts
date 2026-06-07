export type RowPermissionValue<TRow = unknown> =
    | boolean
    | ((row: TRow) => boolean)
    | undefined;

export interface ResolveRowPermissionOptions<TRow = unknown> {
    row: TRow;
    permission?: RowPermissionValue<TRow>;
    fallback?: boolean;
}

function evaluateRowPermission<TRow = unknown>(
    permission: RowPermissionValue<TRow>,
    row: TRow,
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

export function resolveRowPermission<TRow = unknown>(
    options: ResolveRowPermissionOptions<TRow>,
): boolean {
    const { row, permission, fallback = true } = options;

    return evaluateRowPermission(permission, row, fallback);
}
