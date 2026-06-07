import { DEFAULT_DATA_GRID_FEATURE_FLAGS } from './feature-flags';

export const DEFAULT_DATA_GRID_ID = 'default-data-grid';

export const DEFAULT_PAGE_INDEX = 0;

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_COLUMN_WIDTH = 160;

export const DEFAULT_MIN_COLUMN_WIDTH = 60;

export const DEFAULT_MAX_COLUMN_WIDTH = 600;

export const DEFAULT_ROW_HEIGHT = 44;

export const DEFAULT_HEADER_HEIGHT = 48;

export const DEFAULT_OVERSCAN = 8;

export const DEFAULT_SEARCH_DEBOUNCE_MS = 250;

export const DEFAULT_SERVER_DEBOUNCE_MS = 300;

export const DEFAULT_DATA_GRID_DENSITY = 'comfortable';

export const DEFAULT_EMPTY_MESSAGE = 'داده‌ای برای نمایش وجود ندارد.';

export const DEFAULT_LOADING_MESSAGE = 'در حال بارگذاری...';

export const DEFAULT_ERROR_MESSAGE = 'خطایی رخ داده است.';

export const DEFAULT_DATA_GRID_CONFIG = {
    id: DEFAULT_DATA_GRID_ID,

    pagination: {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    },

    sizing: {
        columnWidth: DEFAULT_COLUMN_WIDTH,
        minColumnWidth: DEFAULT_MIN_COLUMN_WIDTH,
        maxColumnWidth: DEFAULT_MAX_COLUMN_WIDTH,
        rowHeight: DEFAULT_ROW_HEIGHT,
        headerHeight: DEFAULT_HEADER_HEIGHT,
    },

    virtualization: {
        overscan: DEFAULT_OVERSCAN,
    },

    search: {
        debounceMs: DEFAULT_SEARCH_DEBOUNCE_MS,
    },

    server: {
        debounceMs: DEFAULT_SERVER_DEBOUNCE_MS,
    },

    messages: {
        empty: DEFAULT_EMPTY_MESSAGE,
        loading: DEFAULT_LOADING_MESSAGE,
        error: DEFAULT_ERROR_MESSAGE,
    },

    density: DEFAULT_DATA_GRID_DENSITY,

    features: DEFAULT_DATA_GRID_FEATURE_FLAGS,
} as const;
