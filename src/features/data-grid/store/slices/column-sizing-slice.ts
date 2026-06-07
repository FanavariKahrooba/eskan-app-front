import type {
  ColumnSizingSlice,
  TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createColumnSizingSlice(
  api: StoreApi<TableStoreState & Partial<ColumnSizingSlice>>,
  defaults: TableStoreState,
): ColumnSizingSlice {
  return {
    setColumnSize(columnId, width) {
      api.setState((prev) => ({
        columnSizing: {
          sizes: {
            ...prev.columnSizing.sizes,
            [columnId]: width,
          },
        },
      }));
    },

    setColumnSizes(sizes) {
      api.setState({
        columnSizing: {
          sizes: {
            ...sizes,
          },
        },
      });
    },

    resetColumnSizing() {
      api.setState({
        columnSizing: {
          sizes: {
            ...defaults.columnSizing.sizes,
          },
        },
      });
    },
  };
}
