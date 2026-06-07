import type { ColumnDef, ColumnVisibilityState } from '../../types';
import { getColumnId } from '../../utils';

export interface ApplyColumnVisibilityOptions<TRow = unknown> {
  columns: Array<ColumnDef<TRow>>;
  columnVisibilityState?: ColumnVisibilityState;
}

export const applyColumnVisibility = <TRow = unknown>(
  options: ApplyColumnVisibilityOptions<TRow>,
): Array<ColumnDef<TRow>> => {
  const { columns, columnVisibilityState } = options;
  const visibility = columnVisibilityState?.visibility ?? {};

  return columns.filter((column) => {
    const columnId = getColumnId(column);

    if (column.visible === false) {
      return false;
    }

    if (visibility[columnId] === false) {
      return false;
    }

    return true;
  });
};
