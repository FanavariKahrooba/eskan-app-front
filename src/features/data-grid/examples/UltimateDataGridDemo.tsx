"use client";

import { Fragment, useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import {
  DataGrid,
  DataGridToolbar,
  DataGridToolbarActions,
  DataGridSearchInput,
  DataGridDensityToggle,
  DataGridExportMenu,
  DataGridRefreshButton,
  DataGridResetButton,
  DataGridSavedViewsMenu,
  DataGridViewOptions,
  DataGridTable,
  DataGridHeader,
  DataGridHeaderRow,
  DataGridHeaderCell,
  DataGridSelectHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridSelectCell,
  DataGridExpandCell,
  DataGridExpandedRow,
  RowActionsCell,
  DataGridFooter,
} from "@/features/data-grid";

import type { DataGridDensity } from "@/features/data-grid";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "فعال" | "غیرفعال";
  details: string;
};

type ColumnId = "name" | "email" | "role" | "status";

type GridColumn = {
  id: ColumnId;
  label: string;
  description?: string;
  width: number;
  minWidth: number;
  visible: boolean;
  sortable?: boolean;
};

const users: User[] = [
  {
    id: 1,
    name: "علی رضایی",
    email: "ali@example.com",
    role: "مدیر",
    status: "فعال",
    details: "دسترسی کامل به سیستم دارد.",
  },
  {
    id: 2,
    name: "مریم احمدی",
    email: "maryam@example.com",
    role: "کاربر",
    status: "فعال",
    details: "در بخش فروش فعالیت می‌کند.",
  },
  {
    id: 3,
    name: "رضا کریمی",
    email: "reza@example.com",
    role: "اپراتور",
    status: "غیرفعال",
    details: "اکانت این کاربر فعلاً غیرفعال است.",
  },
  {
    id: 4,
    name: "سارا محمدی",
    email: "sara@example.com",
    role: "پشتیبان",
    status: "فعال",
    details: "مسئول پاسخ‌گویی به درخواست‌های کاربران است.",
  },
  {
    id: 5,
    name: "امیر حسینی",
    email: "amir@example.com",
    role: "تحلیلگر",
    status: "غیرفعال",
    details: "در حال حاضر دسترسی این کاربر محدود شده است.",
  },
];

const initialColumns: GridColumn[] = [
  {
    id: "name",
    label: "نام",
    description: "نام کامل کاربر",
    width: 180,
    minWidth: 120,
    visible: true,
    sortable: true,
  },
  {
    id: "email",
    label: "ایمیل",
    width: 240,
    minWidth: 160,
    visible: true,
  },
  {
    id: "role",
    label: "نقش",
    width: 140,
    minWidth: 100,
    visible: true,
  },
  {
    id: "status",
    label: "وضعیت",
    width: 130,
    minWidth: 100,
    visible: true,
  },
];

