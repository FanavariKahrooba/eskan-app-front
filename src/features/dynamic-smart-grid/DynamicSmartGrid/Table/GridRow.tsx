import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";
import { GridCell } from "./GridCell";

type GridRowProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  row: TData;
  rowIndex: number;
  rowId: string;
};

export function GridRow<
  TData extends Record<string, unknown> = Record<string, unknown>,
>({ row, rowIndex, rowId }: GridRowProps<TData>) {
  const grid = useDynamicSmartGridContext<TData>();

  const {
    props,
    visibleColumns,
    isRowSelected,
    toggleRowSelection,
    isRowExpanded,
    toggleRowExpansion,
  } = grid;

  const selected = isRowSelected(rowId);
  const expanded = isRowExpanded(rowId);

  return (
    <tr
      className={[
        "dsg-row",
        selected ? "dsg-row-selected" : "",
        expanded ? "dsg-row-expanded" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-row-id={rowId}
      onClick={() => {
        props.onRowClick?.(row, rowIndex);
      }}
      onDoubleClick={() => {
        props.onRowDoubleClick?.(row, rowIndex);
      }}
    >
      {props.enableSelection && (
        <td className="dsg-td dsg-selection-cell dsg-sticky-start">
          <input
            type="checkbox"
            checked={selected}
            onChange={(event) => {
              event.stopPropagation();
              toggleRowSelection(rowId);
            }}
            onClick={(event) => event.stopPropagation()}
            aria-label="انتخاب ردیف"
          />
        </td>
      )}

      {props.enableExpansion && (
        <td className="dsg-td dsg-expand-cell dsg-sticky-start">
          <button
            type="button"
            className="dsg-expand-btn"
            onClick={(event) => {
              event.stopPropagation();
              toggleRowExpansion(rowId);
            }}
            aria-label={expanded ? "بستن ردیف" : "باز کردن ردیف"}
          >
            {expanded ? "−" : "+"}
          </button>
        </td>
      )}

      {visibleColumns.map((column) => (
        <GridCell
          key={`${rowId}-${column.id}`}
          row={row}
          rowIndex={rowIndex}
          rowId={rowId}
          column={column}
        />
      ))}
    </tr>
  );
}
