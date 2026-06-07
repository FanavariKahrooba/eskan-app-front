export const DATA_GRID_STORAGE_PREFIX = 'data-grid';

export const DATA_GRID_STORAGE_KEYS = {
  state: 'state',
  viewPreset: 'view-preset',
  columnVisibility: 'column-visibility',
  columnOrder: 'column-order',
  columnSizing: 'column-sizing',
  columnPinning: 'column-pinning',
  sorting: 'sorting',
  filters: 'filters',
  pagination: 'pagination',
  density: 'density',
} as const;

export type DataGridStorageKey =
  (typeof DATA_GRID_STORAGE_KEYS)[keyof typeof DATA_GRID_STORAGE_KEYS];

export function createDataGridStorageKey(
  gridId: string,
  key: DataGridStorageKey,
): string {
  return `${DATA_GRID_STORAGE_PREFIX}:${gridId}:${key}`;
}

export function createDataGridStateStorageKey(gridId: string): string {
  return createDataGridStorageKey(gridId, DATA_GRID_STORAGE_KEYS.state);
}
