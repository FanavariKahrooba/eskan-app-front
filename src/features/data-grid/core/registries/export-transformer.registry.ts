import type { ColumnDef } from '../types';

export interface ExportCellTransformerContext<TRow = unknown, TValue = unknown> {
  row: TRow;
  rowIndex: number;
  rowId: string;

  column: ColumnDef<TRow, TValue>;
  columnId: string;
  columnIndex: number;

  value: TValue;
  formattedValue?: unknown;
}

export interface ExportRowTransformerContext<TRow = unknown> {
  row: TRow;
  rowIndex: number;
  rowId: string;
  values: Record<string, unknown>;
}

export interface ExportTransformerDefinition<TRow = unknown, TValue = unknown> {
  id: string;

  transformCell?: (
    context: ExportCellTransformerContext<TRow, TValue>,
  ) => unknown;

  transformRow?: (
    context: ExportRowTransformerContext<TRow>,
  ) => Record<string, unknown>;
}

export class ExportTransformerRegistry {
  private readonly transformers = new Map<string, ExportTransformerDefinition>();

  register<TRow = unknown, TValue = unknown>(
    definition: ExportTransformerDefinition<TRow, TValue>,
  ): this {
    if (!definition.id.trim()) {
      throw new Error('Export transformer id is required.');
    }

    this.transformers.set(
      definition.id,
      definition as ExportTransformerDefinition,
    );

    return this;
  }

  registerMany(definitions: ExportTransformerDefinition[]): this {
    for (const definition of definitions) {
      this.register(definition);
    }

    return this;
  }

  get<TRow = unknown, TValue = unknown>(
    id: string | undefined | null,
  ): ExportTransformerDefinition<TRow, TValue> | undefined {
    if (!id) return undefined;

    return this.transformers.get(id) as
      | ExportTransformerDefinition<TRow, TValue>
      | undefined;
  }

  transformCell<TRow = unknown, TValue = unknown>(
    id: string | undefined | null,
    context: ExportCellTransformerContext<TRow, TValue>,
  ): unknown {
    const transformer = this.get<TRow, TValue>(id);

    if (!transformer?.transformCell) {
      return context.formattedValue ?? context.value;
    }

    return transformer.transformCell(context);
  }

  transformRow<TRow = unknown>(
    id: string | undefined | null,
    context: ExportRowTransformerContext<TRow>,
  ): Record<string, unknown> {
    const transformer = this.get<TRow>(id);

    if (!transformer?.transformRow) {
      return context.values;
    }

    return transformer.transformRow(context);
  }

  has(id: string): boolean {
    return this.transformers.has(id);
  }

  unregister(id: string): boolean {
    return this.transformers.delete(id);
  }

  clear(): void {
    this.transformers.clear();
  }

  entries(): ExportTransformerDefinition[] {
    return Array.from(this.transformers.values());
  }

  ids(): string[] {
    return Array.from(this.transformers.keys());
  }
}

export const exportTransformerRegistry = new ExportTransformerRegistry();

exportTransformerRegistry.registerMany([
  {
    id: 'raw',
    transformCell: ({ value }) => value,
  },
  {
    id: 'formatted',
    transformCell: ({ formattedValue, value }) => formattedValue ?? value,
  },
  {
    id: 'string',
    transformCell: ({ formattedValue, value }) => {
      const output = formattedValue ?? value;

      if (output === null || output === undefined) return '';

      return String(output);
    },
  },
]);
