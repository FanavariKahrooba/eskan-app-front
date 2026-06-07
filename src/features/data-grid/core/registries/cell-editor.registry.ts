import { ColumnDef } from "../types";

export interface CellEditorContext<
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

    disabled?: boolean;
    readonly?: boolean;

    onChange?: (value: TValue) => void;
    onCommit?: (value: TValue) => void;
    onCancel?: () => void;
}

export type CellEditor<
    TRow = unknown,
    TValue = unknown,
    TOutput = unknown,
> = (context: CellEditorContext<TRow, TValue, TOutput>) => TOutput;

export interface CellEditorDefinition<
    TRow = unknown,
    TValue = unknown,
    TOutput = unknown,
> {
    id: string;
    edit: CellEditor<TRow, TValue, TOutput>;
}

export class CellEditorRegistry {
    private readonly editors = new Map<string, CellEditorDefinition>();

    register<TRow = unknown, TValue = unknown, TOutput = unknown>(
        definition: CellEditorDefinition<TRow, TValue, TOutput>,
    ): this {
        if (!definition.id.trim()) {
            throw new Error('Cell editor id is required.');
        }

        this.editors.set(definition.id, definition as CellEditorDefinition);

        return this;
    }

    registerMany(definitions: CellEditorDefinition[]): this {
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
    ): CellEditorDefinition<TRow, TValue, TOutput> | undefined {
        if (!id) return undefined;

        return this.editors.get(id) as
            | CellEditorDefinition<TRow, TValue, TOutput>
            | undefined;
    }

    getEditor<
        TRow = unknown,
        TValue = unknown,
        TOutput = unknown,
    >(
        id: string | undefined | null,
    ): CellEditor<TRow, TValue, TOutput> | undefined {
        return this.get<TRow, TValue, TOutput>(id)?.edit;
    }

    has(id: string): boolean {
        return this.editors.has(id);
    }

    unregister(id: string): boolean {
        return this.editors.delete(id);
    }

    clear(): void {
        this.editors.clear();
    }

    entries(): CellEditorDefinition[] {
        return Array.from(this.editors.values());
    }

    ids(): string[] {
        return Array.from(this.editors.keys());
    }
}

export const cellEditorRegistry = new CellEditorRegistry();
