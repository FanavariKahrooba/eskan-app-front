export type ActionPermissionValue<TRow = unknown> =
  | boolean
  | ((row?: TRow) => boolean)
  | undefined;

export interface ResolveActionPermissionOptions<TRow = unknown> {
  permission?: ActionPermissionValue<TRow>;
  row?: TRow;
  fallback?: boolean;
}

function evaluateActionPermission<TRow = unknown>(
  permission: ActionPermissionValue<TRow>,
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

export function resolveActionPermission<TRow = unknown>(
  options: ResolveActionPermissionOptions<TRow>,
): boolean {
  const { permission, row, fallback = true } = options;

  return evaluateActionPermission(permission, row, fallback);
}
