import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

type GridExpandedRowProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  row: TData;
  rowId: string;
  colSpan: number;
};

export function GridExpandedRow<
  TData extends Record<string, unknown> = Record<string, unknown>,
>({ row, rowId, colSpan }: GridExpandedRowProps<TData>) {
  const grid = useDynamicSmartGridContext<TData>();

  const { props }: any = grid;

  return (
    <tr className="dsg-expanded-row" data-expanded-row-id={rowId}>
      <td className="dsg-expanded-cell" colSpan={colSpan}>
        {props.renderExpandedRow ? (
          props.renderExpandedRow(row)
        ) : (
          <pre className="dsg-expanded-json">
            {JSON.stringify(row, null, 2)}
          </pre>
        )}
      </td>
    </tr>
  );
}
