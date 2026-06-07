import type { ColumnDef } from '../core/types';
import {
    DEFAULT_COLUMN_WIDTH,
    DEFAULT_MIN_COLUMN_WIDTH,
    DEFAULT_MAX_COLUMN_WIDTH,
} from '../constants';

export interface NormalizeColumnsOptions {
    defaultWidth?: number;
    defaultMinWidth?: number;
    defaultMaxWidth?: number;
}

function createColumnId<TRow>(
    column: ColumnDef<TRow>,
    index: number,
): string {
    const col = column as any;

    if (col.id) return String(col.id);
    if (col.accessorKey) return String(col.accessorKey);
    if (typeof col.header === 'string') return col.header;
    if (col.field) return String(col.field);

    return `column_${index}`;
}

export function normalizeColumns<TRow>(
    columns: Array<ColumnDef<TRow>>,
    options: NormalizeColumnsOptions = {},
): Array<ColumnDef<TRow>> {
    const {
        defaultWidth = DEFAULT_COLUMN_WIDTH,
        defaultMinWidth = DEFAULT_MIN_COLUMN_WIDTH,
        defaultMaxWidth = DEFAULT_MAX_COLUMN_WIDTH,
    } = options;

    return columns.map((column, index) => {
        const col = column as any;
        const id = createColumnId(column, index);

        return {
            ...column,

            id,

            size: col.size ?? col.width ?? defaultWidth,
            minSize: col.minSize ?? col.minWidth ?? defaultMinWidth,
            maxSize: col.maxSize ?? col.maxWidth ?? defaultMaxWidth,

            enableSorting: col.enableSorting ?? true,
            enableFiltering: col.enableFiltering ?? true,
            enableHiding: col.enableHiding ?? true,
            enableResizing: col.enableResizing ?? true,
            enablePinning: col.enablePinning ?? true,

            meta: {
                ...(col.meta ?? {}),
            },
        } as ColumnDef<TRow>;
    });
}
