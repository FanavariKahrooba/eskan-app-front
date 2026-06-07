import type {
    ColumnPinningSlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

function removeFromArray(items: string[], value: string): string[] {
    return items.filter((item) => item !== value);
}

export function createColumnPinningSlice(
    api: StoreApi<TableStoreState & Partial<ColumnPinningSlice>>,
    defaults: TableStoreState,
): ColumnPinningSlice {
    return {
        setPinnedLeft(columnIds) {
            const current = api.getState().columnPinning;

            api.setState({
                columnPinning: {
                    left: [...columnIds],
                    right: current.right.filter((id) => !columnIds.includes(id)),
                },
            });
        },

        setPinnedRight(columnIds) {
            const current = api.getState().columnPinning;

            api.setState({
                columnPinning: {
                    left: current.left.filter((id) => !columnIds.includes(id)),
                    right: [...columnIds],
                },
            });
        },

        pinColumnLeft(columnId) {
            const current = api.getState().columnPinning;

            api.setState({
                columnPinning: {
                    left: current.left.includes(columnId)
                        ? current.left
                        : [...current.left, columnId],
                    right: removeFromArray(current.right, columnId),
                },
            });
        },

        pinColumnRight(columnId) {
            const current = api.getState().columnPinning;

            api.setState({
                columnPinning: {
                    left: removeFromArray(current.left, columnId),
                    right: current.right.includes(columnId)
                        ? current.right
                        : [...current.right, columnId],
                },
            });
        },

        unpinColumn(columnId) {
            const current = api.getState().columnPinning;

            api.setState({
                columnPinning: {
                    left: removeFromArray(current.left, columnId),
                    right: removeFromArray(current.right, columnId),
                },
            });
        },

        resetColumnPinning() {
            api.setState({
                columnPinning: {
                    left: [...defaults.columnPinning.left],
                    right: [...defaults.columnPinning.right],
                },
            });
        },
    };
}
