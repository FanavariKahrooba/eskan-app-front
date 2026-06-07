import type { ColumnPinningState } from "../../core/types";

export type PinSide = 'left' | 'right' | false;

export interface ColumnPinningPluginOptions {
  enabled?: boolean;
  onColumnPinningChange?: (state: ColumnPinningState) => void;
}

export interface ColumnPinningPlugin {
  key: 'column-pinning';
  enabled: boolean;
  pinColumn: (
    state: ColumnPinningState,
    columnId: string,
    side: PinSide,
  ) => ColumnPinningState;
}

function removeColumn(list: string[], columnId: string): string[] {
  return list.filter((id) => id !== columnId);
}

export function createColumnPinningPlugin(
  options: ColumnPinningPluginOptions = {},
): ColumnPinningPlugin {
  const { enabled = true, onColumnPinningChange } = options;

  return {
    key: 'column-pinning',
    enabled,

    pinColumn(state, columnId, side) {
      const left = removeColumn(state?.left ?? [], columnId);
      const right = removeColumn(state?.right ?? [], columnId);

      let nextLeft = left;
      let nextRight = right;

      if (side === 'left') {
        nextLeft = [...left, columnId];
      } else if (side === 'right') {
        nextRight = [...right, columnId];
      }

      const result: ColumnPinningState = {
        left: nextLeft,
        right: nextRight,
      };

      onColumnPinningChange?.(result);
      return result;
    },
  };
}
