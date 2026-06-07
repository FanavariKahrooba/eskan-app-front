import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

export function ColumnVisibilityList() {
  const grid = useDynamicSmartGridContext();

  const { columns, columnVisibility, setColumnVisibility } = grid;

  const visibleCount = columns.filter(
    (column) => columnVisibility[column.id] !== false,
  ).length;

  const toggleColumn = (columnId: string) => {
    setColumnVisibility((prev) => {
      const currentlyVisible = prev[columnId] !== false;

      if (currentlyVisible && visibleCount <= 1) {
        return prev;
      }

      return {
        ...prev,
        [columnId]: !currentlyVisible,
      };
    });
  };

  const showAll = () => {
    setColumnVisibility((prev) => {
      const next = { ...prev };

      columns.forEach((column) => {
        next[column.id] = true;
      });

      return next;
    });
  };

  const hideAllButFirst = () => {
    setColumnVisibility(() => {
      const next: Record<string, boolean> = {};

      columns.forEach((column, index) => {
        next[column.id] = index === 0;
      });

      return next;
    });
  };

  return (
    <div className="dsg-column-section">
      <div className="dsg-column-section-title">
        <span>نمایش ستون‌ها</span>

        <div className="dsg-column-section-actions">
          <button type="button" className="dsg-link-btn" onClick={showAll}>
            همه
          </button>

          <button
            type="button"
            className="dsg-link-btn"
            onClick={hideAllButFirst}
          >
            فقط اولی
          </button>
        </div>
      </div>

      <div className="dsg-column-list">
        {columns.map((column) => {
          const checked = columnVisibility[column.id] !== false;

          return (
            <label key={column.id} className="dsg-column-list-item">
              <input
                type="checkbox"
                checked={checked}
                disabled={checked && visibleCount <= 1}
                onChange={() => toggleColumn(column.id)}
              />

              <span className="dsg-column-list-label">{column.header}</span>

              {!checked && <span className="dsg-muted">مخفی</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}
