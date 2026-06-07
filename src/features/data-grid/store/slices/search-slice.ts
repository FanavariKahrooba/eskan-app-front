import type {
    SearchSlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createSearchSlice(
    api: StoreApi<TableStoreState & Partial<SearchSlice>>,
    defaults: TableStoreState,
): SearchSlice {
    return {
        setSearchQuery(query) {
            api.setState((prev) => ({
                search: {
                    ...prev.search,
                    query,
                },
            }));
        },

        clearSearch() {
            api.setState((prev) => ({
                search: {
                    ...prev.search,
                    query: '',
                },
            }));
        },

        resetSearch() {
            api.setState({
                search: {
                    ...defaults.search,
                },
            });
        },
    };
}
