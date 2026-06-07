export type CellEditMode = 'view' | 'edit';

export interface EditingCell {
    rowId: string;
    columnId: string;
}

export interface InlineEditingState {
    activeCell: EditingCell | null;
    draftValues: Record<string, unknown>;
}

export interface InlineEditingPluginOptions<TRow = unknown> {
    enabled?: boolean;
    getCellKey?: (cell: EditingCell) => string;
    canEditCell?: (row: TRow | undefined, columnId: string) => boolean;
    onEditingStateChange?: (state: InlineEditingState) => void;
    onCommitCell?: (params: CommitCellParams<TRow>) => void | Promise<void>;
    onCancelCell?: (cell: EditingCell) => void;
}

export interface CommitCellParams<TRow = unknown> {
    rowId: string;
    columnId: string;
    value: unknown;
    row?: TRow;
}

export interface BeginEditCellOptions<TRow = unknown> {
    rowId: string;
    columnId: string;
    row?: TRow;
    initialValue?: unknown;
}

export interface InlineEditingPlugin<TRow = unknown> {
    key: 'inline-editing';
    enabled: boolean;

    getCellKey: (cell: EditingCell) => string;

    beginEditCell: (
        state: InlineEditingState,
        options: BeginEditCellOptions<TRow>,
    ) => InlineEditingState;

    setDraftValue: (
        state: InlineEditingState,
        cell: EditingCell,
        value: unknown,
    ) => InlineEditingState;

    commitCell: (
        state: InlineEditingState,
        cell: EditingCell,
        row?: TRow,
    ) => InlineEditingState;

    cancelCell: (
        state: InlineEditingState,
        cell?: EditingCell,
    ) => InlineEditingState;

    clearDrafts: (state: InlineEditingState) => InlineEditingState;
}

function defaultGetCellKey(cell: EditingCell): string {
    return `${cell.rowId}::${cell.columnId}`;
}

export function createInlineEditingPlugin<TRow = unknown>(
    options: InlineEditingPluginOptions<TRow> = {},
): InlineEditingPlugin<TRow> {
    const {
        enabled = true,
        getCellKey = defaultGetCellKey,
        canEditCell,
        onEditingStateChange,
        onCommitCell,
        onCancelCell,
    } = options;

    return {
        key: 'inline-editing',
        enabled,

        getCellKey,

        beginEditCell(state, beginOptions) {
            if (!enabled) return state;

            const { rowId, columnId, row, initialValue } = beginOptions;

            if (canEditCell && !canEditCell(row, columnId)) {
                return state;
            }

            const cell: EditingCell = {
                rowId,
                columnId,
            };

            const cellKey = getCellKey(cell);

            const result: InlineEditingState = {
                ...state,
                activeCell: cell,
                draftValues: {
                    ...(state?.draftValues ?? {}),
                    [cellKey]: initialValue,
                },
            };

            onEditingStateChange?.(result);
            return result;
        },

        setDraftValue(state, cell, value) {
            if (!enabled) return state;

            const cellKey = getCellKey(cell);

            const result: InlineEditingState = {
                ...state,
                activeCell: state?.activeCell ?? cell,
                draftValues: {
                    ...(state?.draftValues ?? {}),
                    [cellKey]: value,
                },
            };

            onEditingStateChange?.(result);
            return result;
        },

        commitCell(state, cell, row) {
            if (!enabled) return state;

            const cellKey = getCellKey(cell);
            const value = state?.draftValues?.[cellKey];

            void onCommitCell?.({
                rowId: cell.rowId,
                columnId: cell.columnId,
                value,
                row,
            });

            const nextDraftValues = {
                ...(state?.draftValues ?? {}),
            };

            delete nextDraftValues[cellKey];

            const result: InlineEditingState = {
                ...state,
                activeCell: null,
                draftValues: nextDraftValues,
            };

            onEditingStateChange?.(result);
            return result;
        },

        cancelCell(state, cell) {
            if (!enabled) return state;

            const targetCell = cell ?? state?.activeCell;

            const nextDraftValues = {
                ...(state?.draftValues ?? {}),
            };

            if (targetCell) {
                const cellKey = getCellKey(targetCell);
                delete nextDraftValues[cellKey];
                onCancelCell?.(targetCell);
            }

            const result: InlineEditingState = {
                ...state,
                activeCell: null,
                draftValues: nextDraftValues,
            };

            onEditingStateChange?.(result);
            return result;
        },

        clearDrafts(state) {
            if (!enabled) return state;

            const result: InlineEditingState = {
                ...state,
                activeCell: null,
                draftValues: {},
            };

            onEditingStateChange?.(result);
            return result;
        },
    };
}
