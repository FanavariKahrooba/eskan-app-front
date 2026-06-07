import type {
    FeatureFlagKey,
    MenuAccessContext,
    MenuNode,
    MenuSection,
    PermissionKey,
    RoleKey,
} from "./menu.types";

function toArray<T>(value?: T | T[]): T[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
}

function hasPermission(
    required: PermissionKey | PermissionKey[] | undefined,
    userPermissions: PermissionKey[],
    isSuperAdmin = false
): boolean {
    if (isSuperAdmin) return true;
    const requiredList = toArray(required);
    if (requiredList.length === 0) return true;
    return requiredList.every((p) => userPermissions.includes(p));
}

function hasRole(
    allowedRoles: RoleKey[] | undefined,
    userRoles: RoleKey[],
    isSuperAdmin = false
): boolean {
    if (isSuperAdmin) return true;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.some((role) => userRoles.includes(role));
}

function hasFeatureFlag(
    requiredFlags: FeatureFlagKey | FeatureFlagKey[] | undefined,
    enabledFlags: FeatureFlagKey[],
    isSuperAdmin = false
): boolean {
    if (isSuperAdmin) return true;
    const requiredList = toArray(requiredFlags);
    if (requiredList.length === 0) return true;
    return requiredList.every((flag) => enabledFlags.includes(flag));
}

export function canAccessNode(
    node: MenuNode,
    context: MenuAccessContext
): boolean {
    if (node.hidden) return false;

    const permissionOk = hasPermission(
        node.permission,
        context.permissions,
        context.isSuperAdmin
    );

    const roleOk = hasRole(node.roles, context.roles, context.isSuperAdmin);

    const featureOk = hasFeatureFlag(
        node.featureFlag,
        context.featureFlags,
        context.isSuperAdmin
    );

    return permissionOk && roleOk && featureOk;
}

export function filterMenuNodes(
    nodes: MenuNode[],
    context: MenuAccessContext
): MenuNode[] {
    return nodes
        .map((node) => {
            if (!canAccessNode(node, context)) return null;

            if (node.type === "item") {
                return node;
            }

            const filteredChildren = filterMenuNodes(node.children, context);

            if (filteredChildren.length === 0) return null;

            return {
                ...node,
                children: filteredChildren,
            };
        })
        .filter(Boolean) as MenuNode[];
}

export function filterMenuSections(
    sections: MenuSection[],
    context: MenuAccessContext
): MenuSection[] {
    return sections
        .map((section) => {
            const children = filterMenuNodes(section.children, context);
            if (children.length === 0) return null;
            return {
                ...section,
                children,
            };
        })
        .filter(Boolean) as MenuSection[];
}

export function flattenMenuPaths(nodes: MenuNode[]): string[] {
    const paths: string[] = [];

    for (const node of nodes) {
        if (node.type === "item") {
            paths.push(node.path);
        } else {
            paths.push(...flattenMenuPaths(node.children));
        }
    }

    return paths;
}

export function findMenuNodeById(
    nodes: MenuNode[],
    id: string
): MenuNode | null {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.type === "group") {
            const found = findMenuNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

export function findActivePath(
    nodes: MenuNode[],
    pathname: string
): MenuNode | null {
    for (const node of nodes) {
        if (node.type === "item") {
            if (node.exact) {
                if (node.path === pathname) return node;
            } else {
                if (pathname === node.path || pathname.startsWith(`${node.path}/`)) {
                    return node;
                }
            }
        } else {
            const found = findActivePath(node.children, pathname);
            if (found) return found;
        }
    }

    return null;
}
