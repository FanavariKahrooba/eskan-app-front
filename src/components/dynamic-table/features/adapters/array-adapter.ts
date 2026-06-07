// src/features/data-grid/adapters/array-adapter.ts

import type {
    DataAdapter,
    DataResponse,
    LoadParams,
} from '../core/types'

export class ArrayAdapter<TData = unknown> implements DataAdapter<TData> {
    type = 'array' as const

    constructor(private data: TData[]) { }

    async load(params: LoadParams): Promise<DataResponse<TData>> {
        const page = params.page ?? 1
        const pageSize = params.pageSize ?? this.data.length

        return {
            rows: this.data,
            total: this.data.length,
            page,
            pageSize,
        }
    }

    async reload(): Promise<DataResponse<TData>> {
        return {
            rows: this.data,
            total: this.data.length,
        }
    }
}
