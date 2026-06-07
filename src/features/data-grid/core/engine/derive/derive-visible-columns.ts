import type {
    ColumnDef,
    ColumnOrderState,
    ColumnPinningState,
    ColumnSizingState,
    ColumnVisibilityState,
} from '../../types';

import {
    deriveColumnModel,
    type DerivedColumn,
    type DerivedColumnModel,
} from './derive-column-model';

export interface VisibleColumnsModel<TRow = unknown> {
    columns: Array<DerivedColumn<TRow>>;
    left: Array<DerivedColumn<TRow>>;
    center: Array<DerivedColumn<TRow>>;
    right: Array<DerivedColumn<TRow>>;
    ids: string[];
    model: DerivedColumnModel<TRow>;
}

export interface DeriveVisibleColumnsOptions<TRow = unknown> {
    columns: Array<ColumnDef<TRow>>;
    columnOrder?: ColumnOrderState;
    columnVisibility?: ColumnVisibilityState;
    columnPinning?: ColumnPinningState;
    columnSizing?: ColumnSizingState;
}

export function deriveVisibleColumns<TRow = unknown>(
    options: DeriveVisibleColumnsOptions<TRow>,
): VisibleColumnsModel<TRow> {
    const model = deriveColumnModel(options);

    return {
        columns: model.visibleColumns,
        left: model.leftPinnedColumns,
        center: model.centerColumns,
        right: model.rightPinnedColumns,
        ids: model.visibleColumnIds,
        model,
    };
}
