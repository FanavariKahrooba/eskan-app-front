import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";
import { GridHeader } from "./GridHeader";
import { GridBody } from "./GridBody";
import { GridEmptyState } from "./GridEmptyState";
import { GridLoadingState } from "./GridLoadingState";

export function DynamicSmartGridTable() {
  const grid = useDynamicSmartGridContext();

  const {
    props,
    paginatedRows,
    visibleColumns,
    density,
    isFullscreen,
    tableContainerRef,
  } = grid;

  const gridClassName = [
    "dsg-table-shell",
    `dsg-density-${density}`,
    props.variant === "sheet" ? "dsg-variant-sheet" : "dsg-variant-grid",
    isFullscreen ? "dsg-fullscreen-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (props.loading) {
    return <GridLoadingState />;
  }

  return (
    <div ref={tableContainerRef} className={gridClassName}>
      <div className="dsg-table-scroll">
        <table className="dsg-table">
          <GridHeader />

          {paginatedRows.length > 0 && <GridBody />}
        </table>

        {paginatedRows.length === 0 && (
          <GridEmptyState colSpan={visibleColumns.length} />
        )}
      </div>
    </div>
  );
}
