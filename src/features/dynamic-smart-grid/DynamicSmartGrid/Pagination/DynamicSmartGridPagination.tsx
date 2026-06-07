import { useMemo } from "react";
import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

export function DynamicSmartGridPagination() {
  const grid = useDynamicSmartGridContext();

  const { pagination, setPagination, pageCount, totalFilteredRows, props } =
    grid;

  const pageSizeOptions = props.pageSizeOptions ?? [10, 25, 50, 100];

  const currentPage = pagination.pageIndex + 1;

  const from = useMemo(() => {
    if (totalFilteredRows === 0) return 0;
    return pagination.pageIndex * pagination.pageSize + 1;
  }, [pagination.pageIndex, pagination.pageSize, totalFilteredRows]);

  const to = useMemo(() => {
    return Math.min(
      totalFilteredRows,
      (pagination.pageIndex + 1) * pagination.pageSize,
    );
  }, [pagination.pageIndex, pagination.pageSize, totalFilteredRows]);

  const goToPage = (pageIndex: number) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(0, Math.min(pageIndex, pageCount - 1)),
    }));
  };

  return (
    <div className="dsg-pagination">
      <div className="dsg-pagination-info">
        نمایش {from.toLocaleString()} تا {to.toLocaleString()} از{" "}
        {totalFilteredRows.toLocaleString()}
      </div>

      <div className="dsg-pagination-controls">
        <select
          className="dsg-select"
          value={pagination.pageSize}
          onChange={(event) => {
            const nextPageSize = Number(event.target.value);

            setPagination({
              pageIndex: 0,
              pageSize: nextPageSize,
            });
          }}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} ردیف
            </option>
          ))}
        </select>

        <button
          type="button"
          className="dsg-btn"
          disabled={pagination.pageIndex === 0}
          onClick={() => goToPage(0)}
        >
          اول
        </button>

        <button
          type="button"
          className="dsg-btn"
          disabled={pagination.pageIndex === 0}
          onClick={() => goToPage(pagination.pageIndex - 1)}
        >
          قبلی
        </button>

        <span className="dsg-page-indicator">
          صفحه {currentPage.toLocaleString()} از {pageCount.toLocaleString()}
        </span>

        <button
          type="button"
          className="dsg-btn"
          disabled={pagination.pageIndex >= pageCount - 1}
          onClick={() => goToPage(pagination.pageIndex + 1)}
        >
          بعدی
        </button>

        <button
          type="button"
          className="dsg-btn"
          disabled={pagination.pageIndex >= pageCount - 1}
          onClick={() => goToPage(pageCount - 1)}
        >
          آخر
        </button>
      </div>
    </div>
  );
}
