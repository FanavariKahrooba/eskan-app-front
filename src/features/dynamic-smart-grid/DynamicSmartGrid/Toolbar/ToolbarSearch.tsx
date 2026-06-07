import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

export function ToolbarSearch() {
  const grid = useDynamicSmartGridContext();

  return (
    <div className="dsg-search">
      <input
        value={grid.globalFilter}
        onChange={(event) => {
          grid.setGlobalFilter(event.target.value);
          grid.setPagination((prev) => ({
            ...prev,
            pageIndex: 0,
          }));
        }}
        placeholder="جستجو در همه ستون‌ها..."
        className="dsg-input dsg-search-input"
      />

      {grid.globalFilter && (
        <button
          type="button"
          className="dsg-icon-btn"
          onClick={() => grid.setGlobalFilter("")}
          aria-label="پاک کردن جستجو"
        >
          ×
        </button>
      )}
    </div>
  );
}
