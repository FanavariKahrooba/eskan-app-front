import type { RowDetailsState } from '../../types';
import { getRowId } from '../../utils';

export interface ApplyRowExpansionItem<TRow = unknown> {
    row: TRow;
    rowId: string;
    index: number;
    expanded: boolean;
}

export interface ApplyRowExpansionResult<TRow = unknown> {
    rows: Array<ApplyRowExpansionItem<TRow>>;
    expandedRowIds: string[];
    expandedRows: TRow[];
    expandedCount: number;
    isAnyExpanded: boolean;
}

export interface ApplyRowExpansionOptions<TRow = unknown> {
    rows: TRow[];
    rowDetailsState?: RowDetailsState;
    getRowId?: (row: TRow, index: number) => string;
}

export const applyRowExpansion = <TRow = unknown>(
    options: ApplyRowExpansionOptions<TRow>,
): ApplyRowExpansionResult<TRow> => {
    const { rows, rowDetailsState, getRowId: getRowIdFromOptions } = options;

    const expandedMap = rowDetailsState?.expandedRowIds ?? {};

    const mappedRows = rows.map((row, index) => {
        const rowId = getRowId(row, index, {
            getRowId: getRowIdFromOptions,
        });

        return {
            row,
            rowId,
            index,
            expanded: Boolean(expandedMap[rowId]),
        };
    });

    const expandedItems = mappedRows.filter((item) => item.expanded);

    return {
        rows: mappedRows,
        expandedRowIds: expandedItems.map((item) => item.rowId),
        expandedRows: expandedItems.map((item) => item.row),
        expandedCount: expandedItems.length,
        isAnyExpanded: expandedItems.length > 0,
    };
};
