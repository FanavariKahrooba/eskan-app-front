import {
    serializeVisibleColumns,
    serializeVisibleRows,
} from './serializers';

export interface ExportJsonOptions {
    columns: any[];
    rows: any[];
    fileName?: string;
    pretty?: boolean;
    download?: boolean;
}

function downloadJsonFile(content: string, fileName: string): void {
    if (typeof window === 'undefined') return;

    const blob = new Blob([content], {
        type: 'application/json;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
}

export function exportJson(options: ExportJsonOptions): string {
    const {
        columns,
        rows,
        fileName = 'data-grid.json',
        pretty = true,
        download = true,
    } = options;

    const visibleColumns = serializeVisibleColumns(columns);
    const visibleRows = serializeVisibleRows(rows, visibleColumns);

    const payload = {
        columns: visibleColumns,
        rows: visibleRows.map((row) => row.values),
    };

    const json = JSON.stringify(payload, null, pretty ? 2 : 0);

    if (download) {
        downloadJsonFile(json, fileName);
    }

    return json;
}
