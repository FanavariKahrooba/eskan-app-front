import type { TableStoreState } from './table-store.types';

export function createDefaultTableStoreState(): TableStoreState {
    return {
        columnOrder: {
            orderedColumnIds: [],
        },
        columnPinning: {
            left: [],
            right: [],
        },
        columnSizing: {
            sizes: {},
        },
        columnVisibility: {
            visibility: {},
        },
        filters: {
            items: [],
            logicOperator: 'and',
        },
        pagination: {
            pageIndex: 0,
            pageSize: 10,
            total: 0,
        },
        rowEditing: {
            activeCell: null,
            draftValues: {},
        },
        rowExpansion: {
            expandedRowIds: {},
        },
        rowSelection: {
            selectedRowIds: {},
        },
        search: {
            query: '',
        },
        sorting: {
            sortModel: [],
        },
        toolbar: {
            density: 'md',
            isFullscreen: false,
            isColumnManagerOpen: false,
        },
        viewPresets: [],
        activeViewPresetId: null,
    };
}
