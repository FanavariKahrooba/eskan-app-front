import {
    serializeVisibleColumns,
    serializeVisibleRows,
} from './serializers';

export interface ExportCsvOptions {
    columns: any[];
    rows: any[];
    fileName?: string;
    delimiter?: string;
    includeBom?: boolean;
    download?: boolean;
}

function escapeCsvValue(value: unknown, delimiter: string): string {
    if (value == null) return '';

    const text = String(value);

    const shouldEscape =
        text.includes(delimiter) ||
        text.includes('"') ||
        text.includes('\n') ||
        text.includes('\r');

    if (!shouldEscape) return text;

    return `"${text.replace(/"/g, '""')}"`;
}

function downloadTextFile(
    content: string,
    fileName: string,
    mimeType: string,
): void {
    if (typeof window === 'undefined') return;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
}

export function exportCsv(options: ExportCsvOptions): string {
    const {
        columns,
        rows,
        fileName = 'data-grid.csv',
        delimiter = ',',
        includeBom = true,
        download = true,
    } = options;

    const visibleColumns = serializeVisibleColumns(columns);
    const visibleRows = serializeVisibleRows(rows, visibleColumns);

    const header = visibleColumns
        .map((column) => escapeCsvValue(column.header, delimiter))
        .join(delimiter);

    const body = visibleRows
        .map((row) =>
            visibleColumns
                .map((column) => escapeCsvValue(row.values[column.id], delimiter))
                .join(delimiter),
        )
        .join('\n');

    const csv = `${includeBom ? '\uFEFF' : ''}${header}\n${body}`;

    if (download) {
        downloadTextFile(csv, fileName, 'text/csv;charset=utf-8');
    }

    return csv;
}
