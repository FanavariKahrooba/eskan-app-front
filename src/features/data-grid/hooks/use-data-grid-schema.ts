"use client"
import { useMemo } from 'react';

import type {
    DataGridColumnDef,
    DataGridResolvedSchema,
    DataGridSchema,
} from '../core/types';

function normalizeColumns(
    schema: DataGridSchema,
): DataGridColumnDef[] {
    return schema.columns.map((column, index) => ({
        ...column,
        id: column.id ?? column.field ?? `col_${index}`,
        field: column.field ?? column.id ?? `col_${index}`,
    }));
}

export function useDataGridSchema(
    schema: DataGridSchema,
): DataGridResolvedSchema {
    return useMemo<DataGridResolvedSchema>(() => {
        const columns = normalizeColumns(schema);

        const columnMap = columns.reduce<Record<string, DataGridColumnDef>>(
            (acc, column) => {
                acc[column.id] = column;
                return acc;
            },
            {},
        );

        const leafColumns = columns.filter((column) => !column.columns?.length);

        return {
            ...schema,
            columns,
            columnMap,
            leafColumns,
            rowIdKey: schema.rowIdKey ?? 'id',
        };
    }, [schema]);
}
