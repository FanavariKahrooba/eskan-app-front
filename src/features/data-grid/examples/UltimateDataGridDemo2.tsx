/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  DataGridButton,
  DataGridEmpty,
  DataGridLoading,
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

type UserStatus = "فعال" | "غیرفعال" | "در انتظار";
type SortDirection = "asc" | "desc" | null;
type ColumnId =
  | "name"
  | "email"
  | "role"
  | "status"
  | "department"
  | "city"
  | "createdAt";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  department: string;
  city: string;
  createdAt: string;
  phone: string;
  score: number;
  details: string;
};

type GridColumn = {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  visible: boolean;
  sortable: boolean;
  description?: string;
  align?: "start" | "center" | "end";
};

type SavedView = {
  id: string;
  name: string;
  description?: string;
  columns: GridColumn[];
  density: DataGridDensity;
};

const ALL_USERS: User[] = [
  {
    id: 1,
    name: "علی رضایی",
    email: "ali@example.com",
    role: "مدیر",
    status: "فعال",
    department: "مدیریت",
    city: "تهران",
    createdAt: "2025-01-10",
    phone: "09121234567",
    score: 95,
    details: "دسترسی کامل به همه بخش‌های سیستم دارد و مدیر ارشد مجموعه است.",
  },
  {
    id: 2,
    name: "مریم احمدی",
    email: "maryam@example.com",
    role: "کاربر",
    status: "فعال",
    department: "فروش",
    city: "اصفهان",
    createdAt: "2025-02-03",
    phone: "09123456789",
    score: 82,
    details: "در تیم فروش فعالیت می‌کند و دسترسی محدود به بخش گزارش‌ها دارد.",
  },
  {
    id: 3,
    name: "رضا کریمی",
    email: "reza@example.com",
    role: "اپراتور",
    status: "غیرفعال",
    department: "عملیات",
    city: "مشهد",
    createdAt: "2024-11-18",
    phone: "09351234567",
    score: 61,
    details: "اکانت کاربر به دلیل عدم فعالیت موقتاً غیرفعال شده است.",
  },
  {
    id: 4,
    name: "سارا محمدی",
    email: "sara@example.com",
    role: "پشتیبان",
    status: "فعال",
    department: "پشتیبانی",
    city: "شیراز",
    createdAt: "2025-03-22",
    phone: "09127654321",
    score: 88,
    details: "مسئول رسیدگی به تیکت‌ها و درخواست‌های کاربران نهایی است.",
  },
  {
    id: 5,
    name: "امیر حسینی",
    email: "amir@example.com",
    role: "تحلیلگر",
    status: "در انتظار",
    department: "تحلیل داده",
    city: "تبریز",
    createdAt: "2025-04-15",
    phone: "09031234567",
    score: 74,
    details: "در انتظار تأیید نهایی برای دسترسی به داشبورد تحلیلی است.",
  },
  {
    id: 6,
    name: "ندا قاسمی",
    email: "neda@example.com",
    role: "کاربر",
    status: "فعال",
    department: "بازاریابی",
    city: "رشت",
    createdAt: "2025-01-30",
    phone: "09129876543",
    score: 79,
    details: "در کمپین‌های بازاریابی دیجیتال فعالیت دارد.",
  },
  {
    id: 7,
    name: "حسین مرادی",
    email: "hossein@example.com",
    role: "اپراتور",
    status: "غیرفعال",
    department: "عملیات",
    city: "کرج",
    createdAt: "2024-10-08",
    phone: "09211234567",
    score: 58,
    details: "به دلیل تغییر واحد سازمانی دسترسی فعلی او محدود شده است.",
  },
  {
    id: 8,
    name: "الهام زمانی",
    email: "elham@example.com",
    role: "پشتیبان",
    status: "فعال",
    department: "پشتیبانی",
    city: "قم",
    createdAt: "2025-05-01",
    phone: "09121239876",
    score: 91,
    details: "یکی از اعضای کلیدی تیم پشتیبانی سطح دو است.",
  },
];

