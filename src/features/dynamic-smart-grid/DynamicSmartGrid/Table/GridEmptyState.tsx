import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

type GridEmptyStateProps = {
  colSpan: number;
};

export function GridEmptyState({ colSpan }: GridEmptyStateProps) {
  const grid = useDynamicSmartGridContext();

  const { props, globalFilter, columnFilters } = grid;

  const hasFilter =
    Boolean(globalFilter) ||
    Object.values(columnFilters).some((value) => Boolean(value));

  return (
    <div className="dsg-empty-state">
      <div className="dsg-empty-card">
        <div className="dsg-empty-icon">∅</div>

        <div className="dsg-empty-title">
          {hasFilter ? "نتیجه‌ای پیدا نشد" : "داده‌ای برای نمایش وجود ندارد"}
        </div>

        <div className="dsg-empty-description">
          {hasFilter
            ? "فیلترها یا عبارت جستجو را تغییر دهید."
            : (props.emptyMessage ?? "لیست داده‌ها خالی است.")}
        </div>
      </div>

      <table className="dsg-empty-helper-table" aria-hidden="true">
        <tbody>
          <tr>
            <td colSpan={colSpan} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
