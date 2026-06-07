export interface FinanceGridPresetOptions {
    currency?: string;
    locale?: string;
    enableExport?: boolean;
    enableAggregation?: boolean;
}

export function createFinanceGridPreset(
    options: FinanceGridPresetOptions = {},
) {
    const {
        currency = 'IRR',
        locale = 'fa-IR',
        enableExport = true,
        enableAggregation = true,
    } = options;

    return {
        features: {
            search: true,
            filtering: true,
            sorting: true,
            pagination: true,
            columnVisibility: true,
            columnOrdering: true,
            columnSizing: true,
            aggregation: enableAggregation,
            export: enableExport,
            toolbar: true,
        },

        density: 'comfortable',

        meta: {
            finance: {
                currency,
                locale,
            },
        },

        defaultColumnMeta: {
            currency,
            locale,
            align: 'end',
        },
    };
}
