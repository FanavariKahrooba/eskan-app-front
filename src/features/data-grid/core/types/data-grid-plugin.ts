import type { DataGridAction } from './actions';
import type { DataGridApi } from './data-grid-api';
import type { DataGridState } from './data-grid-state';

export interface DataGridPluginContext<TRow = unknown> {
    api: DataGridApi<TRow>;
    getState: () => DataGridState;
    setState: (state: Partial<DataGridState>) => void;
    dispatch: (action: DataGridAction) => void;
    rows: TRow[];
    meta?: Record<string, unknown>;
}

export interface DataGridPlugin<TRow = unknown> {
    id: string;
    name?: string;
    order?: number;
    enabled?: boolean;

    setup?: (context: DataGridPluginContext<TRow>) => void | (() => void);

    onInit?: (context: DataGridPluginContext<TRow>) => void;
    onDestroy?: (context: DataGridPluginContext<TRow>) => void;

    beforeStateChange?: (
        nextState: DataGridState,
        previousState: DataGridState,
        context: DataGridPluginContext<TRow>,
    ) => DataGridState | void;

    afterStateChange?: (
        nextState: DataGridState,
        previousState: DataGridState,
        context: DataGridPluginContext<TRow>,
    ) => void;

    onAction?: (
        action: DataGridAction,
        context: DataGridPluginContext<TRow>,
    ) => void | DataGridAction | null;
}

export type DataGridPluginFactory<TRow = unknown, TOptions = unknown> = (
    options?: TOptions,
) => DataGridPlugin<TRow>;


export interface DataGridPluginSetupResult {
    api?: Record<string, unknown>;
    meta?: Record<string, unknown>;
    cleanup?: () => void;
}