export function UltimateDataGridDemo() {
  const [search, setSearch] = useState("");
  const [density, setDensity] = useState<DataGridDensity>("comfortable");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState<GridColumn[]>(initialColumns);
  const [draggedColumnId, setDraggedColumnId] = useState<ColumnId | null>(null);

  const visibleColumns = useMemo(() => {
    return columns.filter((column) => column.visible);
  }, [columns]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return users;

    return users.filter((user) =>
      `${user.name} ${user.email} ${user.role} ${user.status}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [search]);

  const selectedSet = useMemo(() => {
    return new Set(selectedIds);
  }, [selectedIds]);

  const filteredUserIds = useMemo(() => {
    return filteredUsers.map((user) => user.id);
  }, [filteredUsers]);

  const allSelected =
    filteredUserIds.length > 0 &&
    filteredUserIds.every((id) => selectedSet.has(id));

  const someSelected =
    filteredUserIds.some((id) => selectedSet.has(id)) && !allSelected;

  const rowPaddingClass =
    density === "compact"
      ? "[&_td]:py-2"
      : density === "spacious"
        ? "[&_td]:py-5"
        : "";

  const tableMinWidth = useMemo(() => {
    const fixedColumnsWidth = 54 + 54 + 120;
    const dynamicColumnsWidth = visibleColumns.reduce(
      (sum, column) => sum + column.width,
      0,
    );

    return fixedColumnsWidth + dynamicColumnsWidth;
  }, [visibleColumns]);

  const toggleSelected = (id: number, checked?: boolean) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(id);
      const shouldSelect = checked ?? !exists;

      if (shouldSelect && !exists) return [...prev, id];
      if (!shouldSelect && exists) return prev.filter((item) => item !== id);

      return prev;
    });
  };

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleColumnVisibility = (columnId: string, visible: boolean) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId ? { ...column, visible } : column,
      ),
    );
  };

  const moveColumn = (fromId: ColumnId, toId: ColumnId) => {
    if (fromId === toId) return;

    setColumns((prev) => {
      const fromIndex = prev.findIndex((column) => column.id === fromId);
      const toIndex = prev.findIndex((column) => column.id === toId);

      if (fromIndex === -1 || toIndex === -1) return prev;

      const next = [...prev];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);

      return next;
    });
  };

  const resizeColumn = (columnId: ColumnId, nextWidth: number) => {
    setColumns((prev) =>
      prev.map((column) => {
        if (column.id !== columnId) return column;

        return {
          ...column,
          width: Math.max(column.minWidth, nextWidth),
        };
      }),
    );
  };

  const startResizeColumn = (
    event: ReactMouseEvent<HTMLSpanElement>,
    columnId: ColumnId,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const column = columns.find((item) => item.id === columnId);
    if (!column) return;

    const startX = event.clientX;
    const startWidth = column.width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      /**
       * در حالت RTL اگر خواستی جهت resize برعکس شود،
       * می‌توانی delta را منفی کنی.
       *
       * const delta = startX - moveEvent.clientX;
       */
      const delta = moveEvent.clientX - startX;
      resizeColumn(columnId, startWidth + delta);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    // document.body.style.cursor = "col-resize";
    // document.body.style.userSelect = "none";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const getCellValue = (user: User, columnId: ColumnId) => {
    if (columnId === "status") {
      return (
        <span
          className={[
            "rounded-full px-2.5 py-1 text-xs font-bold",
            user.status === "فعال"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500",
          ].join(" ")}
        >
          {user.status}
        </span>
      );
    }

    return user[columnId];
  };

  const resetGrid = () => {
    setSearch("");
    setDensity("comfortable");
    setSelectedIds([]);
    setExpandedIds([]);
    setColumns(initialColumns);
  };

  return (
    <DataGrid
      title="جدول کامل کاربران"
      description="نمونه ترکیبی برای استفاده از امکانات مختلف جدول"
      statusMessage={
        selectedIds.length > 0
          ? `${selectedIds.length.toLocaleString("fa-IR")} ردیف انتخاب شده است`
          : undefined
      }
      statusType="info"
    >
      <DataGridToolbar
        title="کاربران"
        subtitle="مدیریت کاربران، ستون‌ها، نماها، خروجی، جابجایی و تغییر اندازه ستون‌ها"
        actions={
          <DataGridToolbarActions
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            actions={[
              {
                id: "new",
                label: "کاربر جدید",
                variant: "primary",
                onClick: () => alert("ایجاد کاربر جدید"),
              },
            ]}
          >
            <DataGridSearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="جستجو..."
            />

            <DataGridDensityToggle value={density} onChange={setDensity} />

            <DataGridViewOptions
              columns={columns.map((column) => ({
                id: column.id,
                label: column.label,
                visible: column.visible,
              }))}
              onToggleColumn={toggleColumnVisibility}
              onReset={() => setColumns(initialColumns)}
            />

            <DataGridSavedViewsMenu
              views={[
                {
                  id: "default",
                  name: "نمای پیش‌فرض",
                  description: "همه ستون‌ها",
                  active: true,
                },
                {
                  id: "compact",
                  name: "نمای مدیریتی",
                  description: "ستون‌های مهم",
                },
              ]}
              activeViewId="default"
              onSelectView={(id) => alert(`انتخاب نما: ${id}`)}
              onSaveCurrentView={() => alert("ذخیره نمای فعلی")}
              onResetView={() => setColumns(initialColumns)}
            />

            <DataGridExportMenu
              onExportCsv={() => alert("CSV")}
              onExportExcel={() => alert("Excel")}
              onExportJson={() => alert("JSON")}
              onPrint={() => window.print()}
            />

            <DataGridResetButton confirm onReset={resetGrid} />

            <DataGridRefreshButton
              loading={loading}
              onRefresh={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
            />
          </DataGridToolbarActions>
        }
      />

      <div className="overflow-x-auto">
        <DataGridTable
          className={rowPaddingClass}
          // style={{
          //   minWidth: tableMinWidth,
          // }}
        >
          <DataGridHeader>
            <DataGridHeaderRow>
              <DataGridSelectHeaderCell
                checked={allSelected}
                indeterminate={someSelected}
                onChange={(checked) => {
                  setSelectedIds(checked ? filteredUserIds : []);
                }}
              />

              <DataGridHeaderCell width={54} />

              {visibleColumns.map((column) => (
                <DataGridHeaderCell
                  key={column.id}
                  width={column.width}
                  label={column.label}
                  description={column.description}
                  sortable={column.sortable}
                  sortDirection={column.id === "name" ? "asc" : undefined}
                >
                  <div
                    draggable
                    onDragStart={() => setDraggedColumnId(column.id)}
                    onDragOver={(event) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      event.preventDefault();

                      if (!draggedColumnId) return;

                      moveColumn(draggedColumnId, column.id);
                      setDraggedColumnId(null);
                    }}
                    onDragEnd={() => setDraggedColumnId(null)}
                    className={[
                      "group relative flex min-h-8 cursor-move items-center justify-between gap-2",
                      draggedColumnId === column.id ? "opacity-50" : "",
                    ].join(" ")}
                    title="برای جابجایی ستون، بکشید و رها کنید"
                  >
                    <span className="truncate">{column.label}</span>

                    <span
                      role="separator"
                      aria-orientation="vertical"
                      title="تغییر اندازه ستون"
                      onMouseDown={(event) =>
                        startResizeColumn(event, column.id)
                      }
                      className="absolute -left-2 top-0 h-full w-3 cursor-col-resize select-none rounded bg-transparent transition group-hover:bg-slate-300/60"
                    />
                  </div>
                </DataGridHeaderCell>
              ))}

              <DataGridHeaderCell align="end" width={120}>
                عملیات
              </DataGridHeaderCell>
            </DataGridHeaderRow>
          </DataGridHeader>

          <DataGridBody>
            {filteredUsers.map((user, index) => {
              const selected = selectedSet.has(user.id);
              const expanded = expandedIds.includes(user.id);

              return (
                <Fragment key={user.id}>
                  <DataGridRow
                    index={index}
                    selected={selected}
                    expanded={expanded}
                    clickable
                    onClick={() => toggleSelected(user.id)}
                  >
                    <DataGridSelectCell
                      checked={selected}
                      onChange={(checked) => toggleSelected(user.id, checked)}
                    />

                    <DataGridExpandCell
                      expanded={expanded}
                      onToggle={() => toggleExpanded(user.id)}
                    />

                    {visibleColumns.map((column) => (
                      <DataGridCell
                        key={`${user.id}-${column.id}`}
                        style={{
                          width: column.width,
                          minWidth: column.width,
                          maxWidth: column.width,
                        }}
                      >
                        <div className="truncate">
                          {getCellValue(user, column.id)}
                        </div>
                      </DataGridCell>
                    ))}

                    <RowActionsCell
                      actions={[
                        {
                          id: "view",
                          label: "مشاهده",
                          onClick: () => alert(`مشاهده ${user.name}`),
                        },
                        {
                          id: "edit",
                          label: "ویرایش",
                          onClick: () => alert(`ویرایش ${user.name}`),
                        },
                        {
                          id: "delete",
                          label: "حذف",
                          danger: true,
                          onClick: () => alert(`حذف ${user.name}`),
                        },
                      ]}
                    />
                  </DataGridRow>

                  {expanded ? (
                    <DataGridExpandedRow
                      key={`${user.id}-expanded`}
                      colSpan={visibleColumns.length + 3}
                    >
                      <div className="space-y-2 text-sm leading-7 text-slate-600">
                        <div className="font-bold text-slate-800">
                          جزئیات کاربر
                        </div>

                        <div>{user.details}</div>

                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <span className="font-bold text-slate-700">
                              ایمیل:
                            </span>{" "}
                            {user.email}
                          </div>

                          <div>
                            <span className="font-bold text-slate-700">
                              نقش:
                            </span>{" "}
                            {user.role}
                          </div>

                          <div>
                            <span className="font-bold text-slate-700">
                              وضعیت:
                            </span>{" "}
                            {user.status}
                          </div>

                          <div>
                            <span className="font-bold text-slate-700">
                              شناسه:
                            </span>{" "}
                            {user.id}
                          </div>
                        </div>
                      </div>
                    </DataGridExpandedRow>
                  ) : null}
                </Fragment>
              );
            })}
          </DataGridBody>
        </DataGridTable>
      </div>

      <DataGridFooter
        pageIndex={0}
        pageSize={10}
        totalRows={filteredUsers.length}
        pageCount={1}
        selectedCount={selectedIds.length}
        onPreviousPage={() => alert("صفحه قبل")}
        onNextPage={() => alert("صفحه بعد")}
        onPageSizeChange={(size) => alert(`page size: ${size}`)}
      />
    </DataGrid>
  );
}
