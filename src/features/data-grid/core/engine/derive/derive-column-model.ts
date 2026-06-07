import type {
    ColumnDef,
    ColumnOrderState,
    ColumnPinningState,
    ColumnSizingState,
    ColumnVisibilityState,
} from '../../types';

import { getColumnId, getColumnWidth } from '../../utils';
import {
    applyColumnOrder,
    applyColumnPinning,
    applyColumnVisibility,
} from '../pipeline';

export type DerivedColumnPinPosition = 'left' | 'right' | false;

export interface DerivedColumn<TRow = unknown, TValue = unknown> {
    id: string;
    column: ColumnDef<TRow, TValue>;
    index: number;
    visible: boolean;
    pinned: DerivedColumnPinPosition;
    width: number;
}

export interface DerivedColumnModel<TRow = unknown> {
    allColumns: Array<DerivedColumn<TRow>>;
    orderedColumns: Array<DerivedColumn<TRow>>;
    visibleColumns: Array<DerivedColumn<TRow>>;
    leftPinnedColumns: Array<DerivedColumn<TRow>>;
    centerColumns: Array<DerivedColumn<TRow>>;
    rightPinnedColumns: Array<DerivedColumn<TRow>>;
    columnIds: string[];
    visibleColumnIds: string[];
    columnMap: Map<string, DerivedColumn<TRow>>;
}

export interface DeriveColumnModelOptions<TRow = unknown> {
    columns: Array<ColumnDef<TRow>>;
    columnOrder?: ColumnOrderState;
    columnVisibility?: ColumnVisibilityState;
    columnPinning?: ColumnPinningState;
    columnSizing?: ColumnSizingState;
}

export function deriveColumnModel<TRow = unknown>(
    options: DeriveColumnModelOptions<TRow>,
): DerivedColumnModel<TRow> {
    const {
        columns,
        columnOrder,
        columnVisibility,
        columnPinning,
        columnSizing,
    } = options;

    const orderedRawColumns = applyColumnOrder({
        columns,
        orderedColumnIds: columnOrder?.orderedColumnIds ?? [],
    });

    const visibleRawColumns = applyColumnVisibility({
        columns: orderedRawColumns,
        visibility: columnVisibility?.visibility ?? {},
    });

    const pinnedRawColumns = applyColumnPinning({
        columns: visibleRawColumns,
        pinning: columnPinning ?? {
            left: [],
            right: [],
        },
    });

    const pinnedMap = new Map<string, Exclude<DerivedColumnPinPosition, false>>();

    for (const column of pinnedRawColumns.left) {
        pinnedMap.set(getColumnId(column), 'left');
    }

    for (const column of pinnedRawColumns.right) {
        pinnedMap.set(getColumnId(column), 'right');
    }

    const allColumns: Array<DerivedColumn<TRow>> = columns.map((column, index) => {
        const id = getColumnId(column);

        return {
            id,
            column,
            index,
            visible:
                column.visible !== false &&
                columnVisibility?.visibility?.[id] !== false,
            pinned: pinnedMap.get(id) ?? false,
            width: getColumnWidth(column, columnSizing?.sizes?.[id]),
        };
    });

    const columnMap = new Map<string, DerivedColumn<TRow>>();

    for (const derivedColumn of allColumns) {
        columnMap.set(derivedColumn.id, derivedColumn);
    }

    const orderedColumns = orderedRawColumns
        .map((column) => columnMap.get(getColumnId(column)))
        .filter(Boolean) as Array<DerivedColumn<TRow>>;

    const visibleColumns = visibleRawColumns
        .map((column) => columnMap.get(getColumnId(column)))
        .filter(Boolean) as Array<DerivedColumn<TRow>>;

    const leftPinnedColumns = pinnedRawColumns.left
        .map((column) => columnMap.get(getColumnId(column)))
        .filter(Boolean) as Array<DerivedColumn<TRow>>;

    const centerColumns = pinnedRawColumns.center
        .map((column) => columnMap.get(getColumnId(column)))
        .filter(Boolean) as Array<DerivedColumn<TRow>>;

    const rightPinnedColumns = pinnedRawColumns.right
        .map((column) => columnMap.get(getColumnId(column)))
        .filter(Boolean) as Array<DerivedColumn<TRow>>;

    return {
        allColumns,
        orderedColumns,
        visibleColumns,
        leftPinnedColumns,
        centerColumns,
        rightPinnedColumns,
        columnIds: allColumns.map((column) => column.id),
        visibleColumnIds: visibleColumns.map((column) => column.id),
        columnMap,
    };
}
