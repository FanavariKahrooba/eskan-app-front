"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";

type UserStatus = "فعال" | "غیرفعال" | "در انتظار";
type Density = "compact" | "comfortable" | "spacious";
type PinSide = "left" | "right" | null;
type SortDirection = "asc" | "desc";

type ColumnId =
  | "name"
  | "email"
  | "role"
  | "status"
  | "department"
  | "city"
  | "createdAt"
  | "score";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  department: string;
  city: string;
  createdAt: string;
  score: number;
  phone: string;
  description: string;
};

type Column = {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  visible: boolean;
  sortable: boolean;
  filterable: boolean;
  editable: boolean;
  pinned: PinSide;
  align?: "start" | "center" | "end";
};

type SortItem = {
  id: ColumnId;
  direction: SortDirection;
};

type EditingCell = {
  rowId: number;
  columnId: ColumnId;
} | null;

type ContextMenuState = {
  x: number;
  y: number;
  columnId: ColumnId;
} | null;

const STORAGE_KEY = "enterprise-data-grid-layout-v1";

const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "علی رضایی",
    email: "ali@example.com",
    role: "مدیر",
    status: "فعال",
    department: "مدیریت",
    city: "تهران",
    createdAt: "2025-01-10",
    score: 95,
    phone: "09121234567",
    description: "مدیر ارشد سیستم با دسترسی کامل.",
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
    score: 82,
    phone: "09123456789",
    description: "عضو تیم فروش و پیگیری مشتریان.",
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
    score: 61,
    phone: "09351234567",
    description: "اکانت به دلیل عدم فعالیت غیرفعال شده است.",
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
    score: 88,
    phone: "09127654321",
    description: "مسئول تیکت‌های سطح دو.",
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
    score: 74,
    phone: "09031234567",
    description: "در انتظار تأیید دسترسی داشبورد.",
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
    score: 79,
    phone: "09129876543",
    description: "فعال در کمپین‌های بازاریابی دیجیتال.",
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
    score: 58,
    phone: "09211234567",
    description: "دسترسی فعلی کاربر محدود شده است.",
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
    score: 91,
    phone: "09121239876",
    description: "عضو کلیدی پشتیبانی سطح دو.",
  },
];

