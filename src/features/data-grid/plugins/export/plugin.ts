import type { ColumnDef } from "../../core/types";

export type ExportFormat = 'csv' | 'json';

export interface ExportColumn<TRow = unknown> {
    id: string;
    column: ColumnDef<TRow>;
    header?: string;
    accessor?: (row: TRow) => unknown;
    exportTransformer?: (value: unknown, row: TRow, column: ColumnDef<TRow>) => unknown;
}

export interface ExportPluginOptions<TRow = unknown> {
    enabled?: boolean;
    fileName?: string;
    delimiter?: string;
    includeHeaders?: boolean;
    onExport?: (result: ExportResult) => void;
    serializeCell?: (value: unknown) => string;
    getColumnHeader?: (column: ExportColumn<TRow>) => string;
}

export interface ExportResult {
    format: ExportFormat;
    fileName: string;
    content: string;
    mimeType: string;
}

export interface ExportDataOptions<TRow = unknown> {
    rows: TRow[];
    columns: ExportColumn<TRow>[];
    format?: ExportFormat;
    fileName?: string;
}

export interface ExportPlugin<TRow = unknown> {
    key: 'export';
    enabled: boolean;

    exportData: (options: ExportDataOptions<TRow>) => ExportResult;
    exportCsv: (options: Omit<ExportDataOptions<TRow>, 'format'>) => ExportResult;
    exportJson: (options: Omit<ExportDataOptions<TRow>, 'format'>) => ExportResult;
}

function defaultSerializeCell(value: unknown): string {
    if (value == null) return '';

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

function escapeCsvCell(value: string, delimiter: string): string {
    const shouldEscape =
        value.includes('"') ||
        value.includes('\n') ||
        value.includes('\r') ||
        value.includes(delimiter);

    if (!shouldEscape) return value;

    return `"${value.replace(/"/g, '""')}"`;
}

function getColumnValue<TRow>(
    row: TRow,
    exportColumn: ExportColumn<TRow>,
): unknown {
    const { column, accessor, exportTransformer } = exportColumn;

    let value: unknown;

    if (accessor) {
        value = accessor(row);
    } else if (column.accessorFn) {
        value = column.accessorFn(row);
    } else if (column.accessorKey) {
        value = (row as Record<string, unknown>)[column.accessorKey];
    } else {
        value = (row as Record<string, unknown>)[exportColumn.id];
    }

    if (exportTransformer) {
        return exportTransformer(value, row, column);
    }

    return value;
}

export function createExportPlugin<TRow = unknown>(
    options: ExportPluginOptions<TRow> = {},
): ExportPlugin<TRow> {
    const {
        enabled = true,
        fileName = 'data-grid-export',
        delimiter = ',',
        includeHeaders = true,
        onExport,
        serializeCell = defaultSerializeCell,
        getColumnHeader = (column) => column.header ?? column.id,
    } = options;

    function exportCsv(
        exportOptions: Omit<ExportDataOptions<TRow>, 'format'>,
    ): ExportResult {
        const rows = exportOptions.rows ?? [];
        const columns = exportOptions.columns ?? [];

        const lines: string[] = [];

        if (includeHeaders) {
            const headerLine = columns
                .map((column) => escapeCsvCell(getColumnHeader(column), delimiter))
                .join(delimiter);

            lines.push(headerLine);
        }

        for (const row of rows) {
            const line = columns
                .map((column) => {
                    const rawValue = getColumnValue(row, column);
                    const serialized = serializeCell(rawValue);
                    return escapeCsvCell(serialized, delimiter);
                })
                .join(delimiter);

            lines.push(line);
        }

        return {
            format: 'csv',
            fileName: exportOptions.fileName ?? `${fileName}.csv`,
            content: lines.join('\n'),
            mimeType: 'text/csv;charset=utf-8',
        };
    }

    function exportJson(
        exportOptions: Omit<ExportDataOptions<TRow>, 'format'>,
    ): ExportResult {
        const rows = exportOptions.rows ?? [];
        const columns = exportOptions.columns ?? [];

        const data = rows.map((row) => {
            const output: Record<string, unknown> = {};

            for (const column of columns) {
                output[column.id] = getColumnValue(row, column);
            }

            return output;
        });

        return {
            format: 'json',
            fileName: exportOptions.fileName ?? `${fileName}.json`,
            content: JSON.stringify(data, null, 2),
            mimeType: 'application/json;charset=utf-8',
        };
    }

    return {
        key: 'export',
        enabled,

        exportData(exportOptions) {
            if (!enabled) {
                const result: ExportResult = {
                    format: exportOptions.format ?? 'csv',
                    fileName: exportOptions.fileName ?? fileName,
                    content: '',
                    mimeType: 'text/plain;charset=utf-8',
                };

                onExport?.(result);
                return result;
            }

            const format = exportOptions.format ?? 'csv';

            const result =
                format === 'json'
                    ? exportJson(exportOptions)
                    : exportCsv(exportOptions);

            onExport?.(result);
            return result;
        },

        exportCsv(exportOptions) {
            const result = exportCsv(exportOptions);
            onExport?.(result);
            return result;
        },

        exportJson(exportOptions) {
            const result = exportJson(exportOptions);
            onExport?.(result);
            return result;
        },
    };
}
