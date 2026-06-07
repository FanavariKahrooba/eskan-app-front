import type { ColumnDef } from '../types';

export interface FilterRendererContext<
    TRow = unknown,
    TValue = unknown,
    TOutput = unknown,
> {
    column: ColumnDef<TRow, TValue>;
    columnId: string;

    operator?: string;
    value: unknown;

    onOperatorChange?: (operator: string) => void;
    onValueChange?: (value: unknown) => void;
    onClear?: () => void;
}

export type FilterRenderer<
    TRow = unknown,
    TValue = unknown,
    TOutput = unknown,
> = (context: FilterRendererContext<TRow, TValue, TOutput>) => TOutput;

export interface FilterRendererDefinition<
    TRow = unknown,
    TValue = unknown,
    TOutput = unknown,
> {
    id: string;
    render: FilterRenderer<TRow, TValue, TOutput>;
}

export class FilterRendererRegistry {
    private readonly renderers = new Map<string, FilterRendererDefinition>();

    register<TRow = unknown, TValue = unknown, TOutput = unknown>(
        definition: FilterRendererDefinition<TRow, TValue, TOutput>,
    ): this {
        if (!definition.id.trim()) {
            throw new Error('Filter renderer id is required.');
        }

        this.renderers.set(definition.id, definition as FilterRendererDefinition);

        return this;
    }

    registerMany(definitions: FilterRendererDefinition[]): this {
        for (const definition of definitions) {
            this.register(definition);
        }

        return this;
    }

    get<
        TRow = unknown,
        TValue = unknown,
        TOutput = unknown,
    >(
        id: string | undefined | null,
    ): FilterRendererDefinition<TRow, TValue, TOutput> | undefined {
        if (!id) return undefined;

        return this.renderers.get(id) as
            | FilterRendererDefinition<TRow, TValue, TOutput>
            | undefined;
    }

    getRenderer<
        TRow = unknown,
        TValue = unknown,
        TOutput = unknown,
    >(
        id: string | undefined | null,
    ): FilterRenderer<TRow, TValue, TOutput> | undefined {
        return this.get<TRow, TValue, TOutput>(id)?.render;
    }

    has(id: string): boolean {
        return this.renderers.has(id);
    }

    unregister(id: string): boolean {
        return this.renderers.delete(id);
    }

    clear(): void {
        this.renderers.clear();
    }

    entries(): FilterRendererDefinition[] {
        return Array.from(this.renderers.values());
    }

    ids(): string[] {
        return Array.from(this.renderers.keys());
    }
}

export const filterRendererRegistry = new FilterRendererRegistry();