const INITIAL_COLUMNS: GridColumn[] = [
  {
    id: "name",
    label: "نام",
    width: 180,
    minWidth: 130,
    visible: true,
    sortable: true,
    description: "نام کامل کاربر",
    align: "start",
  },
  {
    id: "email",
    label: "ایمیل",
    width: 240,
    minWidth: 180,
    visible: true,
    sortable: true,
    align: "start",
  },
  {
    id: "role",
    label: "نقش",
    width: 130,
    minWidth: 100,
    visible: true,
    sortable: true,
    align: "start",
  },
  {
    id: "status",
    label: "وضعیت",
    width: 130,
    minWidth: 110,
    visible: true,
    sortable: true,
    align: "center",
  },
  {
    id: "department",
    label: "دپارتمان",
    width: 150,
    minWidth: 120,
    visible: true,
    sortable: true,
    align: "start",
  },
  {
    id: "city",
    label: "شهر",
    width: 120,
    minWidth: 100,
    visible: true,
    sortable: true,
    align: "start",
  },
  {
    id: "createdAt",
    label: "تاریخ عضویت",
    width: 140,
    minWidth: 120,
    visible: true,
    sortable: true,
    align: "center",
  },
];

const DEFAULT_SAVED_VIEWS: SavedView[] = [
  {
    id: "default",
    name: "نمای پیش‌فرض",
    description: "همه ستون‌ها",
    columns: INITIAL_COLUMNS,
    density: "comfortable",
  },
  {
    id: "compact-managers",
    name: "نمای مدیریتی",
    description: "ستون‌های مهم‌تر",
    density: "compact",
    columns: INITIAL_COLUMNS.map((column) =>
      ["name", "email", "status", "createdAt"].includes(column.id)
        ? { ...column, visible: true }
        : { ...column, visible: false },
    ),
  },
];

function downloadTextFile(
  filename: string,
  content: string,
  type = "text/plain;charset=utf-8",
) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

