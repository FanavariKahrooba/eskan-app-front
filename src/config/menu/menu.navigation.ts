import type {
    ActiveMenuResult,
    FlatMenuItem,
    MenuLeafItem,
    MenuNode,
    MenuSection,
} from "./menu.types";

export function normalizePath(input?: string, basePath = ""): string {
    if (!input) return "/";

    let path = input.trim();

    try {
        if (path.startsWith("http://") || path.startsWith("https://")) {
            const url = new URL(path);
            path = url.pathname;
        }
    } catch {
        // ignore invalid url
    }

    path = path.split("?")[0].split("#")[0];

    if (!path.startsWith("/")) {
        path = `/${path}`;
    }

    if (basePath) {
        const cleanBasePath =
            basePath.length > 1 && basePath.endsWith("/")
                ? basePath.slice(0, -1)
                : basePath;

        if (path === cleanBasePath) {
            path = "/";
        } else if (path.startsWith(`${cleanBasePath}/`)) {
            path = path.slice(cleanBasePath.length);
        }
    }

    path = path.replace(/\/{2,}/g, "/");

    if (path.length > 1 && path.endsWith("/")) {
        path = path.slice(0, -1);
    }

    return path || "/";
}

export function isDynamicRouteMatch(
    pathname: string,
    pattern: string,
    basePath = ""
): boolean {
    const current = normalizePath(pathname, basePath);
    const target = normalizePath(pattern, basePath);

    const currentParts = current.split("/").filter(Boolean);
    const targetParts = target.split("/").filter(Boolean);

    if (currentParts.length !== targetParts.length) {
        return false;
    }

    return targetParts.every((part, index) => {
        const currentPart = currentParts[index];

        // Next.js dynamic route: [id]
        if (part.startsWith("[") && part.endsWith("]")) return true;

        // custom dynamic route: :id
        if (part.startsWith(":")) return true;

        return part === currentPart;
    });
}

export function isPathActive(
    pathname: string,
    item: Pick<MenuLeafItem, "path" | "href" | "exact" | "activePaths">,
    basePath = ""
): boolean {
    const current = normalizePath(pathname, basePath);

    const mainPath = normalizePath(item.path || item.href, basePath);
    const hrefPath = normalizePath(item.href || item.path, basePath);

    const candidates = Array.from(
        new Set([
            mainPath,
            hrefPath,
            ...(item.activePaths ?? []).map((path) =>
                normalizePath(path, basePath)
            ),
        ])
    );

    for (const candidate of candidates) {
        if (!candidate) continue;

        if (candidate.includes("[") || candidate.includes(":")) {
            if (isDynamicRouteMatch(current, candidate, basePath)) {
                return true;
            }
        }

        if (item.exact) {
            if (current === candidate) return true;
            continue;
        }

        if (candidate === "/") {
            if (current === "/") return true;
            continue;
        }

        if (current === candidate) return true;

        if (current.startsWith(`${candidate}/`)) return true;
    }

    return false;
}

function createSearchableText(params: {
    title: string;
    href: string;
    path: string;
    sectionTitle: string;
    groupTitle?: string;
    keywords?: string[];
}) {
    return [
        params.title,
        params.href,
        params.path,
        params.sectionTitle,
        params.groupTitle,
        ...(params.keywords ?? []),
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

export function flattenMenuNodes(
    nodes: MenuNode[],
    params: {
        sectionId: string;
        sectionTitle: string;
        groupId?: string;
        groupTitle?: string;
        breadcrumbs?: string[];
    }
): FlatMenuItem[] {
    const result: FlatMenuItem[] = [];

    for (const node of nodes) {
        if (node.type === "item") {
            const breadcrumbs = [
                ...(params.breadcrumbs ?? []),
                node.title,
            ];

            result.push({
                ...node,
                sectionId: params.sectionId,
                sectionTitle: params.sectionTitle,
                groupId: params.groupId,
                groupTitle: params.groupTitle,
                breadcrumbs,
                searchableText: createSearchableText({
                    title: node.title,
                    href: node.href,
                    path: node.path,
                    sectionTitle: params.sectionTitle,
                    groupTitle: params.groupTitle,
                    keywords: node.keywords,
                }),
            });

            continue;
        }

        result.push(
            ...flattenMenuNodes(node.children, {
                sectionId: params.sectionId,
                sectionTitle: params.sectionTitle,
                groupId: node.id,
                groupTitle: node.title,
                breadcrumbs: [
                    ...(params.breadcrumbs ?? []),
                    node.title,
                ],
            })
        );
    }

    return result;
}

export function flattenMenuSections(
    sections: MenuSection[]
): FlatMenuItem[] {
    return sections.flatMap((section) =>
        flattenMenuNodes(section.children, {
            sectionId: section.id,
            sectionTitle: section.title,
            breadcrumbs: [section.title],
        })
    );
}

export function findActiveMenuItem(
    sections: MenuSection[],
    pathname: string,
    basePath = ""
): ActiveMenuResult | null {
    const items = flattenMenuSections(sections);

    /**
     * مرحله 1:
     * match استاندارد exact/nested/dynamic
     */
    const activeItem = items.find((item) =>
        isPathActive(pathname, item, basePath)
    );

    if (activeItem) {
        return {
            item: activeItem,
            sectionId: activeItem.sectionId,
            sectionTitle: activeItem.sectionTitle,
            groupId: activeItem.groupId,
            groupTitle: activeItem.groupTitle,
            breadcrumbs: activeItem.breadcrumbs,
        };
    }

    /**
     * مرحله 2:
     * fallback برای وقتی basePath یا route prefix متفاوت است.
     */
    const normalizedPathname = normalizePath(pathname, basePath);

    const fallbackItem = items.find((item) => {
        const itemPath = normalizePath(item.path || item.href, basePath);

        if (normalizedPathname === itemPath) return true;

        if (itemPath !== "/" && normalizedPathname.endsWith(itemPath)) {
            return true;
        }

        if (itemPath !== "/" && normalizedPathname.startsWith(`${itemPath}/`)) {
            return true;
        }

        return false;
    });

    if (!fallbackItem) return null;

    return {
        item: fallbackItem,
        sectionId: fallbackItem.sectionId,
        sectionTitle: fallbackItem.sectionTitle,
        groupId: fallbackItem.groupId,
        groupTitle: fallbackItem.groupTitle,
        breadcrumbs: fallbackItem.breadcrumbs,
    };
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

export function findMenuItemById(
    sections: MenuSection[],
    id: string
): FlatMenuItem | null {
    const items = flattenMenuSections(sections);
    return items.find((item) => item.id === id) ?? null;
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

export function getSectionById(
    sections: MenuSection[],
    sectionId: string
): MenuSection | null {
    return sections.find((section) => section.id === sectionId) ?? null;
}

export function searchMenuItems(
    sections: MenuSection[],
    query: string
): FlatMenuItem[] {
    const q = query.trim().toLowerCase();

    const items = flattenMenuSections(sections);

    if (!q) return items;

    return items.filter((item) => item.searchableText.includes(q));
}
