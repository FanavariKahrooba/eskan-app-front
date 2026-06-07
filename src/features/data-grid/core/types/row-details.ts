import type { ReactNode } from 'react';

export interface RowDetailsContext<TRow = unknown> {
    row: TRow;
    rowId: string;
    rowIndex: number;
}

export type RowDetailsRenderer<TRow = unknown> = (
    context: RowDetailsContext<TRow>,
) => ReactNode;

export interface RowDetailsConfig<TRow = unknown> {
    enabled?: boolean;
    lazy?: boolean;
    renderer?: RowDetailsRenderer<TRow>;
    cache?: boolean;
    maxExpandedRows?: number;
}


export type RowDetailsExpansionMap = Record<string, boolean>;

export interface RowDetailsState {
    /**
     * key: rowId
     * value: expanded or collapsed
     */
    expandedRowIds: RowDetailsExpansionMap;
}

export const DEFAULT_ROW_DETAILS_STATE: RowDetailsState = {
    expandedRowIds: {},
};