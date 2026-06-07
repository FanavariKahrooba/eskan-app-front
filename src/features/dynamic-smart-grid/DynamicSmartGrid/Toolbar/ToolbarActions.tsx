import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

export function ToolbarActions() {
  const grid = useDynamicSmartGridContext();

  const {
    props,
    exportCsv,
    exportJson,
    resetLayout,
    toggleFullscreen,
    isFullscreen,
  } = grid;

  return (
    <div className="dsg-toolbar-actions">
      {props.enableExport && (
        <>
          <button
            type="button"
            className="dsg-btn"
            onClick={exportCsv}
            title="خروجی CSV"
          >
            CSV
          </button>

          <button
            type="button"
            className="dsg-btn"
            onClick={exportJson}
            title="خروجی JSON"
          >
            JSON
          </button>
        </>
      )}

      <button
        type="button"
        className="dsg-btn"
        onClick={resetLayout}
        title="بازنشانی چیدمان"
      >
        Reset
      </button>

      {props.enableFullscreen && (
        <button
          type="button"
          className="dsg-btn"
          onClick={toggleFullscreen}
          title="تمام صفحه"
        >
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>
      )}
    </div>
  );
}
