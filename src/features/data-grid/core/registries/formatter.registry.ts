import type { ColumnDef } from '../types';

export interface FormatterContext<TRow = unknown, TValue = unknown> {
    row?: TRow;
    rowIndex?: number;
    rowId?: string;

    column?: ColumnDef<TRow, TValue>;
    columnId?: string;
    columnIndex?: number;

    value: TValue;
}

export type Formatter<TRow = unknown, TValue = unknown> = (
    context: FormatterContext<TRow, TValue>,
) => unknown;

export interface FormatterDefinition<TRow = unknown, TValue = unknown> {
    id: string;
    format: Formatter<TRow, TValue>;
}

export class FormatterRegistry {
    private readonly formatters = new Map<string, FormatterDefinition>();

    register<TRow = unknown, TValue = unknown>(
        definition: FormatterDefinition<TRow, TValue>,
    ): this {
        if (!definition.id.trim()) {
            throw new Error('Formatter id is required.');
        }

        this.formatters.set(definition.id, definition as FormatterDefinition);

        return this;
    }

    registerMany(definitions: FormatterDefinition[]): this {
        for (const definition of definitions) {
            this.register(definition);
        }

        return this;
    }

    get<TRow = unknown, TValue = unknown>(
        id: string | undefined | null,
    ): FormatterDefinition<TRow, TValue> | undefined {
        if (!id) return undefined;

        return this.formatters.get(id) as
            | FormatterDefinition<TRow, TValue>
            | undefined;
    }

    getFormatter<TRow = unknown, TValue = unknown>(
        id: string | undefined | null,
    ): Formatter<TRow, TValue> | undefined {
        return this.get<TRow, TValue>(id)?.format;
    }

    format<TRow = unknown, TValue = unknown>(
        id: string | undefined | null,
        context: FormatterContext<TRow, TValue>,
    ): unknown {
        const formatter = this.getFormatter<TRow, TValue>(id);

        if (!formatter) {
            return context.value;
        }

        return formatter(context);
    }

    has(id: string): boolean {
        return this.formatters.has(id);
    }

    unregister(id: string): boolean {
        return this.formatters.delete(id);
    }

    clear(): void {
        this.formatters.clear();
    }

    entries(): FormatterDefinition[] {
        return Array.from(this.formatters.values());
    }

    ids(): string[] {
        return Array.from(this.formatters.keys());
    }
}

export const formatterRegistry = new FormatterRegistry();

formatterRegistry.registerMany([
    {
        id: 'text',
        format: ({ value }) => {
            if (value === null || value === undefined) return '';

            return String(value);
        },
    },
    {
        id: 'number',
        format: ({ value }) => {
            if (typeof value !== 'number') return value;

            return new Intl.NumberFormat().format(value);
        },
    },
    {
        id: 'boolean',
        format: ({ value }) => {
            if (typeof value !== 'boolean') return value;

            return value ? 'Yes' : 'No';
        },
    },
    {
        id: 'date',
        format: ({ value }) => {
            if (!value) return '';

            const date = value instanceof Date ? value : new Date(String(value));

            if (Number.isNaN(date.getTime())) return String(value);

            return date.toLocaleDateString();
        },
    },
    {
        id: 'datetime',
        format: ({ value }) => {
            if (!value) return '';

            const date = value instanceof Date ? value : new Date(String(value));

            if (Number.isNaN(date.getTime())) return String(value);

            return date.toLocaleString();
        },
    },
]);
