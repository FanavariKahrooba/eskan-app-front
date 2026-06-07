import {
    serializeVisibleColumns,
    serializeVisibleRows,
} from './serializers';

export interface PrintTableOptions {
    columns: any[];
    rows: any[];
    title?: string;
    direction?: 'rtl' | 'ltr';
}

function escapeHtml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function createPrintableTableHtml(
    options: PrintTableOptions,
): string {
    const {
        columns,
        rows,
        title = 'Data Grid',
        direction = 'rtl',
    } = options;

    const visibleColumns = serializeVisibleColumns(columns);
    const visibleRows = serializeVisibleRows(rows, visibleColumns);

    return `
<!doctype html>
<html dir="${direction}">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 24px;
      color: #111827;
    }

    h1 {
      font-size: 20px;
      margin-bottom: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      border: 1px solid #d1d5db;
      padding: 8px 10px;
      text-align: start;
      font-size: 13px;
    }

    th {
      background: #f3f4f6;
      font-weight: 700;
    }

    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <table>
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
</html>
`.trim();
}

export function printTable(options: PrintTableOptions): void {
    if (typeof window === 'undefined') return;

    const html = createPrintableTableHtml(options);
    const printWindow = window.open('', '_blank');

    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
    }, 100);
}
