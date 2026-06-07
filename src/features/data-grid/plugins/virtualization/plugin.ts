export interface VirtualizationState {
    scrollTop: number;
    scrollLeft: number;
    viewportHeight: number;
    viewportWidth: number;
    rowHeight: number;
    overscan: number;
}

export interface VirtualRange {
    startIndex: number;
    endIndex: number;
    offsetTop: number;
    totalSize: number;
}

export interface VirtualizationPluginOptions {
    enabled?: boolean;
    rowHeight?: number;
    overscan?: number;
    onVirtualizationStateChange?: (state: VirtualizationState) => void;
}

export interface UpdateViewportOptions {
    scrollTop?: number;
    scrollLeft?: number;
    viewportHeight?: number;
    viewportWidth?: number;
}

export interface VirtualizationPlugin {
    key: 'virtualization';
    enabled: boolean;

    getInitialState: () => VirtualizationState;

    updateViewport: (
        state: VirtualizationState,
        options: UpdateViewportOptions,
    ) => VirtualizationState;

    getVirtualRange: (
        state: VirtualizationState,
        rowCount: number,
    ) => VirtualRange;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function createVirtualizationPlugin(
    options: VirtualizationPluginOptions = {},
): VirtualizationPlugin {
    const {
        enabled = true,
        rowHeight = 40,
        overscan = 5,
        onVirtualizationStateChange,
    } = options;

    function getInitialState(): VirtualizationState {
        return {
            scrollTop: 0,
            scrollLeft: 0,
            viewportHeight: 0,
            viewportWidth: 0,
            rowHeight,
            overscan,
        };
    }

    return {
        key: 'virtualization',
        enabled,

        getInitialState,

        updateViewport(state, viewportOptions) {
            if (!enabled) return state;

            const result: VirtualizationState = {
                ...state,
                scrollTop: viewportOptions.scrollTop ?? state.scrollTop,
                scrollLeft: viewportOptions.scrollLeft ?? state.scrollLeft,
                viewportHeight:
                    viewportOptions.viewportHeight ?? state.viewportHeight,
                viewportWidth:
                    viewportOptions.viewportWidth ?? state.viewportWidth,
                rowHeight: state.rowHeight || rowHeight,
                overscan: state.overscan ?? overscan,
            };

            onVirtualizationStateChange?.(result);
            return result;
        },

        getVirtualRange(state, rowCount) {
            if (!enabled) {
                return {
                    startIndex: 0,
                    endIndex: Math.max(0, rowCount - 1),
                    offsetTop: 0,
                    totalSize: rowCount * state.rowHeight,
                };
            }

            const safeRowHeight = Math.max(1, state.rowHeight || rowHeight);
            const safeOverscan = Math.max(0, state.overscan ?? overscan);

            const visibleStartIndex = Math.floor(state.scrollTop / safeRowHeight);
            const visibleCount = Math.ceil(state.viewportHeight / safeRowHeight);

            const startIndex = clamp(
                visibleStartIndex - safeOverscan,
                0,
                Math.max(0, rowCount - 1),
            );

            const endIndex = clamp(
                visibleStartIndex + visibleCount + safeOverscan,
                0,
                Math.max(0, rowCount - 1),
            );

            return {
                startIndex,
                endIndex,
                offsetTop: startIndex * safeRowHeight,
                totalSize: rowCount * safeRowHeight,
            };
        },
    };
}
