import { useDynamicSmartGrid } from "../DynamicSmartGrid.context";
import { ToolbarSearch } from "./ToolbarSearch";
import { ToolbarActions } from "./ToolbarActions";
import { ToolbarDensity } from "./ToolbarDensity";
import { toPersianDigits } from "../../utils/dynamic-grid-helpers";

export function DynamicSmartGridToolbar() {
  const grid = useDynamicSmartGrid();

  const { props, selectedIds, clearSelection, totalRows, totalFilteredRows } =
    grid;

  const safeTotalRows = Number(totalRows ?? 0);
  const safeTotalFilteredRows = Number(totalFilteredRows ?? 0);
  const selectedCount = selectedIds instanceof Set ? selectedIds.size : 0;

  return (
    <div className="dsg-toolbar">
      <div className="dsg-toolbar-main">
        <div className="dsg-toolbar-title-area">
          {props.title ? (
            <div className="dsg-toolbar-title">{props.title}</div>
          ) : null}

          {props.subtitle ? (
            <div className="dsg-toolbar-subtitle">{props.subtitle}</div>
          ) : null}

          {!props.title && !props.subtitle ? (
            <div className="dsg-toolbar-title">Dynamic Smart Grid</div>
          ) : null}
        </div>

        <div className="dsg-toolbar-meta">
          <span>{toPersianDigits(safeTotalFilteredRows)} ردیف</span>

          {safeTotalFilteredRows !== safeTotalRows ? (
            <span className="dsg-muted">
              از {toPersianDigits(safeTotalRows)}
            </span>
          ) : null}
        </div>
      </div>

      {props.enableSelection && selectedCount > 0 ? (
        <div className="dsg-selection-bar">
          <span>{toPersianDigits(selectedCount)} مورد انتخاب شده</span>

          <button
            type="button"
            className="dsg-btn dsg-btn-ghost"
            onClick={clearSelection}
          >
            لغو انتخاب
          </button>
        </div>
      ) : null}

      <div className="dsg-toolbar-controls">
        {props.enableSearch ? <ToolbarSearch /> : null}

        {props.enableDensity ? <ToolbarDensity /> : null}

        <ToolbarActions />
      </div>
    </div>
  );
}
