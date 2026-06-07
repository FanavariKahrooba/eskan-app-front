import type {
    PaginationSlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createPaginationSlice(
    api: StoreApi<TableStoreState & Partial<PaginationSlice>>,
    defaults: TableStoreState,
): PaginationSlice {
    return {
        setPagination(pagination) {
            api.setState({
                pagination: {
                    ...pagination,
                },
            });
        },

        setPage(pageIndex) {
            api.setState((prev) => ({
                pagination: {
                    ...prev.pagination,
                    pageIndex,
                },
            }));
        },

        setPageSize(pageSize) {
            api.setState((prev) => ({
                pagination: {
                    ...prev.pagination,
                    pageSize,
                    pageIndex: 0,
                },
            }));
        },

        resetPagination() {
            api.setState({
                pagination: {
                    ...defaults.pagination,
                },
            });
        },
    };
}
