import type {
    FilterSlice,
    TableStoreState,
} from '../table-store.types';
import type { StoreApi } from '../create-table-store';

export function createFilterSlice(
    api: StoreApi<TableStoreState & Partial<FilterSlice>>,
    defaults: TableStoreState,
): FilterSlice {
    return {
        setFilters(filters) {
            api.setState((prev) => ({
                filters: {
                    ...prev.filters,
                    items: [...filters],
                },
            }));
        },

        upsertFilter(filter) {
            api.setState((prev) => {
                const exists = prev.filters.items.some((item) => item.id === filter.id);

                return {
                    filters: {
                        ...prev.filters,
                        items: exists
                            ? prev.filters.items.map((item) =>
                                item.id === filter.id ? filter : item,
                            )
                            : [...prev.filters.items, filter],
                    },
                };
            });
        },

        removeFilter(filterId) {
            api.setState((prev) => ({
                filters: {
                    ...prev.filters,
                    items: prev.filters.items.filter((item) => item.id !== filterId),
                },
            }));
        },

        clearFilters() {
            api.setState((prev) => ({
                filters: {
                    ...prev.filters,
                    items: [],
                },
            }));
        },

        setFilterLogic(logic) {
            api.setState((prev) => ({
                filters: {
                    ...prev.filters,
                    logicOperator: logic,
                },
            }));
        },

        resetFilters() {
            api.setState({
                filters: {
                    items: [...defaults.filters.items],
                    logicOperator: defaults.filters.logicOperator,
                    search: defaults.filters.search,
                },
            });
        },
    };
}
