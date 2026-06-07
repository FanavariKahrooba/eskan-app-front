// src/features/data-grid/core/types/datasource.types.ts

export type SortDirection = 'asc' | 'desc'

export type SortState = {
  field: string
  direction: SortDirection
}

export type LoadParams = {
  page?: number
  pageSize?: number
  search?: string
  sort?: SortState[]
  filters?: unknown
  signal?: AbortSignal
}

export type DataResponse<TData = unknown> = {
  rows: TData[]
  total?: number
  page?: number
  pageSize?: number
  meta?: Record<string, unknown>
}

export interface DataAdapter<TData = unknown> {
  type: 'array' | 'json' | 'rest' | 'graphql' | 'server-action' | 'websocket'

  load(params: LoadParams): Promise<DataResponse<TData>>

  reload?(): Promise<DataResponse<TData>>

  create?(data: Partial<TData>): Promise<TData>
  update?(id: string, data: Partial<TData>): Promise<TData>
  delete?(id: string): Promise<void>
  reorderRows?(rowIds: string[]): Promise<void>
}
