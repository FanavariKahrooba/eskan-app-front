import type {
    ColumnOrderSlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createColumnOrderSlice(
    api: StoreApi<TableStoreState & Partial<ColumnOrderSlice>>,
    defaults: TableStoreState,
): ColumnOrderSlice {
    return {
        setColumnOrder(orderedColumnIds) {
            api.setState({
                columnOrder: {
                    orderedColumnIds: [...orderedColumnIds],
                },
            });
        },

        resetColumnOrder() {
            api.setState({
                columnOrder: {
                    orderedColumnIds: [...defaults.columnOrder.orderedColumnIds],
                },
            });
        },
    };
}
