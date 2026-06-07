import type { DataGridState } from '../core/types';
import {
    DEFAULT_PAGE_INDEX,
    DEFAULT_PAGE_SIZE,
} from '../constants';

export interface CreateDefaultTableStateOptions {
    initialState?: Partial<DataGridState>;
}

export function createDefaultTableState(
    options: CreateDefaultTableStateOptions = {},
): DataGridState {
    const { initialState } = options;

    const defaultState = {
        search: '',

        sorting: [],

        filters: [],

        pagination: {
            pageIndex: DEFAULT_PAGE_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,
            totalRows: 0,
            pageCount: 0,
        },

        columnVisibility: {},
        columnOrder: [],
        columnPinning: {
            left: [],
            right: [],
        },
        columnSizing: {},

        rowSelection: {},
        rowExpansion: {},
        rowEditing: {
            editingRowId: null,
            editingCell: null,
            draftValues: {},
        },

        grouping: [],
        aggregation: {},

        rowDnd: {
            draggingRowId: null,
            overRowId: null,
        },

        toolbar: {
            searchValue: '',
            filtersOpen: false,
            columnsOpen: false,
            densityOpen: false,
        },

        viewPreset: null,

        loading: false,
        error: null,
    };

    return {
        ...defaultState,
        ...initialState,

        pagination: {
            ...defaultState.pagination,
            ...(initialState as any)?.pagination,
        },

        columnPinning: {
            ...defaultState.columnPinning,
            ...(initialState as any)?.columnPinning,
        },

        rowEditing: {
            ...defaultState.rowEditing,
            ...(initialState as any)?.rowEditing,
        },

        rowDnd: {
            ...defaultState.rowDnd,
            ...(initialState as any)?.rowDnd,
        },

        toolbar: {
            ...defaultState.toolbar,
            ...(initialState as any)?.toolbar,
        },
    } as any;
}
