import type { ReactNode } from 'react';
import type { ColumnFilterDef } from './column-filter';
import type { ColumnMeta } from './column-meta';
import type {
    DataGridCellEditor,
    DataGridCellRenderer,
    DataGridFooterRenderer,
    DataGridHeaderRenderer,
} from './renderer';
import type {
    DataGridValueFormatter,
    DataGridValueType,
} from './data-grid-value-type';
import type { PermissionRuleInput } from './permission-rule';

export type ColumnId = string;


export interface ColumnSortComparatorContext<TRow = unknown> {
    rowA: TRow;
    rowB: TRow;
    column: ColumnDef<TRow>;
}

export type ColumnSortComparator<TRow = unknown, TValue = unknown> = (
    valueA: TValue,
    valueB: TValue,
    context: ColumnSortComparatorContext<TRow>,
) => number;


export type ColumnAccessor<TRow = unknown, TValue = unknown> =
    | keyof TRow
    | string
    | ((row: TRow, rowIndex: number) => TValue);

export interface ColumnSizeDef {
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    flex?: number;
}

export interface ColumnSortDef<TRow = unknown, TValue = unknown> {
    enabled?: boolean;
    comparator?: ColumnComparator<TRow, TValue>;
    invert?: boolean;
    sortUndefined?: 'first' | 'last';
}

export type ColumnComparator<TRow = unknown, TValue = unknown> = (
    a: TValue,
    b: TValue,
    rowA: TRow,
    rowB: TRow,
) => number;

export interface ColumnEditDef<TRow = unknown, TValue = unknown> {
    enabled?: boolean;
    editorKey?: string;
    editor?: DataGridCellEditor<TRow, TValue>;
    validate?: ColumnValueValidator<TRow, TValue>;
    parse?: (value: unknown, row: TRow) => TValue;
    serialize?: (value: TValue, row: TRow) => unknown;
    commitOnBlur?: boolean;
}

export type ColumnValueValidator<TRow = unknown, TValue = unknown> = (
    value: TValue,
    row: TRow,
    context: ColumnValueValidatorContext<TRow, TValue>,
) => string | null | undefined | Promise<string | null | undefined>;

export interface ColumnValueValidatorContext<TRow = unknown, TValue = unknown> {
    columnId: string;
    rowIndex: number;
    previousValue: TValue;
    row: TRow;
}

export interface ColumnAggregationDef<TRow = unknown, TValue = unknown> {
    enabled?: boolean;
    type?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom';
    aggregate?: (values: TValue[], rows: TRow[]) => unknown;
    formatter?: (value: unknown) => ReactNode;
}

export interface ColumnDef<TRow = unknown, TValue = unknown> {
    id?: ColumnId;

    /**
     * Used to read cell value from row.
     * Can be a field name, dot-path, or custom accessor function.
     */
    accessor?: ColumnAccessor<TRow, TValue>;

    /**
     * Optional explicit key for simple field-based columns.
     */
    field?: keyof TRow | string;

    header?: ReactNode;
    label?: string;
    description?: string;

    valueType?: DataGridValueType;

    size?: ColumnSizeDef;
    width?: number;
    minWidth?: number;
    maxWidth?: number;

    pinned?: 'left' | 'right' | false;

    /**
 * Whether this column is visible by default.
 *
 * Runtime visibility can still be controlled by ColumnVisibilityState.
 *
 * Default: true
 */
    visible?: boolean;
    hideable?: boolean;

    sortable?: boolean | ColumnSortDef<TRow, TValue>;
    enableSorting?: boolean | ColumnSortDef<TRow, TValue>;
    filterable?: boolean | ColumnFilterDef<TRow, TValue>;
    enableFiltering?: boolean | ColumnFilterDef<TRow, TValue>;

    searchable?: boolean;


    /**
     * Custom comparator for sorting this column.
     */
    sortComparator?: ColumnSortComparator<TRow, TValue>;
    groupable?: boolean;
    aggregatable?: boolean | ColumnAggregationDef<TRow, TValue>;

    editable?: boolean | ColumnEditDef<TRow, TValue>;
    enableEditing?: boolean | ColumnEditDef<TRow, TValue>;

    resizable?: boolean;
    reorderable?: boolean;

    exportable?: boolean;
    printable?: boolean;
    accessorKey?: string;
    permission?: PermissionRuleInput<TRow>;

    formatter?: DataGridValueFormatter<TValue, TRow>;
    rendererKey?: string;
    editorKey?: string;
    filterRendererKey?: string;

    cellRenderer?: DataGridCellRenderer<TRow, TValue>;
    headerRenderer?: DataGridHeaderRenderer<TRow>;
    footerRenderer?: DataGridFooterRenderer<TRow>;
    accessorFn?: (row: TRow) => TValue;
    getCellClassName?: (row: TRow, rowIndex: number, value: TValue) => string | undefined;
    getCellStyle?: (
        row: TRow,
        rowIndex: number,
        value: TValue,
    ) => React.CSSProperties | undefined;

    meta?: ColumnMeta;

    children?: Array<ColumnDef<TRow, unknown>>;

    canView?: boolean | ((row?: TRow) => boolean);
    canEdit?: boolean | ((row?: TRow) => boolean);
    canFilter?: boolean | ((row?: TRow) => boolean);
    canSort?: boolean | ((row?: TRow) => boolean);
    canExport?: boolean | ((row?: TRow) => boolean);
    permissions?: {
        view?: boolean | ((row?: TRow) => boolean);
        edit?: boolean | ((row?: TRow) => boolean);
        filter?: boolean | ((row?: TRow) => boolean);
        sort?: boolean | ((row?: TRow) => boolean);
        export?: boolean | ((row?: TRow) => boolean);
    };

}

export type AnyColumnDef = ColumnDef<any, any>;

export interface NormalizedColumnDef<TRow = unknown, TValue = unknown>
    extends Omit<ColumnDef<TRow, TValue>, 'id' | 'children'> {
    id: ColumnId;
    depth: number;
    parentId?: ColumnId;
    leaf: boolean;
    children?: Array<NormalizedColumnDef<TRow, unknown>>;
}

export type ColumnDefInput<TRow = unknown> = Array<ColumnDef<TRow, unknown>>;


export interface DataGridColumnDef {
    id: string;
    field?: string;
    headerName?: string;
    columns?: DataGridColumnDef[];
    [key: string]: unknown;
}

export interface DataGridSchema {
    columns: DataGridColumnDef[];
    rowIdKey?: string;
    [key: string]: unknown;
}

export interface DataGridResolvedSchema extends DataGridSchema {
    columns: DataGridColumnDef[];
    columnMap: Record<string, DataGridColumnDef>;
    leafColumns: DataGridColumnDef[];
    rowIdKey: string;
}