export type RowEditingMode = 'view' | 'edit';

export interface EditingCellState {
    rowId: string;
    columnId: string;
}

export interface RowDraftState {
    rowId: string;
    values: Record<string, unknown>;
    dirtyFields?: string[];
    errors?: Record<string, string | undefined>;
}

export interface RowEditingState {
    mode: RowEditingMode;
    editingRowIds: string[];
    editingCell?: EditingCellState;
    drafts: Record<string, RowDraftState>;
}

export interface RowEditingChangeParams {
    next: RowEditingState;
    previous: RowEditingState;
    rowId?: string;
    columnId?: string;
}
