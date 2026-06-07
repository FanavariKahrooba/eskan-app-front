import { TableStorePersistenceOptions, TableStoreState } from '../../store';
import { DataGridSchema } from './column-def';
import { DataGridEventMap, DataGridServerAdapter } from './data-grid-events';
import { DataGridPlugin } from './data-grid-plugin';

export interface TableVirtualizationConfig {
    enabled?: boolean;
    rowHeight?: number;
    overscan?: number;
    containerHeight?: number;
    totalRows?: number;
    scrollTop?: number;
}

export interface UseTableVirtualizationResult {
    enabled: boolean;
    rowHeight: number;
    overscan: number;
    containerHeight: number;
    totalRows: number;
    totalHeight: number;
    scrollTop: number;
    visibleRange: {
        startIndex: number;
        endIndex: number;
    };
    offsetTop: number;
    getOffsetForIndex: (index: number) => number;
    instance: any;
}

export interface DataGridTableInstance {
    tableId: string;
    schema: DataGridSchema;
    store: ReturnType<typeof import('../../store').createTableStore>;
    plugins: DataGridPlugin[];
    pluginMap: Record<string, DataGridPlugin>;
    api?: Record<string, unknown>;
    events?: Partial<DataGridEventMap>;
    virtualization?: TableVirtualizationConfig & Record<string, unknown>;
    server?: {
        adapter?: DataGridServerAdapter;
        [key: string]: unknown;
    };
    meta?: Record<string, unknown>;
}

export type { TableStoreState, TableStorePersistenceOptions };
