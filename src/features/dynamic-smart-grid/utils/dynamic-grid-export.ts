// import type { DynamicGridColumn } from "../DynamicSmartGrid";
import { getCellValue, stringifyCellValue } from "./dynamic-grid-helpers";

function downloadFile(filename: string, content: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

function escapeCsvValue(value: string) {
    if (/[",\n\r]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
}

export function exportRowsToCsv<TData extends Record<string, any>>(params: {
    rows: TData[];
    columns: any;
    filename?: string;
}) {
    const { rows, columns, filename = "grid-export.csv" } = params;

    const headers = columns.map((column: any) =>
        escapeCsvValue(stringifyCellValue(column.header))
    );

    const lines = rows.map((row) => {
        return columns
            .map((column: any) => {
                const value = column.exportValue
                    ? column.exportValue(row)
                    : getCellValue(row, column);

                return escapeCsvValue(stringifyCellValue(value));
            })
            .join(",");
    });

    const csv = [headers.join(","), ...lines].join("\n");

    downloadFile(filename, csv, "text/csv;charset=utf-8");
}

export function exportRowsToJson<TData extends Record<string, any>>(params: {
    rows: TData[];
    columns: any[];
    filename?: string;
}) {
    const { rows, columns, filename = "grid-export.json" } = params;

    const data = rows.map((row) => {
        const item: Record<string, any> = {};

        columns.forEach((column) => {
            item[column.id] = column.exportValue
                ? column.exportValue(row)
                : getCellValue(row, column);
        });

        return item;
    });

    downloadFile(filename, JSON.stringify(data, null, 2), "application/json");
}
