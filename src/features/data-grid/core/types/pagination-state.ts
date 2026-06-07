export interface PaginationState {
    pageIndex?: number;
    total?: number;
    pageCount?: number;

    /**
 * 1-based page number.
 */
    page: number;

    pageSize: number;
}

export interface PaginationChangeParams {
    next: PaginationState;
    previous: PaginationState;
}


export const DEFAULT_PAGINATION_STATE: PaginationState = {
    page: 1,
    pageSize: 25,
    pageIndex: 0
};