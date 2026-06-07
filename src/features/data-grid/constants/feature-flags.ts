export interface DataGridFeatureFlags {
    search: boolean;
    filtering: boolean;
    sorting: boolean;
    pagination: boolean;

    columnVisibility: boolean;
    columnOrdering: boolean;
    columnPinning: boolean;
    columnSizing: boolean;
    columnDnd: boolean;

    rowSelection: boolean;
    rowExpansion: boolean;
    rowEditing: boolean;
    rowDnd: boolean;

    grouping: boolean;
    aggregation: boolean;

    export: boolean;
    virtualization: boolean;
    persistence: boolean;
    toolbar: boolean;
}

export const DEFAULT_DATA_GRID_FEATURE_FLAGS: DataGridFeatureFlags = {
    search: true,
    filtering: true,
    sorting: true,
    pagination: true,

    columnVisibility: true,
    columnOrdering: true,
    columnPinning: false,
    columnSizing: true,
    columnDnd: false,

    rowSelection: false,
    rowExpansion: false,
    rowEditing: false,
    rowDnd: false,

    grouping: false,
    aggregation: false,

    export: false,
    virtualization: false,
    persistence: false,
    toolbar: true,
};

export type DataGridFeatureFlagKey = keyof DataGridFeatureFlags;

export function mergeFeatureFlags(
    flags?: Partial<DataGridFeatureFlags>,
): DataGridFeatureFlags {
    return {
        ...DEFAULT_DATA_GRID_FEATURE_FLAGS,
        ...flags,
    };
}

export function isFeatureEnabled(
    flags: Partial<DataGridFeatureFlags> | undefined,
    key: DataGridFeatureFlagKey,
): boolean {
    return Boolean(mergeFeatureFlags(flags)[key]);
}
