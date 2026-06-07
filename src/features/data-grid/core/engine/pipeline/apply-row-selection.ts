import type { RowSelectionState } from '../../types';
import { getRowId } from '../../utils';

export interface ApplyRowSelectionItem<TRow = unknown> {
    row: TRow;
    rowId: string;
    index: number;
    selected: boolean;
}

export interface ApplyRowSelectionResult<TRow = unknown> {
    rows: Array<ApplyRowSelectionItem<TRow>>;
    selectedRowIds: string[];
    selectedRows: TRow[];
    selectedCount: number;
    isAllSelected: boolean;
    isSomeSelected: boolean;
}

export interface ApplyRowSelectionOptions<TRow = unknown> {
    rows: TRow[];
    rowSelectionState?: RowSelectionState;
    getRowId?: (row: TRow, index: number) => string;
}

export const applyRowSelection = <TRow = unknown>(
    options: ApplyRowSelectionOptions<TRow>,
): ApplyRowSelectionResult<TRow> => {
    const { rows, rowSelectionState, getRowId: getRowIdFromOptions } = options;

    const selectedMap = rowSelectionState?.selectedRowIds ?? {};

    const mappedRows = rows.map((row, index) => {
        const rowId = getRowId(row, index, {
            getRowId: getRowIdFromOptions,
        });

        return {
            row,
            rowId,
            index,
            selected: Boolean(selectedMap[rowId]),
        };
    });

    const selectedRows = mappedRows.filter((item) => item.selected).map((item) => item.row);
    const selectedRowIds = mappedRows.filter((item) => item.selected).map((item) => item.rowId);
    const selectedCount = selectedRows.length;
    const total = mappedRows.length;

    return {
        rows: mappedRows,
        selectedRowIds,
        selectedRows,
        selectedCount,
        isAllSelected: total > 0 && selectedCount === total,
        isSomeSelected: selectedCount > 0 && selectedCount < total,
    };
};
