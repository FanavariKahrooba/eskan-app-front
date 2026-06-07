import type { ColumnDef, ColumnPinningState } from '../../types';
import { getColumnId } from '../../utils';

export interface ApplyColumnPinningResult<TRow = unknown> {
  left: Array<ColumnDef<TRow>>;
  center: Array<ColumnDef<TRow>>;
  right: Array<ColumnDef<TRow>>;
  ordered: Array<ColumnDef<TRow>>;
}

export interface ApplyColumnPinningOptions<TRow = unknown> {
  columns: Array<ColumnDef<TRow>>;
  columnPinningState?: ColumnPinningState;
}

export const applyColumnPinning = <TRow = unknown>(
  options: ApplyColumnPinningOptions<TRow>,
): ApplyColumnPinningResult<TRow> => {
  const { columns, columnPinningState } = options;

  const leftIds = new Set(columnPinningState?.left ?? []);
  const rightIds = new Set(columnPinningState?.right ?? []);

  const left: Array<ColumnDef<TRow>> = [];
  const center: Array<ColumnDef<TRow>> = [];
  const right: Array<ColumnDef<TRow>> = [];

  for (const column of columns) {
    const columnId = getColumnId(column);

    if (leftIds.has(columnId)) {
      left.push(column);
      continue;
    }

    if (rightIds.has(columnId)) {
      right.push(column);
      continue;
    }

    center.push(column);
  }

  return {
    left,
    center,
    right,
    ordered: [...left, ...center, ...right],
  };
};
