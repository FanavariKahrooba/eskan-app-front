import { useDynamicSmartGridContext } from "../DynamicSmartGrid.context";

type DynamicSmartGridHeaderMenuProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  column: any;
  onClose?: () => void;
};

export function DynamicSmartGridHeaderMenu<
  TData extends Record<string, unknown> = Record<string, unknown>,
>({ column, onClose }: DynamicSmartGridHeaderMenuProps<TData>) {
  const grid = useDynamicSmartGridContext<TData>();

  const {
    props,
    setColumnVisibility,
    setColumnPinning,
    setSorting,
    setColumnFilters,
    columnPinning,
  } = grid;

  const pinned = columnPinning[column.id] ?? column.pinned ?? false;

  const close = () => {
    onClose?.();
  };

  const pin = (direction: any) => {
    setColumnPinning((prev) => ({
      ...prev,
      [column.id]: direction,
    }));

    close();
  };

  return (
    <div className="dsg-header-menu" role="menu">
      <div className="dsg-header-menu-title">{column.header}</div>

      {props.enableSorting && column.enableSorting !== false && (
        <>
          <button
            type="button"
            className="dsg-header-menu-item"
            onClick={() => {
              setSorting([{ columnId: column.id, direction: "asc" }]);
              close();
            }}
          >
            مرتب‌سازی صعودی
          </button>

          <button
            type="button"
            className="dsg-header-menu-item"
            onClick={() => {
              setSorting([{ columnId: column.id, direction: "desc" }]);
              close();
            }}
          >
            مرتب‌سازی نزولی
          </button>

          <button
            type="button"
            className="dsg-header-menu-item"
            onClick={() => {
              setSorting((prev) =>
                prev.filter((item) => item.columnId !== column.id),
              );
              close();
            }}
          >
            حذف مرتب‌سازی این ستون
          </button>
        </>
      )}

      {props.enableColumnFilters && column.enableFiltering !== false && (
        <button
          type="button"
          className="dsg-header-menu-item"
          onClick={() => {
            setColumnFilters((prev) => ({
              ...prev,
              [column.id]: "",
            }));
            close();
          }}
        >
          پاک کردن فیلتر ستون
        </button>
      )}

      {props.enableColumnPinning && (
        <>
          <div className="dsg-header-menu-separator" />

          <button
            type="button"
            className={
              pinned === "right"
                ? "dsg-header-menu-item active"
                : "dsg-header-menu-item"
            }
            onClick={() => pin("right")}
          >
            پین راست
          </button>

          <button
            type="button"
            className={
              pinned === "left"
                ? "dsg-header-menu-item active"
                : "dsg-header-menu-item"
            }
            onClick={() => pin("left")}
          >
            پین چپ
          </button>

          <button
            type="button"
            className={
              pinned === false
                ? "dsg-header-menu-item active"
                : "dsg-header-menu-item"
            }
            onClick={() => pin(false)}
          >
            آزاد کردن ستون
          </button>
        </>
      )}

      {props.enableColumnVisibility !== false &&
        column.enableHiding !== false && (
          <>
            <div className="dsg-header-menu-separator" />

            <button
              type="button"
              className="dsg-header-menu-item danger"
              onClick={() => {
                setColumnVisibility((prev) => ({
                  ...prev,
                  [column.id]: false,
                }));

                close();
              }}
            >
              مخفی کردن ستون
            </button>
          </>
        )}
    </div>
  );
}
