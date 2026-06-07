import type { FilterState } from "../../core/types";

export interface FiltersPluginOptions {
    enabled?: boolean;
    onFilterStateChange?: (state: FilterState) => void;
}

export interface AddFilterOptions {
    id: string;
    columnId: string;
    operator: string;
    value: unknown;
}

export interface FiltersPlugin {
    key: 'filters';
    enabled: boolean;
    setSearch: (state: FilterState, search: string) => FilterState;
    addFilter: (state: FilterState, filter: AddFilterOptions) => FilterState;
    removeFilter: (state: FilterState, filterId: string) => FilterState;
    clearFilters: (state: FilterState) => FilterState;
}

export function createFiltersPlugin(
    options: FiltersPluginOptions = {},
): FiltersPlugin {
    const { enabled = true, onFilterStateChange } = options;

    return {
        key: 'filters',
        enabled,

        setSearch(state, search) {
            const result: FilterState = {
                ...state,
                search,
                items: state?.items ?? [],
            };

            onFilterStateChange?.(result);
            return result;
        },

        addFilter(state, filter) {
            const items: any = state?.items ?? [];
            const result: FilterState = {
                ...state,
                search: state?.search ?? '',
                items: [...items, filter],
            };

            onFilterStateChange?.(result);
            return result;
        },

        removeFilter(state, filterId) {
            const items = state?.items ?? [];
            const result: FilterState = {
                ...state,
                search: state?.search ?? '',
                items: items.filter((item: any) => item.id !== filterId),
            };

            onFilterStateChange?.(result);
            return result;
        },

        clearFilters(state) {
            const result: FilterState = {
                ...state,
                search: '',
                items: [],
            };

            onFilterStateChange?.(result);
            return result;
        },
    };
}
