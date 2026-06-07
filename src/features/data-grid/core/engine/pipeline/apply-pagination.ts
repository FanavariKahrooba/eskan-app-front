import type { PaginationState } from '../../types';

export interface ApplyPaginationResult<TRow = unknown> {
    rows: TRow[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
}

export interface ApplyPaginationOptions<TRow = unknown> {
    rows: TRow[];
    paginationState?: PaginationState;
}

export const applyPagination = <TRow = unknown>(
    options: ApplyPaginationOptions<TRow>,
): ApplyPaginationResult<TRow> => {
    const { rows, paginationState } = options;

    const total = rows.length;
    const page = Math.max(paginationState?.page ?? 1, 1);
    const pageSize = Math.max(paginationState?.pageSize ? total : 1);
    const pageCount = Math.max(Math.ceil(total / pageSize), 1);

    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;

    return {
        rows: rows.slice(start, end),
        total,
        page: safePage,
        pageSize,
        pageCount,
    };
};
