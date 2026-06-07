import type {
    DynamicGridRowId,
} from "../DynamicSmartGrid";

export function clampNumber(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function getColumnInitialWidth<TData extends Record<string, any>>(
    column: any
) {
    return column.width ?? 160;
}

export function getColumnMinWidth<TData extends Record<string, any>>(
    column: any
) {
    return column.minWidth ?? 80;
}

export function getColumnMaxWidth<TData extends Record<string, any>>(
    column: any
) {
    return column.maxWidth ?? 600;
}

export function getCellValue<TData extends Record<string, any>>(
    row: TData,
    column: any
) {
    if (column.accessorFn) return column.accessorFn(row);
    if (column.accessorKey) return row[column.accessorKey];
    return undefined;
}

export function stringifyCellValue(value: any) {
    if (value === null || value === undefined) return "";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

export function reorderArray<T>(items: T[], sourceIndex: number, targetIndex: number) {
    const next = [...items];
    const [removed] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, removed);
    return next;
}

export function getPinnedColumns<TData extends Record<string, any>>(
    columns: any[],
    pinning: Record<string, any>
) {
    const left = columns.filter((col) => pinning[col.id] === "left");
    const center = columns.filter((col) => !pinning[col.id]);
    const right = columns.filter((col) => pinning[col.id] === "right");

    return [...left, ...center, ...right];
}

export function createRowLookup<TData extends Record<string, any>>(
    rows: TData[],
    getRowId: (row: TData, index: number) => DynamicGridRowId
) {
    const map = new Map<DynamicGridRowId, TData>();

    rows.forEach((row, index) => {
        map.set(getRowId(row, index), row);
    });

    return map;
}

export function safeIncludes(source: any, search: string) {
    return stringifyCellValue(source)
        .toLowerCase()
        .includes(search.trim().toLowerCase());
}

export function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}


export function toPersianDigits(value: number | string): string {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

    return String(value).replace(/\d/g, (digit) => {
        return persianDigits[Number(digit)];
    });
}

export function toEnglishDigits(value: number | string): string {
    return String(value)
        .replace(/۰/g, "0")
        .replace(/۱/g, "1")
        .replace(/۲/g, "2")
        .replace(/۳/g, "3")
        .replace(/۴/g, "4")
        .replace(/۵/g, "5")
        .replace(/۶/g, "6")
        .replace(/۷/g, "7")
        .replace(/۸/g, "8")
        .replace(/۹/g, "9")
        .replace(/٠/g, "0")
        .replace(/١/g, "1")
        .replace(/٢/g, "2")
        .replace(/٣/g, "3")
        .replace(/٤/g, "4")
        .replace(/٥/g, "5")
        .replace(/٦/g, "6")
        .replace(/٧/g, "7")
        .replace(/٨/g, "8")
        .replace(/٩/g, "9");
}
