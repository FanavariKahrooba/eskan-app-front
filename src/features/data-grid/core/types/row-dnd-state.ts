export interface RowDndState {
    activeRowId?: string;
    overRowId?: string;
    direction?: 'before' | 'after';
}

export interface RowDndChangeParams {
    next: RowDndState;
    previous: RowDndState;
}
