import type { ComponentType, ReactNode } from 'react';

export interface DataGridSlotProps {
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    [key: string]: unknown;
}

export type DataGridSlotComponent<TProps extends DataGridSlotProps = DataGridSlotProps> =
    ComponentType<TProps>;

export interface DataGridSlots {
    Root?: DataGridSlotComponent;
    Header?: DataGridSlotComponent;
    Toolbar?: DataGridSlotComponent;
    ToolbarLeft?: DataGridSlotComponent;
    ToolbarRight?: DataGridSlotComponent;

    Table?: DataGridSlotComponent;
    TableHead?: DataGridSlotComponent;
    TableBody?: DataGridSlotComponent;
    TableFoot?: DataGridSlotComponent;

    Row?: DataGridSlotComponent;
    HeaderRow?: DataGridSlotComponent;
    FooterRow?: DataGridSlotComponent;

    Cell?: DataGridSlotComponent;
    HeaderCell?: DataGridSlotComponent;
    FooterCell?: DataGridSlotComponent;

    Pagination?: DataGridSlotComponent;
    PageSizeSelect?: DataGridSlotComponent;

    ColumnMenu?: DataGridSlotComponent;
    FilterPanel?: DataGridSlotComponent;
    ColumnsPanel?: DataGridSlotComponent;

    LoadingOverlay?: DataGridSlotComponent;
    EmptyOverlay?: DataGridSlotComponent;
    ErrorOverlay?: DataGridSlotComponent;

    RowActions?: DataGridSlotComponent;
    BulkActions?: DataGridSlotComponent;

    DragHandle?: DataGridSlotComponent;
    ResizeHandle?: DataGridSlotComponent;
}

export type DataGridSlotName = keyof DataGridSlots;

export type DataGridSlotPropsMap = Partial<Record<DataGridSlotName, DataGridSlotProps>>;
