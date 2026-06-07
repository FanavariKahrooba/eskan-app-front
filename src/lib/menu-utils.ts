import { MENU_SECTIONS } from "@/config/menu/menu.data";

type MenuNode = {
    id: string;
    title: string;
    type?: "group" | "item";
    path?: string;
    href?: string;
    icon?: any;
    children?: MenuNode[];
    [key: string]: any;
};

export function flattenMenu(
    items: MenuNode[],
    parentTitle = ""
): any[] {
    let flat: any[] = [];

    items.forEach((item) => {
        const fullTitle = parentTitle
            ? `${parentTitle} > ${item.title}`
            : item.title;

        if (item.path) {
            flat.push({
                ...item,
                fullTitle,
            });
        }

        if (item.children) {
            flat = [...flat, ...flattenMenu(item.children, fullTitle)];
        }
    });

    return flat;
}

export function getAllPaths(items: MenuNode[]): any[] {
    let paths: any[] = [];

    items.forEach((item) => {
        if (item.path) {
            paths.push(item);
        }

        if (item.children) {
            paths = [...paths, ...getAllPaths(item.children)];
        }
    });

    return paths;
}

export function flattenMenu2(
    items: MenuNode[],
    parent?: string
): any[] {
    let result: any[] = [];

    for (const item of items) {
        if (item.path) {
            result.push({
                id: item.id,
                title: item.title,
                path: item.path,
                href: item.href,
                icon: item.icon,
                parent,
            });
        }

        if (item.children) {
            result = result.concat(flattenMenu2(item.children, item.id));
        }
    }

    return result;
}

export const MENU_PAGES = flattenMenu2(
    MENU_SECTIONS.flatMap((section) => section.children ?? [])
);

export function findPathLineage(
    path: string,
    items: MenuNode[] = MENU_SECTIONS.flatMap((section) => section.children ?? [])
): any[] {
    for (const item of items) {
        if (item.path === path) {
            return [item];
        }

        if (item.children) {
            const childrenLineage = findPathLineage(path, item.children);

            if (childrenLineage.length > 0) {
                return [item, ...childrenLineage];
            }
        }
    }

    return [];
}
