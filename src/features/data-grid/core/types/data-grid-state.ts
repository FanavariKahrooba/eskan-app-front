import type { SortState } from './sort-state';
import type { FilterState } from './filter-state';
import type { PaginationState } from './pagination-state';
import type { ColumnOrderState } from './column-order-state';
import type { ColumnVisibilityState } from './column-visibility-state';
import type { ColumnPinningState } from './column-pinning-state';
import type { ColumnSizingInfo, ColumnSizingState } from './column-sizing-state';
import type { RowSelectionState } from './row-selection-state';
import type { RowEditingState } from './row-editing-state';
import type { RowDndState } from './row-dnd-state';
import type { RowDetailsState } from './row-details';
import type { GroupingState } from './grouping-state';
import type { AggregationState } from './aggregation-state';


import { DEFAULT_SORT_STATE } from './sort-state';
import { DEFAULT_FILTER_STATE } from './filter-state';
import { DEFAULT_PAGINATION_STATE } from './pagination-state';
import { DEFAULT_COLUMN_ORDER_STATE } from './column-order-state';
import { DEFAULT_COLUMN_VISIBILITY_STATE } from './column-visibility-state';
import { DEFAULT_COLUMN_PINNING_STATE } from './column-pinning-state';
import { DEFAULT_ROW_SELECTION_STATE } from './row-selection-state';
import { DEFAULT_ROW_DETAILS_STATE } from './row-details';
import { DEFAULT_GROUPING_STATE } from './grouping-state';
import { DEFAULT_AGGREGATION_STATE } from './aggregation-state';
import { DataGridDensity } from './data-grid-mode';

export interface DataGridState {
    loading: boolean;
    error?: unknown;

    density: DataGridDensity;

    sorting: SortState;
    filters: FilterState;
    search: any;

    pagination: PaginationState;

    columnOrder: ColumnOrderState;
    columnVisibility: ColumnVisibilityState;
    columnPinning: ColumnPinningState;
    columnSizing: ColumnSizingState;
    columnSizingInfo?: ColumnSizingInfo;

    rowSelection: RowSelectionState;
    rowEditing: RowEditingState;
    rowDnd: RowDndState;

    grouping: GroupingState;
    aggregation: AggregationState;

    expandedRows: Record<string, boolean>;

    meta?: Record<string, unknown>;
}

export type DataGridStateKey = keyof DataGridState;

export type DataGridStateSlice<TKey extends DataGridStateKey> = DataGridState[TKey];

export type DataGridPartialState = Partial<DataGridState>;

export interface DataGridInitialState extends DataGridPartialState { }

export interface DataGridState {
    sort: SortState;
    filter: FilterState;
    pagination: PaginationState;

    columnOrder: ColumnOrderState;
    columnVisibility: ColumnVisibilityState;
    columnPinning: ColumnPinningState;
    columnSizing: ColumnSizingState;

    rowSelection: RowSelectionState;
    rowEditing: RowEditingState;
    rowDnd: RowDndState;
    rowDetails: RowDetailsState;

    grouping: GroupingState;
    aggregation: AggregationState;
}


