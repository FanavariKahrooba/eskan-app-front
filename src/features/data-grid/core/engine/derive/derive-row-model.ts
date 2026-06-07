import type { ColumnDef, RowSelectionState } from '../../types';

import { getColumnId, getRowId, resolveCellValue } from '../../utils';

export interface DerivedCell<TRow = unknown, TValue = unknown> {
    rowId: string;
    columnId: string;
    row: TRow;
    column: ColumnDef<TRow, TValue>;
    value: TValue;
}

export interface DerivedRow<TRow = unknown> {
    id: string;
    row: TRow;
    index: number;
    selected: boolean;
    disabled: boolean;
    cells: Record<string, DerivedCell<TRow>>;
}

export interface DerivedRowModel<TRow = unknown> {
    rows: Array<DerivedRow<TRow>>;
    rowIds: string[];
    rowMap: Map<string, DerivedRow<TRow>>;
}

export interface DeriveRowModelOptions<TRow = unknown> {
    rows: TRow[];
    columns: Array<ColumnDef<TRow>>;
    getRowId?: (row: TRow, index: number) => string;
    rowSelection?: RowSelectionState;
    isRowDisabled?: (row: TRow, index: number) => boolean;
}

export function deriveRowModel<TRow = unknown>(
    options: DeriveRowModelOptions<TRow>,
): DerivedRowModel<TRow> {
    const {
        rows,
        columns,
        getRowId: customGetRowId,
        rowSelection,
        isRowDisabled,
    } = options;

    const derivedRows: Array<DerivedRow<TRow>> = [];
    const rowMap = new Map<string, DerivedRow<TRow>>();

    rows.forEach((row, index) => {
        const id = getRowId(row, index, customGetRowId);

        const cells: Record<string, DerivedCell<TRow>> = {};

        for (const column of columns) {
            const columnId = getColumnId(column);

            cells[columnId] = {
                rowId: id,
                columnId,
                row,
                column,
                value: resolveCellValue(row, column),
            };
        }

        const derivedRow: DerivedRow<TRow> = {
            id,
            row,
            index,
            selected: rowSelection?.selectedRowIds?.[id] === true,
            disabled: isRowDisabled?.(row, index) === true,
            cells,
        };

        derivedRows.push(derivedRow);
        rowMap.set(id, derivedRow);
    });

    return {
        rows: derivedRows,
        rowIds: derivedRows.map((row) => row.id),
        rowMap,
    };
}