function toCsvValue(value: unknown) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function UltimateDataGridDemo2() {
  const [search, setSearch] = useState("");
  const [density, setDensity] = useState<DataGridDensity>("comfortable");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [columns, setColumns] = useState<GridColumn[]>(INITIAL_COLUMNS);
  const [sortBy, setSortBy] = useState<ColumnId>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [savedViews, setSavedViews] =
    useState<SavedView[]>(DEFAULT_SAVED_VIEWS);
  const [activeViewId, setActiveViewId] = useState<string>("default");

  const [draggedColumnId, setDraggedColumnId] = useState<ColumnId | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<ColumnId | null>(
    null,
  );

  const tableWrapperRef = useRef<HTMLDivElement | null>(null);

  const visibleColumns = useMemo(() => {
    return columns.filter((column) => column.visible);
  }, [columns]);

  const rowPaddingClass =
    density === "compact"
      ? "[&_td]:py-2"
      : density === "spacious"
        ? "[&_td]:py-5"
        : "";

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_USERS;

    return ALL_USERS.filter((user) =>
      [
        user.name,
        user.email,
        user.role,
        user.status,
        user.department,
        user.city,
        user.phone,
        user.createdAt,
        user.details,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [search]);

  const sortedUsers = useMemo(() => {
    if (!sortBy || !sortDirection) return filteredUsers;

    const cloned = [...filteredUsers];

    cloned.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      const normalizedA = String(aValue).toLowerCase();
      const normalizedB = String(bValue).toLowerCase();

      const result = normalizedA.localeCompare(normalizedB, "fa");

      return sortDirection === "asc" ? result : -result;
    });

    return cloned;
  }, [filteredUsers, sortBy, sortDirection]);

  const totalRows = sortedUsers.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));

  const paginatedUsers = useMemo(() => {
    const start = pageIndex * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, pageIndex, pageSize]);

  useEffect(() => {
    if (pageIndex > pageCount - 1) {
      setPageIndex(Math.max(0, pageCount - 1));
    }
  }, [pageCount, pageIndex]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const currentPageIds = paginatedUsers.map((user) => user.id);

  const allSelectedOnPage =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedSet.has(id));

  const someSelectedOnPage =
    currentPageIds.some((id) => selectedSet.has(id)) && !allSelectedOnPage;

  const tableMinWidth = useMemo(() => {
    const fixed = 56 + 56 + 130;
    const dynamic = visibleColumns.reduce((sum, col) => sum + col.width, 0);
    return fixed + dynamic;
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

  const setAllCurrentPageSelected = (checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, ...currentPageIds]));
      }
      return prev.filter((id) => !currentPageIds.includes(id));
    });
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
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      return next;
    });
  };

  const resizeColumn = (columnId: ColumnId, width: number) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? { ...column, width: Math.max(column.minWidth, width) }
          : column,
      ),
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

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      resizeColumn(columnId, startWidth + delta);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    // document.body.style.userSelect = "none";
    // document.body.style.cursor = "col-resize";

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleSort = (columnId: ColumnId) => {
    const column = columns.find((item) => item.id === columnId);
    if (!column?.sortable) return;

    if (sortBy !== columnId) {
      setSortBy(columnId);
      setSortDirection("asc");
      return;
    }

    setSortDirection((prev) => {
      if (prev === "asc") return "desc";
      if (prev === "desc") return null;
      return "asc";
    });
  };

  const getSortDirectionForColumn = (columnId: ColumnId) => {
    if (sortBy !== columnId) return undefined;
    return sortDirection ?? undefined;
  };

  const getStatusBadge = (status: UserStatus) => {
    if (status === "فعال") {
      return "bg-emerald-50 text-emerald-700";
    }
    if (status === "در انتظار") {
      return "bg-amber-50 text-amber-700";
    }
    return "bg-slate-100 text-slate-500";
  };

  const getCellContent = (user: User, columnId: ColumnId) => {
    switch (columnId) {
      case "status":
        return (
          <span
            className={[
              "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
              getStatusBadge(user.status),
            ].join(" ")}
          >
            {user.status}
          </span>
        );

      case "createdAt":
        return <span className="tabular-nums">{user.createdAt}</span>;

      default:
        return user[columnId];
    }
  };

  const resetGrid = () => {
    setSearch("");
    setDensity("comfortable");
    setSelectedIds([]);
    setExpandedIds([]);
    setLoading(false);
    setError(null);
    setColumns(INITIAL_COLUMNS);
    setSortBy("name");
    setSortDirection("asc");
    setPageIndex(0);
    setPageSize(5);
    setActiveViewId("default");
  };

  const refreshData = () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const simulateError = () => {
    setLoading(false);
    setError("خطا در دریافت اطلاعات کاربران");
  };

  const exportCsv = () => {
    const exportableColumns = visibleColumns;
    const headers = exportableColumns
      .map((column) => toCsvValue(column.label))
      .join(",");
    const lines = sortedUsers.map((user) =>
      exportableColumns
        .map((column) => {
          const raw =
            column.id === "status"
              ? user.status
              : column.id === "createdAt"
                ? user.createdAt
                : user[column.id];
          return toCsvValue(raw);
        })
        .join(","),
    );

    const csv = [headers, ...lines].join("\n");
    downloadTextFile("users.csv", csv, "text/csv;charset=utf-8");
  };

  const saveCurrentView = () => {
    const id = `view-${Date.now()}`;

    const newView: SavedView = {
      id,
      name: `نمای ذخیره‌شده ${savedViews.length + 1}`,
      description: "نمای سفارشی کاربر",
      columns,
      density,
    };

    setSavedViews((prev) => [...prev, newView]);
    setActiveViewId(id);
  };

  const selectSavedView = (viewId: string) => {
    const view = savedViews.find((item) => item.id === viewId);
    if (!view) return;

    setColumns(view.columns);
    setDensity(view.density);
    setActiveViewId(viewId);
  };

  return (
    <DataGrid
      title="نسخه نهایی و حرفه‌ای Data Grid"
      description="دموی کامل شامل جستجو، انتخاب، بازشونده، مرتب‌سازی، صفحه‌بندی، جابجایی ستون، تغییر اندازه ستون، نماها و خروجی"
      statusMessage={
        error
          ? error
          : selectedIds.length > 0
            ? `${selectedIds.toLocaleString("fa-IR")} ردیف انتخاب شده`
            : `${totalRows.toLocaleString("fa-IR")} ردیف یافت شد`
      }
      statusType={error ? "error" : "info"}
    >
      <DataGridToolbar
        title="مدیریت کاربران"
        subtitle="نسخه حرفه‌ای نهایی با همه امکانات رایج جدول"
        actions={
          <DataGridToolbarActions
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            actions={[
              {
                id: "new-user",
                label: "کاربر جدید",
                variant: "primary",
                onClick: () => alert("ایجاد کاربر جدید"),
              },
              {
                id: "simulate-error",
                label: "خطای آزمایشی",
                onClick: simulateError,
              },
            ]}
          >
            <DataGridSearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPageIndex(0);
              }}
              onClear={() => {
                setSearch("");
                setPageIndex(0);
              }}
              placeholder="جستجو در نام، ایمیل، نقش، شهر، دپارتمان..."
            />

            <DataGridDensityToggle value={density} onChange={setDensity} />

            <DataGridViewOptions
              columns={columns.map((column) => ({
                id: column.id,
                label: column.label,
                visible: column.visible,
              }))}
              onToggleColumn={toggleColumnVisibility}
              onReset={() => setColumns(INITIAL_COLUMNS)}
            />

            <DataGridSavedViewsMenu
              views={savedViews.map((view) => ({
                id: view.id,
                name: view.name,
                description: view.description,
                active: activeViewId === view.id,
              }))}
              activeViewId={activeViewId}
              onSelectView={selectSavedView}
              onSaveCurrentView={saveCurrentView}
              onResetView={() => {
                setSavedViews(DEFAULT_SAVED_VIEWS);
                setActiveViewId("default");
                setColumns(INITIAL_COLUMNS);
                setDensity("comfortable");
              }}
            />

            <DataGridExportMenu
              onExportCsv={exportCsv}
              onExportExcel={() =>
                alert("در صورت نیاز می‌توانم خروجی Excel واقعی هم اضافه کنم")
              }
              onExportJson={() =>
                downloadTextFile(
                  "users.json",
                  JSON.stringify(sortedUsers, null, 2),
                  "application/json;charset=utf-8",
                )
              }
              onPrint={() => window.print()}
            />

            <DataGridResetButton confirm onReset={resetGrid} />

            <DataGridRefreshButton loading={loading} onRefresh={refreshData} />
          </DataGridToolbarActions>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <DataGridButton
          size="sm"
          onClick={() => setExpandedIds(paginatedUsers.map((u) => u.id))}
        >
          باز کردن ردیف‌های این صفحه
        </DataGridButton>

        <DataGridButton
          size="sm"
          onClick={() =>
            setExpandedIds((prev) =>
              prev.filter((id) => !paginatedUsers.some((u) => u.id === id)),
            )
          }
        >
          بستن ردیف‌های این صفحه
        </DataGridButton>

        <DataGridButton
          size="sm"
          onClick={() =>
            tableWrapperRef.current?.scrollTo({ left: 0, behavior: "smooth" })
          }
        >
          اسکرول به ابتدا
        </DataGridButton>
      </div>

      {loading ? <DataGridLoading /> : null}

      {!loading && error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="mb-2 font-bold">خطا</div>
          <div>{error}</div>
          <div className="mt-3">
            <DataGridButton size="sm" onClick={refreshData}>
              تلاش مجدد
            </DataGridButton>
          </div>
        </div>
      ) : null}

      {!loading && !error && totalRows === 0 ? (
        <DataGridEmpty
          action={
            <DataGridButton
              variant="primary"
              onClick={() => {
                setSearch("");
                setPageIndex(0);
              }}
            >
              پاک کردن جستجو
            </DataGridButton>
          }
        />
      ) : null}

      {!loading && !error && totalRows > 0 ? (
        <div ref={tableWrapperRef} className="overflow-x-auto rounded-2xl">
          <DataGridTable
            className={rowPaddingClass}
            // style={{ minWidth: tableMinWidth }}
          >
            <DataGridHeader className="sticky top-0 z-10 bg-white">
              <DataGridHeaderRow>
                <DataGridSelectHeaderCell
                  checked={allSelectedOnPage}
                  indeterminate={someSelectedOnPage}
                  onChange={setAllCurrentPageSelected}
                />

                <DataGridHeaderCell width={56} />

                {visibleColumns.map((column) => {
                  const isDragging = draggedColumnId === column.id;
                  const isDragOver = dragOverColumnId === column.id;

                  return (
                    <DataGridHeaderCell
                      key={column.id}
                      width={column.width}
                      align={column.align === "end" ? "end" : undefined}
                      label={column.label}
                      description={column.description}
                      sortable={column.sortable}
                      sortDirection={getSortDirectionForColumn(column.id)}
                    >
                      <div
                        draggable
                        onClick={() => handleSort(column.id)}
                        onDragStart={() => {
                          setDraggedColumnId(column.id);
                        }}
                        onDragOver={(event) => {
                          event.preventDefault();
                          setDragOverColumnId(column.id);
                        }}
                        onDragLeave={() => {
                          if (dragOverColumnId === column.id) {
                            setDragOverColumnId(null);
                          }
                        }}
                        onDrop={(event) => {
                          event.preventDefault();

                          if (draggedColumnId) {
                            moveColumn(draggedColumnId, column.id);
                          }

                          setDraggedColumnId(null);
                          setDragOverColumnId(null);
                        }}
                        onDragEnd={() => {
                          setDraggedColumnId(null);
                          setDragOverColumnId(null);
                        }}
                        className={[
                          "group relative flex min-h-9 items-center justify-between gap-2 rounded-md px-1",
                          "cursor-pointer select-none",
                          isDragging ? "opacity-50" : "",
                          isDragOver ? "bg-sky-50 ring-1 ring-sky-300" : "",
                        ].join(" ")}
                        title="برای مرتب‌سازی کلیک کنید / برای جابجایی ستون drag & drop کنید"
                      >
                        <span className="truncate font-medium">
                          {column.label}
                        </span>

                        <span className="text-[10px] text-slate-400">⋮⋮</span>

                        <span
                          role="separator"
                          aria-orientation="vertical"
                          onMouseDown={(event) =>
                            startResizeColumn(event, column.id)
                          }
                          onClick={(event) => event.stopPropagation()}
                          className="absolute -left-2 top-0 h-full w-3 cursor-col-resize rounded bg-transparent transition hover:bg-slate-300/60"
                          title="تغییر اندازه ستون"
                        />
                      </div>
                    </DataGridHeaderCell>
                  );
                })}

                <DataGridHeaderCell align="end" width={130}>
                  عملیات
                </DataGridHeaderCell>
              </DataGridHeaderRow>
            </DataGridHeader>

            <DataGridBody>
              {paginatedUsers.map((user, index) => {
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
                          <div
                            className={[
                              "truncate",
                              column.align === "center" ? "text-center" : "",
                              column.align === "end" ? "text-end" : "",
                            ].join(" ")}
                            title={
                              typeof user[column.id] === "string"
                                ? String(user[column.id])
                                : undefined
                            }
                          >
                            {getCellContent(user, column.id)}
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
                            id: "duplicate",
                            label: "کپی",
                            onClick: () => alert(`کپی ${user.name}`),
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
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <div className="mb-1 text-xs text-slate-400">
                              نام
                            </div>
                            <div className="font-medium text-slate-800">
                              {user.name}
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 text-xs text-slate-400">
                              ایمیل
                            </div>
                            <div className="font-medium text-slate-800">
                              {user.email}
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 text-xs text-slate-400">
                              شماره تماس
                            </div>
                            <div className="font-medium text-slate-800">
                              {user.phone}
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 text-xs text-slate-400">
                              امتیاز
                            </div>
                            <div className="font-medium text-slate-800">
                              {user.score}
                            </div>
                          </div>

                          <div className="md:col-span-2 xl:col-span-4">
                            <div className="mb-1 text-xs text-slate-400">
                              توضیحات
                            </div>
                            <div className="rounded-xl bg-slate-50 p-3 leading-7 text-slate-700">
                              {user.details}
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
      ) : null}

      <DataGridFooter
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        pageCount={pageCount}
        selectedCount={selectedIds.length}
        onPreviousPage={() => setPageIndex((prev) => Math.max(0, prev - 1))}
        onNextPage={() =>
          setPageIndex((prev) => Math.min(pageCount - 1, prev + 1))
        }
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </DataGrid>
  );
}
