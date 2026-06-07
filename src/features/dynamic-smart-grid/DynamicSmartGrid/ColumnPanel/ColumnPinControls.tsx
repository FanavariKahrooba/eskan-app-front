import type { DynamicGridPinDirection } from "../DynamicSmartGrid.types";
import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

export function ColumnPinControls() {
  const grid = useDynamicSmartGridContext();

  const { columns, columnPinning, setColumnPinning, props } = grid;

  if (!props.enableColumnPinning) {
    return null;
  }

  const pinColumn = (columnId: string, direction: DynamicGridPinDirection) => {
    setColumnPinning((prev) => ({
      ...prev,
      [columnId]: direction,
    }));
  };

  return (
    <div className="dsg-column-section">
      <div className="dsg-column-section-title">
        <span>پین ستون‌ها</span>
      </div>

      <div className="dsg-pin-list">
        {columns.map((column) => {
          const pinned = columnPinning[column.id] ?? false;

          return (
            <div key={column.id} className="dsg-pin-list-item">
              <div className="dsg-pin-column-name">{column.header}</div>

              <div className="dsg-pin-actions">
                <button
                  type="button"
                  className={
                    pinned === "left"
                      ? "dsg-mini-btn dsg-mini-btn-active"
                      : "dsg-mini-btn"
                  }
                  onClick={() => pinColumn(column.id, "left")}
                >
                  چپ
                </button>

                <button
                  type="button"
                  className={
                    pinned === false
                      ? "dsg-mini-btn dsg-mini-btn-active"
                      : "dsg-mini-btn"
                  }
                  onClick={() => pinColumn(column.id, false)}
                >
                  آزاد
                </button>

                <button
                  type="button"
                  className={
                    pinned === "right"
                      ? "dsg-mini-btn dsg-mini-btn-active"
                      : "dsg-mini-btn"
                  }
                  onClick={() => pinColumn(column.id, "right")}
                >
                  راست
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
