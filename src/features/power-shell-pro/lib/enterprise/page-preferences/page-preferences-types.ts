export type PageDensity = "comfortable" | "compact";

export interface PageSortState {
    field?: string;
    direction?: "asc" | "desc";
}

export interface PagePreferencesValue {
    activeTab?: string;

    search?: string;

    filters?: Record<string, unknown>;

    sort?: PageSortState;

    pageSize?: number;

    visibleColumns?: string[];

    density?: PageDensity;

    custom?: Record<string, unknown>;
}

export interface PagePreferencesRecord {
    pageKey: string;
    userId?: string;
    value: PagePreferencesValue;
    updatedAt: string;
}

export interface PagePreferencesStorageAdapter {
    getPreferences(params: {
        pageKey: string;
        userId?: string;
    }): Promise<PagePreferencesValue | null>;

    setPreferences(params: {
        pageKey: string;
        userId?: string;
        value: PagePreferencesValue;
    }): Promise<void>;

    resetPreferences(params: {
        pageKey: string;
        userId?: string;
    }): Promise<void>;
}
