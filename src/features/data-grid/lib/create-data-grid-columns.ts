import type { ColumnDef } from '../core/types';
import { normalizeColumns, type NormalizeColumnsOptions } from './normalize-columns';

export interface CreateDataGridColumnsOptions extends NormalizeColumnsOptions { }

export function createDataGridColumns<TRow>(
    columns: Array<ColumnDef<TRow>>,
    options: CreateDataGridColumnsOptions = {},
): Array<ColumnDef<TRow>> {
    return normalizeColumns(columns, options);
}
