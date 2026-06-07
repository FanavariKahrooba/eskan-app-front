import {
    serializeVisibleColumns,
    serializeVisibleRows,
} from './serializers';

export interface ExportExcelOptions {
    columns: any[];
    rows: any[];
    fileName?: string;
    sheetName?: string;
    download?: boolean;
}

function escapeHtml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function downloadHtmlExcel(content: string, fileName: string): void {
    if (typeof window === 'undefined') return;

    const blob = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
}

export function exportExcel(options: ExportExcelOptions): string {
    const {
        columns,
        rows,
        fileName = 'data-grid.xls',
        sheetName = 'Sheet1',
        download = true,
    } = options;

    const visibleColumns = serializeVisibleColumns(columns);
    const visibleRows = serializeVisibleRows(rows, visibleColumns);

    const html = `
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    table { border-collapse: collapse; }
    th, td { border: 1px solid #cccccc; padding: 6px 10px; }
    th { background: #f3f4f6; font-weight: bold; }
  </style>
</head>
<body>
  <table>
    <caption>${escapeHtml(sheetName)}</caption>
    <thead>
      <tr>
        ${visibleColumns.map((column) => `<th>${escapeHtml(column.header)}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${visibleRows
            .map(
                (row) => `
            <tr>
              ${visibleColumns
                        .map((column) => `<td>${escapeHtml(row.values[column.id])}</td>`)
                        .join('')}
            </tr>
          `,
            )
            .join('')}
    </tbody>
  </table>
</body>
</html>`.trim();

    if (download) {
        downloadHtmlExcel(html, fileName);
    }

    return html;
}
