import React from "react";
import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";
import { GridRow } from "./GridRow";
import { GridExpandedRow } from "./GridExpandedRow";

export function GridBody() {
  const grid = useDynamicSmartGridContext();

  const { paginatedRows, getRowId, isRowExpanded, props, visibleColumns } =
    grid;

  return (
    <tbody className="dsg-tbody">
      {paginatedRows.map((row, rowIndex) => {
        const rowId: any = getRowId(row, rowIndex);
        const expanded = isRowExpanded(rowId);

        return (
          <React.Fragment key={rowId}>
            <GridRow row={row} rowIndex={rowIndex} rowId={rowId} />

            {props.enableExpansion && expanded && (
              <GridExpandedRow
                row={row}
                rowId={rowId}
                colSpan={
                  visibleColumns.length +
                  (props.enableSelection ? 1 : 0) +
                  (props.enableExpansion ? 1 : 0)
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
}