const INITIAL_COLUMNS: Column[] = [
  {
    id: "name",
    label: "نام",
    width: 180,
    minWidth: 120,
    visible: true,
    sortable: true,
    filterable: true,
    editable: true,
    pinned: "right",
  },
  {
    id: "email",
    label: "ایمیل",
    width: 240,
    minWidth: 180,
    visible: true,
    sortable: true,
    filterable: true,
    editable: true,
    pinned: null,
  },
  {
    id: "role",
    label: "نقش",
    width: 130,
    minWidth: 100,
    visible: true,
    sortable: true,
    filterable: true,
    editable: true,
    pinned: null,
  },
  {
    id: "status",
    label: "وضعیت",
    width: 130,
    minWidth: 110,
    visible: true,
    sortable: true,
    filterable: true,
    editable: true,
    pinned: null,
    align: "center",
  },
  {
    id: "department",
    label: "دپارتمان",
    width: 160,
    minWidth: 120,
    visible: true,
    sortable: true,
    filterable: true,
    editable: true,
    pinned: null,
  },
  {
    id: "city",
    label: "شهر",
    width: 120,
    minWidth: 100,
    visible: true,
    sortable: true,
    filterable: true,
    editable: true,
    pinned: null,
  },
  {
    id: "createdAt",
    label: "تاریخ عضویت",
    width: 150,
    minWidth: 120,
    visible: true,
    sortable: true,
    filterable: true,
    editable: true,
    pinned: null,
    align: "center",
  },
  {
    id: "score",
    label: "امتیاز",
    width: 110,
    minWidth: 90,
    visible: true,
    sortable: true,
    filterable: true,
    editable: true,
    pinned: "left",
    align: "center",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toCsvValue(value: unknown) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function getStatusClass(status: UserStatus) {
  if (status === "فعال")
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "در انتظار")
    return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-slate-100 text-slate-500 ring-slate-200";
}

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function getColumnStickyStyle(
  column: Column,
  visibleColumns: Column[],
): CSSProperties {
  if (!column.pinned) return {};

  if (column.pinned === "right") {
    const right = visibleColumns
      .filter((item) => item.pinned === "right")
      .slice(
        0,
        visibleColumns
          .filter((item) => item.pinned === "right")
          .findIndex((item) => item.id === column.id),
      )
      .reduce((sum, item) => sum + item.width, 0);

    return {
      position: "sticky",
      right,
      zIndex: 3,
    };
  }

  const left = visibleColumns
    .filter((item) => item.pinned === "left")
    .slice(
      0,
      visibleColumns
        .filter((item) => item.pinned === "left")
        .findIndex((item) => item.id === column.id),
    )
    .reduce((sum, item) => sum + item.width, 0);

  return {
    position: "sticky",
    left,
    zIndex: 3,
  };
}

export default function EnterpriseDataGridDemo() {
  const [rows, setRows] = useState<User[]>(INITIAL_USERS);
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<
    Partial<Record<ColumnId, string>>
  >({});
  const [sorts, setSorts] = useState<SortItem[]>([
    { id: "name", direction: "asc" },
  ]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [density, setDensity] = useState<Density>("comfortable");

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [draggedColumnId, setDraggedColumnId] = useState<ColumnId | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<ColumnId | null>(
    null,
  );

  const [fullscreen, setFullscreen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        columns?: Column[];
        density?: Density;
        pageSize?: number;
      };

      if (parsed.columns?.length) setColumns(parsed.columns);
      if (parsed.density) setDensity(parsed.density);
      if (parsed.pageSize) setPageSize(parsed.pageSize);
    } catch {
      //
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        columns,
        density,
        pageSize,
      }),
    );
  }, [columns, density, pageSize]);

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const orderedColumns = useMemo(() => {
    const right = columns.filter(
      (column) => column.visible && column.pinned === "right",
    );
    const normal = columns.filter((column) => column.visible && !column.pinned);
    const left = columns.filter(
      (column) => column.visible && column.pinned === "left",
    );

    return [...right, ...normal, ...left];
  }, [columns]);

  const tableMinWidth = useMemo(() => {
    return (
      56 +
      56 +
      130 +
      orderedColumns.reduce((sum, column) => sum + column.width, 0)
    );
  }, [orderedColumns]);

  const filteredRows = useMemo(() => {
    const global = normalize(globalFilter);

    return rows.filter((row) => {
      const globalMatch =
        !global || Object.values(row).map(normalize).join(" ").includes(global);

      if (!globalMatch) return false;

      return Object.entries(columnFilters).every(([key, value]) => {
        const filterValue = normalize(value);
        if (!filterValue) return true;

        const columnId = key as ColumnId;
        return normalize(row[columnId]).includes(filterValue);
      });
    });
  }, [rows, globalFilter, columnFilters]);

  const sortedRows = useMemo(() => {
    if (sorts.length === 0) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      for (const sort of sorts) {
        const aValue = a[sort.id];
        const bValue = b[sort.id];

        let result = 0;

        if (typeof aValue === "number" && typeof bValue === "number") {
          result = aValue - bValue;
        } else {
          result = String(aValue).localeCompare(String(bValue), "fa");
        }

        if (result !== 0) {
          return sort.direction === "asc" ? result : -result;
        }
      }

      return 0;
    });
  }, [filteredRows, sorts]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const start = pageIndex * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, pageIndex, pageSize]);

  useEffect(() => {
    if (pageIndex > pageCount - 1) {
      setPageIndex(Math.max(0, pageCount - 1));
    }
  }, [pageIndex, pageCount]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const currentPageIds = paginatedRows.map((row) => row.id);
  const allPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedSet.has(id));

  const rowHeightClass =
    density === "compact" ? "h-10" : density === "spacious" ? "h-16" : "h-12";

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

  const resizeColumn = (columnId: ColumnId, width: number) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? { ...column, width: Math.max(column.minWidth, width) }
          : column,
      ),
    );
  };

  const startResize = (
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
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const toggleSort = (columnId: ColumnId, multi = false) => {
    const column = columns.find((item) => item.id === columnId);
    if (!column?.sortable) return;

    setSorts((prev) => {
      const existing = prev.find((item) => item.id === columnId);

      if (!multi) {
        if (!existing) return [{ id: columnId, direction: "asc" }];
        if (existing.direction === "asc")
          return [{ id: columnId, direction: "desc" }];
        return [];
      }

      if (!existing) {
        return [...prev, { id: columnId, direction: "asc" }];
      }

      if (existing.direction === "asc") {
        return prev.map((item) =>
          item.id === columnId ? { ...item, direction: "desc" } : item,
        );
      }

      return prev.filter((item) => item.id !== columnId);
    });
  };

  const getSortLabel = (columnId: ColumnId) => {
    const index = sorts.findIndex((item) => item.id === columnId);
    if (index === -1) return "";

    const sort = sorts[index];
    return `${sort.direction === "asc" ? "↑" : "↓"}${sorts.length > 1 ? index + 1 : ""}`;
  };

  const toggleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectCurrentPage = () => {
    setSelectedIds((prev) => {
      if (allPageSelected) {
        return prev.filter((id) => !currentPageIds.includes(id));
      }

      return Array.from(new Set([...prev, ...currentPageIds]));
    });
  };

  const selectAllFiltered = () => {
    setSelectedIds(sortedRows.map((row) => row.id));
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const updateCell = (rowId: number, columnId: ColumnId, value: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;

        if (columnId === "score") {
          return {
            ...row,
            score: Number(value) || 0,
          };
        }

        return {
          ...row,
          [columnId]: value,
        };
      }),
    );
  };

  const toggleColumnVisibility = (columnId: ColumnId) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? { ...column, visible: !column.visible }
          : column,
      ),
    );
  };

  const pinColumn = (columnId: ColumnId, pinned: PinSide) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId ? { ...column, pinned } : column,
      ),
    );
  };

  const exportCsv = () => {
    const headers = orderedColumns
      .map((column) => toCsvValue(column.label))
      .join(",");

    const lines = sortedRows.map((row) =>
      orderedColumns.map((column) => toCsvValue(row[column.id])).join(","),
    );

    downloadFile(
      "enterprise-users.csv",
      [headers, ...lines].join("\n"),
      "text/csv;charset=utf-8",
    );
  };

  const exportJson = () => {
    downloadFile(
      "enterprise-users.json",
      JSON.stringify(sortedRows, null, 2),
      "application/json;charset=utf-8",
    );
  };

  const resetLayout = () => {
    setColumns(INITIAL_COLUMNS);
    setDensity("comfortable");
    setPageSize(5);
    setGlobalFilter("");
    setColumnFilters({});
    setSorts([{ id: "name", direction: "asc" }]);
    setSelectedIds([]);
    setExpandedIds([]);
    setPageIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const renderCell = (row: User, column: Column) => {
    const isEditing =
      editingCell?.rowId === row.id && editingCell.columnId === column.id;

    if (isEditing && column.editable) {
      return (
        <input
          autoFocus
          defaultValue={String(row[column.id] ?? "")}
          onBlur={(event) => {
            updateCell(row.id, column.id, event.target.value);
            setEditingCell(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              updateCell(row.id, column.id, event.currentTarget.value);
              setEditingCell(null);
            }

            if (event.key === "Escape") {
              setEditingCell(null);
            }
          }}
          className="h-8 w-full rounded-lg border border-sky-300 bg-white px-2 text-sm outline-none ring-2 ring-sky-100"
        />
      );
    }

    if (column.id === "status") {
      return (
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1",
            getStatusClass(row.status),
          )}
        >
          {row.status}
        </span>
      );
    }

    if (column.id === "score") {
      return (
        <span className="inline-flex min-w-10 justify-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
          {row.score}
        </span>
      );
    }

    return String(row[column.id] ?? "");
  };

  return (
    <div
      dir="rtl"
      className={cn(
        "bg-slate-50 p-4 text-slate-900",
        fullscreen ? "fixed inset-0 z-[9999] overflow-auto" : "rounded-3xl",
      )}
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-black">Enterprise Data Grid</h2>
              <p className="mt-1 text-sm text-slate-500">
                نسخه پیشرفته با Pin، Resize، Drag، Multi-sort، Filter، Inline
                Edit و ذخیره Layout
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFullscreen((prev) => !prev)}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
              >
                {fullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
              </button>

              <button
                onClick={exportCsv}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
              >
                CSV
              </button>

              <button
                onClick={exportJson}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
              >
                JSON
              </button>

              <button
                onClick={resetLayout}
                className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_auto_auto]">
            <input
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value);
                setPageIndex(0);
              }}
              placeholder="جستجوی سراسری..."
              className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-50"
            />

            <select
              value={density}
              onChange={(event) => setDensity(event.target.value as Density)}
              className="h-11 rounded-2xl border border-slate-200 px-3 text-sm"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>

            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPageIndex(0);
              }}
              className="h-11 rounded-2xl border border-slate-200 px-3 text-sm"
            >
              <option value={5}>5 ردیف</option>
              <option value={10}>10 ردیف</option>
              <option value={20}>20 ردیف</option>
              <option value={50}>50 ردیف</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {columns.map((column) => (
              <button
                key={column.id}
                onClick={() => toggleColumnVisibility(column.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs",
                  column.visible
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-400",
                )}
              >
                {column.visible ? "✓ " : ""}
                {column.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <button
              onClick={selectAllFiltered}
              className="rounded-xl border px-3 py-2 hover:bg-slate-50"
            >
              انتخاب همه نتایج فیلترشده
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="rounded-xl border px-3 py-2 hover:bg-slate-50"
            >
              پاک کردن انتخاب‌ها
            </button>

            <div className="text-slate-500">
              {selectedIds.length.toLocaleString("fa-IR")} انتخاب‌شده /{" "}
              {sortedRows.length.toLocaleString("fa-IR")} نتیجه
            </div>
          </div>
        </div>

        <div
          ref={wrapperRef}
          className="overflow-auto rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <table
            className="w-full border-separate border-spacing-0 text-sm"
            style={{ minWidth: tableMinWidth }}
          >
            <thead className="sticky top-0 z-20 bg-white">
              <tr>
                <th className="sticky right-0 z-30 w-14 border-b border-slate-200 bg-white px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectCurrentPage}
                  />
                </th>

                <th className="sticky right-14 z-30 w-14 border-b border-slate-200 bg-white px-3 py-3" />

                {orderedColumns.map((column) => {
                  const stickyStyle = getColumnStickyStyle(
                    column,
                    orderedColumns,
                  );
                  const sortLabel = getSortLabel(column.id);

                  return (
                    <th
                      key={column.id}
                      style={{
                        width: column.width,
                        minWidth: column.width,
                        maxWidth: column.width,
                        ...stickyStyle,
                      }}
                      className={cn(
                        "border-b border-slate-200 bg-white p-0 text-right font-bold",
                        column.pinned &&
                          "shadow-[0_0_0_1px_rgba(226,232,240,1)]",
                        dragOverColumnId === column.id && "bg-sky-50",
                      )}
                    >
                      <div
                        draggable
                        onDragStart={() => setDraggedColumnId(column.id)}
                        onDragOver={(event) => {
                          event.preventDefault();
                          setDragOverColumnId(column.id);
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
                        onClick={(event) =>
                          toggleSort(column.id, event.shiftKey)
                        }
                        onContextMenu={(event) => {
                          event.preventDefault();
                          setContextMenu({
                            x: event.clientX,
                            y: event.clientY,
                            columnId: column.id,
                          });
                        }}
                        className="relative flex h-12 cursor-pointer select-none items-center justify-between gap-2 px-3"
                        title="کلیک برای Sort / Shift+Click برای Multi-sort / Drag برای جابجایی / Right Click برای منو"
                      >
                        <span className="truncate">{column.label}</span>

                        <span className="text-xs text-sky-600">
                          {sortLabel}
                        </span>

                        <span className="text-slate-300">⋮⋮</span>

                        <span
                          role="separator"
                          onMouseDown={(event) => startResize(event, column.id)}
                          onClick={(event) => event.stopPropagation()}
                          className="absolute left-0 top-0 h-full w-2 cursor-col-resize hover:bg-sky-200"
                        />
                      </div>
                    </th>
                  );
                })}

                <th className="sticky left-0 z-30 w-[130px] border-b border-slate-200 bg-white px-3 py-3 text-left">
                  عملیات
                </th>
              </tr>

              <tr>
                <th className="sticky right-0 z-30 border-b border-slate-200 bg-slate-50" />
                <th className="sticky right-14 z-30 border-b border-slate-200 bg-slate-50" />

                {orderedColumns.map((column) => {
                  const stickyStyle = getColumnStickyStyle(
                    column,
                    orderedColumns,
                  );

                  return (
                    <th
                      key={`${column.id}-filter`}
                      style={{
                        width: column.width,
                        minWidth: column.width,
                        maxWidth: column.width,
                        ...stickyStyle,
                      }}
                      className="border-b border-slate-200 bg-slate-50 p-2"
                    >
                      {column.filterable ? (
                        <input
                          value={columnFilters[column.id] ?? ""}
                          onChange={(event) => {
                            setColumnFilters((prev) => ({
                              ...prev,
                              [column.id]: event.target.value,
                            }));
                            setPageIndex(0);
                          }}
                          placeholder="فیلتر..."
                          className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-sky-300"
                        />
                      ) : null}
                    </th>
                  );
                })}

                <th className="sticky left-0 z-30 border-b border-slate-200 bg-slate-50" />
              </tr>
            </thead>

            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={orderedColumns.length + 3}
                    className="p-10 text-center text-slate-500"
                  >
                    نتیجه‌ای یافت نشد.
                  </td>
                </tr>
              ) : null}

              {paginatedRows.map((row) => {
                const selected = selectedSet.has(row.id);
                const expanded = expandedIds.includes(row.id);

                return (
                  <Fragment key={row.id}>
                    <tr
                      className={cn(
                        "group hover:bg-slate-50",
                        selected && "bg-sky-50/60",
                        rowHeightClass,
                      )}
                    >
                      <td className="sticky right-0 z-10 border-b border-slate-100 bg-inherit px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelectRow(row.id)}
                        />
                      </td>

                      <td className="sticky right-14 z-10 border-b border-slate-100 bg-inherit px-3 text-center">
                        <button
                          onClick={() => toggleExpand(row.id)}
                          className="rounded-lg px-2 py-1 hover:bg-slate-200"
                        >
                          {expanded ? "−" : "+"}
                        </button>
                      </td>

                      {orderedColumns.map((column) => {
                        const stickyStyle = getColumnStickyStyle(
                          column,
                          orderedColumns,
                        );

                        return (
                          <td
                            key={`${row.id}-${column.id}`}
                            style={{
                              width: column.width,
                              minWidth: column.width,
                              maxWidth: column.width,
                              ...stickyStyle,
                            }}
                            onDoubleClick={() =>
                              column.editable &&
                              setEditingCell({
                                rowId: row.id,
                                columnId: column.id,
                              })
                            }
                            className={cn(
                              "border-b border-slate-100 bg-inherit px-3",
                              column.align === "center" && "text-center",
                              column.align === "end" && "text-left",
                            )}
                          >
                            <div
                              className="truncate"
                              title={String(row[column.id] ?? "")}
                            >
                              {renderCell(row, column)}
                            </div>
                          </td>
                        );
                      })}

                      <td className="sticky left-0 z-10 border-b border-slate-100 bg-inherit px-3 text-left">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => alert(`مشاهده ${row.name}`)}
                            className="rounded-lg border px-2 py-1 text-xs hover:bg-white"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setRows((prev) =>
                                prev.filter((item) => item.id !== row.id),
                              );
                              setSelectedIds((prev) =>
                                prev.filter((id) => id !== row.id),
                              );
                            }}
                            className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expanded ? (
                      <tr key={`${row.id}-expanded`}>
                        <td
                          colSpan={orderedColumns.length + 3}
                          className="border-b border-slate-100 bg-slate-50 p-4"
                        >
                          <div className="grid gap-4 md:grid-cols-4">
                            <div>
                              <div className="text-xs text-slate-400">
                                شماره تماس
                              </div>
                              <div className="font-bold">{row.phone}</div>
                            </div>

                            <div>
                              <div className="text-xs text-slate-400">نقش</div>
                              <div className="font-bold">{row.role}</div>
                            </div>

                            <div>
                              <div className="text-xs text-slate-400">شهر</div>
                              <div className="font-bold">{row.city}</div>
                            </div>

                            <div>
                              <div className="text-xs text-slate-400">
                                امتیاز
                              </div>
                              <div className="font-bold">{row.score}</div>
                            </div>

                            <div className="md:col-span-4">
                              <div className="text-xs text-slate-400">
                                توضیحات
                              </div>
                              <div className="mt-1 rounded-2xl bg-white p-3 leading-7">
                                {row.description}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="text-slate-500">
            صفحه {(pageIndex + 1).toLocaleString("fa-IR")} از{" "}
            {pageCount.toLocaleString("fa-IR")} —{" "}
            {sortedRows.length.toLocaleString("fa-IR")} نتیجه
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(0)}
              className="rounded-xl border px-3 py-2 disabled:opacity-40"
            >
              اول
            </button>

            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
              className="rounded-xl border px-3 py-2 disabled:opacity-40"
            >
              قبلی
            </button>

            <button
              disabled={pageIndex >= pageCount - 1}
              onClick={() =>
                setPageIndex((prev) => Math.min(pageCount - 1, prev + 1))
              }
              className="rounded-xl border px-3 py-2 disabled:opacity-40"
            >
              بعدی
            </button>

            <button
              disabled={pageIndex >= pageCount - 1}
              onClick={() => setPageIndex(pageCount - 1)}
              className="rounded-xl border px-3 py-2 disabled:opacity-40"
            >
              آخر
            </button>
          </div>
        </div>
      </div>

      {contextMenu ? (
        <div
          className="fixed z-[10000] w-56 rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-xl"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={() => {
              pinColumn(contextMenu.columnId, "right");
              setContextMenu(null);
            }}
            className="block w-full rounded-xl px-3 py-2 text-right hover:bg-slate-50"
          >
            Pin راست
          </button>

          <button
            onClick={() => {
              pinColumn(contextMenu.columnId, "left");
              setContextMenu(null);
            }}
            className="block w-full rounded-xl px-3 py-2 text-right hover:bg-slate-50"
          >
            Pin چپ
          </button>

          <button
            onClick={() => {
              pinColumn(contextMenu.columnId, null);
              setContextMenu(null);
            }}
            className="block w-full rounded-xl px-3 py-2 text-right hover:bg-slate-50"
          >
            حذف Pin
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={() => {
              toggleColumnVisibility(contextMenu.columnId);
              setContextMenu(null);
            }}
            className="block w-full rounded-xl px-3 py-2 text-right text-rose-600 hover:bg-rose-50"
          >
            مخفی کردن ستون
          </button>
        </div>
      ) : null}
    </div>
  );
}
