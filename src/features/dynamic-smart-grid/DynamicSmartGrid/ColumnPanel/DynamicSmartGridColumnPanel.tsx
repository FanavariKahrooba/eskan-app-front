import { useState } from "react";
import { ColumnVisibilityList } from "./ColumnVisibilityList";
import { ColumnPinControls } from "./ColumnPinControls";

export function DynamicSmartGridColumnPanel() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="dsg-column-panel-shell">
      <button
        type="button"
        className="dsg-column-panel-toggle"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "بستن ستون‌ها" : "مدیریت ستون‌ها"}
      </button>

      {open && (
        <div className="dsg-column-panel">
          <div className="dsg-column-panel-header">
            <strong>ستون‌ها</strong>
            <span>نمایش، مخفی‌سازی و پین کردن</span>
          </div>

          <ColumnVisibilityList />

          <div className="dsg-column-panel-divider" />

          <ColumnPinControls />
        </div>
      )}
    </aside>
  );
}
