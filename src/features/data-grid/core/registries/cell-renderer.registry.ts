import { ColumnDef } from "../types";


export interface CellRendererContext<
    TRow = unknown,
    TValue = unknown,
    TOutput = unknown,
> {
    row: TRow;
    rowIndex: number;
    rowId: string;

    column: ColumnDef<TRow, TValue>;
    columnId: string;
    columnIndex: number;

    value: TValue;
    formattedValue?: unknown;

    selected?: boolean;
    disabled?: boolean;
}

export type CellRenderer<
    TRow = unknown,
    TValue = unknown,
    TOutput = unknown,
> = (context: CellRendererContext<TRow, TValue, TOutput>) => TOutput;

export interface CellRendererDefinition<
    TRow = unknown,
    TValue = unknown,
    TOutput = unknown,
> {
    id: string;
    render: CellRenderer<TRow, TValue, TOutput>;
}

export class CellRendererRegistry {
    private readonly renderers = new Map<string, CellRendererDefinition>();

    register<TRow = unknown, TValue = unknown, TOutput = unknown>(
        definition: CellRendererDefinition<TRow, TValue, TOutput>,
    ): this {
        if (!definition.id.trim()) {
            throw new Error('Cell renderer id is required.');
        }

        this.renderers.set(definition.id, definition as CellRendererDefinition);

        return this;
    }

    registerMany(definitions: CellRendererDefinition[]): this {
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
    ): CellRendererDefinition<TRow, TValue, TOutput> | undefined {
        if (!id) return undefined;

        return this.renderers.get(id) as
            | CellRendererDefinition<TRow, TValue, TOutput>
            | undefined;
    }

    getRenderer<
        TRow = unknown,
        TValue = unknown,
        TOutput = unknown,
    >(
        id: string | undefined | null,
    ): CellRenderer<TRow, TValue, TOutput> | undefined {
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

    entries(): CellRendererDefinition[] {
        return Array.from(this.renderers.values());
    }

    ids(): string[] {
        return Array.from(this.renderers.keys());
    }
}

export const cellRendererRegistry = new CellRendererRegistry();
