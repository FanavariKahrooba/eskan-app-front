import type {
    SortingSlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createSortingSlice(
    api: StoreApi<TableStoreState & Partial<SortingSlice>>,
    defaults: TableStoreState,
): SortingSlice {
    return {
        setSorting(sorting) {
            api.setState({
                sorting: {
                    sortModel: [...sorting],
                },
            });
        },

        toggleSort(columnId) {
            api.setState((prev) => {
                const current = prev.sorting.sortModel;
                const existing = current.find((item: any) => item.columnId === columnId);

                if (!existing) {
                    return {
                        sorting: {
                            sortModel: [
                                {
                                    columnId,
                                    direction: 'asc',
                                },
                            ],
                        },
                    };
                }

                if (existing.direction === 'asc') {
                    return {
                        sorting: {
                            sortModel: current.map((item: any) =>
                                item.columnId === columnId
                                    ? {
                                        ...item,
                                        direction: 'desc',
                                    }
                                    : item,
                            ),
                        },
                    };
                }

                return {
                    sorting: {
                        sortModel: current.filter((item: any) => item.columnId !== columnId),
                    },
                };
            });
        },

        clearSorting() {
            api.setState({
                sorting: {
                    sortModel: [],
                },
            });
        },

        resetSorting() {
            api.setState({
                sorting: {
                    sortModel: [...defaults.sorting.sortModel],
                },
            });
        },
    };
}
