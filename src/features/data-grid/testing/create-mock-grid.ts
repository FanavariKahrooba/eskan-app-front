import { DataGridConfig } from '@/components/dynamic-table/features';
import { createDefaultTableState } from '../lib';
import { mockColumns } from './fixtures/mock-columns';
import { mockRows, type MockUserRow } from './fixtures/mock-rows';

export interface CreateMockGridOptions {
    rowCount?: number;
    initialState?: Partial<any>;
}

function createRows(count: number): MockUserRow[] {
    if (count <= mockRows.length) {
        return mockRows.slice(0, count);
    }

    return Array.from({ length: count }, (_, index) => {
        const base = mockRows[index % mockRows.length];

        return {
            ...base,
            id: String(index + 1),
            name: `${base.name} ${index + 1}`,
            email: `user${index + 1}@example.com`,
            age: base.age + (index % 10),
            balance: base.balance + index * 10000,
            progress: index % 100,
            createdAt: new Date(
                Date.UTC(2026, index % 12, (index % 28) + 1, 10, 0, 0),
            ).toISOString(),
        };
    });
}

export function createMockGrid(
    options: CreateMockGridOptions = {},
): DataGridConfig<MockUserRow> {
    const { rowCount = mockRows.length, initialState } = options;

    return {
        id: 'mock-users-grid',
        columns: mockColumns,
        data: createRows(rowCount),
        getRowId: (row: MockUserRow) => row.id,
        initialState: createDefaultTableState({
            initialState,
        }),
        features: {
            search: true,
            filtering: true,
            sorting: true,
            pagination: true,
            columnVisibility: true,
            columnOrdering: true,
            columnPinning: true,
            columnSizing: true,
            columnDnd: true,
            rowSelection: true,
            rowExpansion: true,
            rowEditing: true,
            rowDnd: false,
            grouping: false,
            aggregation: false,
            export: true,
            virtualization: false,
            persistence: false,
            toolbar: true,
        },
    } as any;
}
