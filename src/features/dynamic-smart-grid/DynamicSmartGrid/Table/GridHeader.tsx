import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";
import { GridHeaderCell } from "./GridHeaderCell";

export function GridHeader() {
  const grid = useDynamicSmartGridContext();

  const {
    props,
    visibleColumns,
    isAllPageRowsSelected,
    isSomePageRowsSelected,
    toggleSelectAllPageRows,
  } = grid;

  return (
    <thead className="dsg-thead">
      <tr className="dsg-header-row">
        {props.enableSelection && (
          <th className="dsg-th dsg-selection-cell dsg-sticky-start">
            <input
              type="checkbox"
              checked={isAllPageRowsSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate =
                    !isAllPageRowsSelected && isSomePageRowsSelected;
                }
              }}
              onChange={toggleSelectAllPageRows}
              aria-label="انتخاب همه ردیف‌های صفحه"
            />
          </th>
        )}

        {props.enableExpansion && (
          <th className="dsg-th dsg-expand-cell dsg-sticky-start">
            <span />
          </th>
        )}

        {visibleColumns.map((column) => (
          <GridHeaderCell key={column.id} column={column} />
        ))}
      </tr>
    </thead>
  );
}
