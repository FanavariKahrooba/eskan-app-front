import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

export function GridLoadingState() {
  const grid = useDynamicSmartGridContext();

  const { visibleColumns, props } = grid;

  const fakeRows = Array.from({
    length: props.loadingRowCount ?? 8,
  });

  return (
    <div className="dsg-table-shell dsg-loading-shell">
      <div className="dsg-table-scroll">
        <table className="dsg-table">
          <thead className="dsg-thead">
            <tr className="dsg-header-row">
              {props.enableSelection && (
                <th className="dsg-th dsg-selection-cell">
                  <span className="dsg-skeleton dsg-skeleton-checkbox" />
                </th>
              )}

              {props.enableExpansion && (
                <th className="dsg-th dsg-expand-cell">
                  <span className="dsg-skeleton dsg-skeleton-checkbox" />
                </th>
              )}

              {visibleColumns.map((column) => (
                <th key={column.id} className="dsg-th">
                  <span className="dsg-skeleton dsg-skeleton-title" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="dsg-tbody">
            {fakeRows.map((_, rowIndex) => (
              <tr key={`loading-row-${rowIndex}`} className="dsg-row">
                {props.enableSelection && (
                  <td className="dsg-td dsg-selection-cell">
                    <span className="dsg-skeleton dsg-skeleton-checkbox" />
                  </td>
                )}

                {props.enableExpansion && (
                  <td className="dsg-td dsg-expand-cell">
                    <span className="dsg-skeleton dsg-skeleton-checkbox" />
                  </td>
                )}

                {visibleColumns.map((column, columnIndex) => (
                  <td
                    key={`loading-cell-${rowIndex}-${column.id}`}
                    className="dsg-td"
                  >
                    <span
                      className="dsg-skeleton dsg-skeleton-cell"
                      style={{
                        width:
                          columnIndex % 3 === 0
                            ? "80%"
                            : columnIndex % 3 === 1
                              ? "55%"
                              : "68%",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
