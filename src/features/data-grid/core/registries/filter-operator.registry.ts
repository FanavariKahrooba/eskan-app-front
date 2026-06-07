import { ColumnDef } from "../types";

export interface FilterOperatorContext<TRow = unknown, TValue = unknown> {
    row: TRow;
    rowIndex: number;

    column: ColumnDef<TRow, TValue>;
    columnId: string;

    cellValue: TValue;
    filterValue: unknown;
}

export type FilterOperatorPredicate<TRow = unknown, TValue = unknown> = (
    context: FilterOperatorContext<TRow, TValue>,
) => boolean;

export interface FilterOperatorDefinition<TRow = unknown, TValue = unknown> {
    id: string;
    label?: string;
    predicate: FilterOperatorPredicate<TRow, TValue>;
}

export class FilterOperatorRegistry {
    private readonly operators = new Map<string, FilterOperatorDefinition>();

    register<TRow = unknown, TValue = unknown>(
        definition: FilterOperatorDefinition<TRow, TValue>,
    ): this {
        if (!definition.id.trim()) {
            throw new Error('Filter operator id is required.');
        }

        this.operators.set(definition.id, definition as FilterOperatorDefinition);

        return this;
    }

    registerMany(definitions: FilterOperatorDefinition[]): this {
        for (const definition of definitions) {
            this.register(definition);
        }

        return this;
    }

    get<TRow = unknown, TValue = unknown>(
        id: string | undefined | null,
    ): FilterOperatorDefinition<TRow, TValue> | undefined {
        if (!id) return undefined;

        return this.operators.get(id) as
            | FilterOperatorDefinition<TRow, TValue>
            | undefined;
    }

    getPredicate<TRow = unknown, TValue = unknown>(
        id: string | undefined | null,
    ): FilterOperatorPredicate<TRow, TValue> | undefined {
        return this.get<TRow, TValue>(id)?.predicate;
    }

    has(id: string): boolean {
        return this.operators.has(id);
    }

    unregister(id: string): boolean {
        return this.operators.delete(id);
    }

    clear(): void {
        this.operators.clear();
    }

    entries(): FilterOperatorDefinition[] {
        return Array.from(this.operators.values());
    }

    ids(): string[] {
        return Array.from(this.operators.keys());
    }
}

function normalize(value: unknown): string {
    if (value === null || value === undefined) return '';

    return String(value).toLowerCase().trim();
}

function toNumber(value: unknown): number | null {
    if (typeof value === 'number') {
        return Number.isNaN(value) ? null : value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
        const numericValue = Number(value);

        return Number.isNaN(numericValue) ? null : numericValue;
    }

    return null;
}

export const filterOperatorRegistry = new FilterOperatorRegistry();

filterOperatorRegistry.registerMany([
    {
        id: 'equals',
        label: 'Equals',
        predicate: ({ cellValue, filterValue }) => cellValue === filterValue,
    },
    {
        id: 'notEquals',
        label: 'Not equals',
        predicate: ({ cellValue, filterValue }) => cellValue !== filterValue,
    },
    {
        id: 'contains',
        label: 'Contains',
        predicate: ({ cellValue, filterValue }) => {
            const source = normalize(cellValue);
            const target = normalize(filterValue);

            if (!target) return true;

            return source.includes(target);
        },
    },
    {
        id: 'notContains',
        label: 'Not contains',
        predicate: ({ cellValue, filterValue }) => {
            const source = normalize(cellValue);
            const target = normalize(filterValue);

            if (!target) return true;

            return !source.includes(target);
        },
    },
    {
        id: 'startsWith',
        label: 'Starts with',
        predicate: ({ cellValue, filterValue }) => {
            const source = normalize(cellValue);
            const target = normalize(filterValue);

            if (!target) return true;

            return source.startsWith(target);
        },
    },
    {
        id: 'endsWith',
        label: 'Ends with',
        predicate: ({ cellValue, filterValue }) => {
            const source = normalize(cellValue);
            const target = normalize(filterValue);

            if (!target) return true;

            return source.endsWith(target);
        },
    },
    {
        id: 'greaterThan',
        label: 'Greater than',
        predicate: ({ cellValue, filterValue }) => {
            const source = toNumber(cellValue);
            const target = toNumber(filterValue);

            if (source === null || target === null) return false;

            return source > target;
        },
    },
    {
        id: 'greaterThanOrEqual',
        label: 'Greater than or equal',
        predicate: ({ cellValue, filterValue }) => {
            const source = toNumber(cellValue);
            const target = toNumber(filterValue);

            if (source === null || target === null) return false;

            return source >= target;
        },
    },
    {
        id: 'lessThan',
        label: 'Less than',
        predicate: ({ cellValue, filterValue }) => {
            const source = toNumber(cellValue);
            const target = toNumber(filterValue);

            if (source === null || target === null) return false;

            return source < target;
        },
    },
    {
        id: 'lessThanOrEqual',
        label: 'Less than or equal',
        predicate: ({ cellValue, filterValue }) => {
            const source = toNumber(cellValue);
            const target = toNumber(filterValue);

            if (source === null || target === null) return false;

            return source <= target;
        },
    },
    {
        id: 'isEmpty',
        label: 'Is empty',
        predicate: ({ cellValue }) =>
            cellValue === null || cellValue === undefined || String(cellValue) === '',
    },
    {
        id: 'isNotEmpty',
        label: 'Is not empty',
        predicate: ({ cellValue }) =>
            !(cellValue === null || cellValue === undefined || String(cellValue) === ''),
    },
]);
