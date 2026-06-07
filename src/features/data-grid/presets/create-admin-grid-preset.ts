export interface AdminGridPresetOptions {
    enableBulkActions?: boolean;
    enableExport?: boolean;
    enablePersistence?: boolean;
    enableColumnPinning?: boolean;
    enableVirtualization?: boolean;
}

export function createAdminGridPreset(
    options: AdminGridPresetOptions = {},
) {
    const {
        enableBulkActions = true,
        enableExport = true,
        enablePersistence = true,
        enableColumnPinning = true,
        enableVirtualization = false,
    } = options;

    return {
        features: {
            search: true,
            filtering: true,
            sorting: true,
            pagination: true,

            columnVisibility: true,
            columnOrdering: true,
            columnPinning: enableColumnPinning,
            columnSizing: true,
            columnDnd: true,

            rowSelection: enableBulkActions,
            rowExpansion: true,
            rowEditing: true,

            export: enableExport,
            persistence: enablePersistence,
            virtualization: enableVirtualization,
            toolbar: true,
        },

        pagination: {
            pageSize: 20,
            pageSizeOptions: [10, 20, 50, 100],
        },

        density: 'compact',

        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 20,
            },
        },
    };
}
