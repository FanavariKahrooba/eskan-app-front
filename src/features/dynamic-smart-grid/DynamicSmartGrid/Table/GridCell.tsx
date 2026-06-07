import { useMemo, useState } from "react";
import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";
import { DynamicSmartGridInlineEditor } from "../InlineEdit";
import { DynamicGridColumn } from "..";

type GridCellProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  row: TData;
  rowIndex: number;
  rowId: string;
  column: DynamicGridColumn<TData>;
};

export function GridCell<
  TData extends Record<string, unknown> = Record<string, unknown>,
>({ row, rowIndex, rowId, column }: GridCellProps<TData>) {
  const grid = useDynamicSmartGridContext<TData>();

  const { props, columnWidths, columnPinning, getPinnedStyle, getCellValue } =
    grid;

  const [editing, setEditing] = useState(false);

  const value = useMemo(() => {
    return getCellValue(row, column);
  }, [row, column, getCellValue]);

  const width = columnWidths[column.id] ?? column.width ?? 160;
  const pinned = columnPinning[column.id] ?? column.pinned ?? false;

  const canEdit =
    props.enableInlineEdit &&
    column.enableEditing !== false &&
    Boolean(props.onCellEdit);

  const tdStyle = {
    width,
    minWidth: column.minWidth ?? 80,
    maxWidth: column.maxWidth,
    ...getPinnedStyle(column.id),
  } as React.CSSProperties;

  if (editing && canEdit) {
    return (
      <td
        className={[
          "dsg-td",
          "dsg-cell-editing",
          pinned ? `dsg-pinned dsg-pinned-${pinned}` : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={tdStyle}
        data-column-id={column.id}
      >
        <DynamicSmartGridInlineEditor
          row={row}
          rowId={rowId}
          rowIndex={rowIndex}
          column={column}
          value={value}
          onCancel={() => setEditing(false)}
          onCommit={() => setEditing(false)}
        />
      </td>
    );
  }

  return (
    <td
      className={[
        "dsg-td",
        column.align ? `dsg-align-${column.align}` : "",
        pinned ? `dsg-pinned dsg-pinned-${pinned}` : "",
        canEdit ? "dsg-cell-editable" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={tdStyle}
      data-column-id={column.id}
      onDoubleClick={(event) => {
        if (!canEdit) return;

        event.stopPropagation();
        setEditing(true);
      }}
    >
      <div className="dsg-cell-content">
        {column.cell
          ? column.cell({
              row,
              rowIndex,
              value,
              column,
            })
          : String(value ?? "")}
      </div>
    </td>
  );
}
