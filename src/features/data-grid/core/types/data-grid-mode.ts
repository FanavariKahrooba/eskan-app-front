export type DataGridDataMode = 'client' | 'server' | 'hybrid';

export type DataGridEditMode = 'none' | 'cell' | 'row' | 'form';

export type DataGridSelectionMode = 'none' | 'single' | 'multiple';

export type DataGridDensity = 'compact' | 'standard' | 'comfortable';

export type DataGridLoadingMode = 'blocking' | 'overlay' | 'inline' | 'skeleton';

export type DataGridPaginationMode = 'client' | 'server';

export type DataGridSortingMode = 'client' | 'server';

export type DataGridFilteringMode = 'client' | 'server';

export type DataGridSearchMode = 'client' | 'server';

export type DataGridGroupingMode = 'client' | 'server';

export type DataGridAggregationMode = 'client' | 'server';

export interface DataGridModes {
    data?: DataGridDataMode;
    edit?: DataGridEditMode;
    selection?: DataGridSelectionMode;
    loading?: DataGridLoadingMode;
    pagination?: DataGridPaginationMode;
    sorting?: DataGridSortingMode;
    filtering?: DataGridFilteringMode;
    search?: DataGridSearchMode;
    grouping?: DataGridGroupingMode;
    aggregation?: DataGridAggregationMode;
}