export const DEFAULT_DATA_GRID_STATE: DataGridState = {
    sort: DEFAULT_SORT_STATE,
    filter: DEFAULT_FILTER_STATE,
    pagination: DEFAULT_PAGINATION_STATE,

    columnOrder: DEFAULT_COLUMN_ORDER_STATE,
    columnVisibility: DEFAULT_COLUMN_VISIBILITY_STATE,
    columnPinning: DEFAULT_COLUMN_PINNING_STATE,
    columnSizing: {
        sizes: {}
    },

    rowSelection: DEFAULT_ROW_SELECTION_STATE,
    rowEditing: {
        editingRowIds: {
            length: 0,
            pop: function (): string | undefined {
                throw new Error('Function not implemented.');
            },
            push: function (...items: string[]): number {
                throw new Error('Function not implemented.');
            },
            concat: function (...items: ConcatArray<string>[]): string[] {
                throw new Error('Function not implemented.');
            },
            join: function (separator?: string): string {
                throw new Error('Function not implemented.');
            },
            reverse: function (): string[] {
                throw new Error('Function not implemented.');
            },
            shift: function (): string | undefined {
                throw new Error('Function not implemented.');
            },
            slice: function (start?: number, end?: number): string[] {
                throw new Error('Function not implemented.');
            },
            sort: function (compareFn?: ((a: string, b: string) => number) | undefined): string[] {
                throw new Error('Function not implemented.');
            },
            splice: function (start: number, deleteCount?: number): string[] {
                throw new Error('Function not implemented.');
            },
            unshift: function (...items: string[]): number {
                throw new Error('Function not implemented.');
            },
            indexOf: function (searchElement: string, fromIndex?: number): number {
                throw new Error('Function not implemented.');
            },
            lastIndexOf: function (searchElement: string, fromIndex?: number): number {
                throw new Error('Function not implemented.');
            },
            every: function <S extends string>(predicate: (value: string, index: number, array: string[]) => value is S, thisArg?: any): this is S[] {
                throw new Error('Function not implemented.');
            },
            some: function (predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): boolean {
                throw new Error('Function not implemented.');
            },
            forEach: function (callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any): void {
                throw new Error('Function not implemented.');
            },
            map: function <U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any): U[] {
                throw new Error('Function not implemented.');
            },
            filter: function <S extends string>(predicate: (value: string, index: number, array: string[]) => value is S, thisArg?: any): S[] {
                throw new Error('Function not implemented.');
            },
            reduce: function (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string {
                throw new Error('Function not implemented.');
            },
            reduceRight: function (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string {
                throw new Error('Function not implemented.');
            },
            find: function <S extends string>(predicate: (value: string, index: number, obj: string[]) => value is S, thisArg?: any): S | undefined {
                throw new Error('Function not implemented.');
            },
            findIndex: function (predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): number {
                throw new Error('Function not implemented.');
            },
            fill: function (value: string, start?: number, end?: number): string[] {
                throw new Error('Function not implemented.');
            },
            copyWithin: function (target: number, start: number, end?: number): string[] {
                throw new Error('Function not implemented.');
            },
            entries: function (): ArrayIterator<[number, string]> {
                throw new Error('Function not implemented.');
            },
            keys: function (): ArrayIterator<number> {
                throw new Error('Function not implemented.');
            },
            values: function (): ArrayIterator<string> {
                throw new Error('Function not implemented.');
            },
            includes: function (searchElement: string, fromIndex?: number): boolean {
                throw new Error('Function not implemented.');
            },
            flatMap: function <U, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => U | readonly U[], thisArg?: This | undefined): U[] {
                throw new Error('Function not implemented.');
            },
            flat: function <A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[] {
                throw new Error('Function not implemented.');
            },
            at: function (index: number): string | undefined {
                throw new Error('Function not implemented.');
            },
            findLast: function <S extends string>(predicate: (value: string, index: number, array: string[]) => value is S, thisArg?: any): S | undefined {
                throw new Error('Function not implemented.');
            },
            findLastIndex: function (predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): number {
                throw new Error('Function not implemented.');
            },
            toReversed: function (): string[] {
                throw new Error('Function not implemented.');
            },
            toSorted: function (compareFn?: ((a: string, b: string) => number) | undefined): string[] {
                throw new Error('Function not implemented.');
            },
            toSpliced: function (start: number, deleteCount: number, ...items: string[]): string[] {
                throw new Error('Function not implemented.');
            },
            with: function (index: number, value: string): string[] {
                throw new Error('Function not implemented.');
            },
            [Symbol.iterator]: function (): ArrayIterator<string> {
                throw new Error('Function not implemented.');
            },
            [Symbol.unscopables]: undefined
        },
        dirtyRowIds: {},
    },
    rowDnd: {

    },
    rowDetails: DEFAULT_ROW_DETAILS_STATE,

    grouping: DEFAULT_GROUPING_STATE,
    aggregation: DEFAULT_AGGREGATION_STATE,
};
