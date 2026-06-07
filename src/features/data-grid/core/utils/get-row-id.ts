export interface GetRowIdOptions<TRow = unknown> {
    getRowId?: (row: TRow, index: number) => string;
    fallbackPrefix?: string;
}

export const getRowId = <TRow = unknown>(
    row: TRow,
    index: number,
    options?: GetRowIdOptions<TRow>,
): string => {
    if (options?.getRowId) {
        return String(options.getRowId(row, index));
    }

    if (
        row &&
        typeof row === 'object' &&
        'id' in (row as Record<string, unknown>) &&
        (row as Record<string, unknown>).id !== null &&
        (row as Record<string, unknown>).id !== undefined
    ) {
        return String((row as Record<string, unknown>).id);
    }

    return `${options?.fallbackPrefix ?? 'row'}-${index}`;
};
