/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  DataGridToolbar,
  DataGridTable,
  DataGridFooter,
  DataGridHeader,
  DataGridHeaderRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridStatus,
  RowSelectionCheckbox,
  RowExpansionToggle,
  RowDetailPanel,
  RowActionsCell,
  ColumnSortIndicator,
  ColumnActionsMenu,
  ColumnVisibilityMenu,
  ColumnFilterPopover,
  ColumnPinningMenu,
  DataGridSearchInput,
  DataGridExportMenu,
  DataGridRefreshButton,
  DataGridResetButton,
  DataGridSavedViewsMenu,
  DataGridToolbarActions,
  DataGridButton,
  DataGridIcon,
} from "../ui";
import type { DataGridMenuItem } from "../ui";
import { DataGridDensityToggle } from "../ui/toolbar/data-grid-density-toggle";

type UserStatus = "active" | "inactive" | "pending" | "banned";
type UserRole = "admin" | "editor" | "support" | "viewer";

interface UserRecord {
  id: number;
  name: string;
  email: string;
  age: number;
  role: UserRole;
  status: UserStatus;
  city: string;
  salary: number;
  createdAt: string;
  score: number;
  bio: string;
}

type SortKey = keyof Pick<
  UserRecord,
  | "name"
  | "email"
  | "age"
  | "role"
  | "status"
  | "city"
  | "salary"
  | "createdAt"
  | "score"
>;

type SortState = {
  key: SortKey;
  direction: "asc" | "desc";
} | null;

type Density = "compact" | "comfortable" | "spacious";

type ColumnId =
  | "selection"
  | "expand"
  | "name"
  | "email"
  | "age"
  | "role"
  | "status"
  | "city"
  | "salary"
  | "score"
  | "createdAt"
  | "actions";

const ALL_COLUMNS: Array<{ id: ColumnId; label: string; hideable?: boolean }> =
  [
    { id: "selection", label: "انتخاب", hideable: false },
    { id: "expand", label: "جزئیات", hideable: false },
    { id: "name", label: "نام" },
    { id: "email", label: "ایمیل" },
    { id: "age", label: "سن" },
    { id: "role", label: "نقش" },
    { id: "status", label: "وضعیت" },
    { id: "city", label: "شهر" },
    { id: "salary", label: "حقوق" },
    { id: "score", label: "امتیاز" },
    { id: "createdAt", label: "تاریخ عضویت" },
    { id: "actions", label: "عملیات", hideable: false },
  ];

const INITIAL_USERS: UserRecord[] = [
  {
    id: 1,
    name: "علی رضایی",
    email: "ali@example.com",
    age: 29,
    role: "admin",
    status: "active",
    city: "تهران",
    salary: 42000000,
    createdAt: "2025-01-10",
    score: 96,
    bio: "مدیر سیستم با تجربه بالا در مدیریت تیم و عملیات.",
  },
  {
    id: 2,
    name: "نگار محمدی",
    email: "negar@example.com",
    age: 32,
    role: "editor",
    status: "pending",
    city: "اصفهان",
    salary: 28000000,
    createdAt: "2025-02-18",
    score: 88,
    bio: "کارشناس محتوا و تدوینگر ارشد.",
  },
  {
    id: 3,
    name: "سینا کاظمی",
    email: "sina@example.com",
    age: 25,
    role: "viewer",
    status: "inactive",
    city: "شیراز",
    salary: 19000000,
    createdAt: "2024-12-02",
    score: 73,
    bio: "کاربر مشاهده‌گر با دسترسی محدود.",
  },
  {
    id: 4,
    name: "مریم رحیمی",
    email: "maryam@example.com",
    age: 27,
    role: "support",
    status: "active",
    city: "تبریز",
    salary: 23000000,
    createdAt: "2025-03-21",
    score: 91,
    bio: "کارشناس پشتیبانی مشتریان با دقت بالا.",
  },
  {
    id: 5,
    name: "پارسا امینی",
    email: "parsa@example.com",
    age: 35,
    role: "editor",
    status: "banned",
    city: "مشهد",
    salary: 25000000,
    createdAt: "2024-10-14",
    score: 40,
    bio: "حساب کاربری مسدود شده به علت نقض قوانین.",
  },
  {
    id: 6,
    name: "الهام موسوی",
    email: "elham@example.com",
    age: 30,
    role: "support",
    status: "active",
    city: "رشت",
    salary: 24000000,
    createdAt: "2025-04-03",
    score: 85,
    bio: "پاسخ‌گو و پیگیر تیکت‌های حساس.",
  },
  {
    id: 7,
    name: "رضا کریمی",
    email: "reza@example.com",
    age: 31,
    role: "viewer",
    status: "pending",
    city: "کرج",
    salary: 17000000,
    createdAt: "2025-01-28",
    score: 68,
    bio: "در انتظار تکمیل فرآیند تایید حساب.",
  },
  {
    id: 8,
    name: "یگانه نوروزی",
    email: "yeganeh@example.com",
    age: 26,
    role: "admin",
    status: "active",
    city: "قم",
    salary: 39000000,
    createdAt: "2024-11-07",
    score: 94,
    bio: "ناظر ارشد با سطح دسترسی کامل.",
  },
  {
    id: 9,
    name: "امیرحسین مرادی",
    email: "amir@example.com",
    age: 24,
    role: "viewer",
    status: "inactive",
    city: "اهواز",
    salary: 16000000,
    createdAt: "2025-02-01",
    score: 59,
    bio: "کاربر غیرفعال شده به درخواست خود.",
  },
  {
    id: 10,
    name: "سحر عباسی",
    email: "sahar@example.com",
    age: 28,
    role: "editor",
    status: "active",
    city: "یزد",
    salary: 29500000,
    createdAt: "2025-03-11",
    score: 89,
    bio: "مسئول بازبینی و انتشار محتوای آموزشی.",
  },
];

const statusColorMap: Record<UserStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  banned: "bg-rose-50 text-rose-700 ring-rose-200",
};

const roleLabelMap: Record<UserRole, string> = {
  admin: "ادمین",
  editor: "ویرایشگر",
  support: "پشتیبانی",
  viewer: "مشاهده‌گر",
};

const statusLabelMap: Record<UserStatus, string> = {
  active: "فعال",
  inactive: "غیرفعال",
  pending: "در انتظار",
  banned: "مسدود",
};

function formatMoney(value: number) {
  return `${value.toLocaleString("fa-IR")} تومان`;
}

function sortData(data: UserRecord[], sort: SortState) {
  if (!sort) return data;

  const sorted = [...data].sort((a, b) => {
    const aValue = a[sort.key];
    const bValue = b[sort.key];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return sort.direction === "asc"
      ? String(aValue).localeCompare(String(bValue), "fa")
      : String(bValue).localeCompare(String(aValue), "fa");
  });

  return sorted;
}

export function UsersGridUltimateDemo() {
  const [rows, setRows] = useState<UserRecord[]>(INITIAL_USERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({
    key: "name",
    direction: "asc",
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [density, setDensity] = useState<Density>("comfortable");

  const [hiddenColumns, setHiddenColumns] = useState<ColumnId[]>([]);
  const [filterOpenFor, setFilterOpenFor] = useState<ColumnId | null>(null);
  const [activeFilter, setActiveFilter] = useState<{
    column: ColumnId;
    value: string;
  } | null>(null);

  const [pinnedColumns, setPinnedColumns] = useState<
    Record<string, "left" | "right" | false>
  >({
    selection: "left",
    expand: "left",
    actions: "right",
  });

  const visibleColumns = useMemo(
    () => ALL_COLUMNS.filter((column) => !hiddenColumns.includes(column.id)),
    [hiddenColumns],
  );

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter((row) =>
        [
          row.name,
          row.email,
          row.city,
          row.role,
          row.status,
          row.createdAt,
          row.age.toString(),
          row.salary.toString(),
          row.score.toString(),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    if (activeFilter?.column && activeFilter.value.trim()) {
      const value = activeFilter.value.trim().toLowerCase();
      data = data.filter((row) => {
        const raw = row[activeFilter.column as keyof UserRecord];
        return String(raw ?? "")
          .toLowerCase()
          .includes(value);
      });
    }

    data = sortData(data, sort);

    return data;
  }, [rows, search, activeFilter, sort]);

  const paginatedRows = useMemo(() => filteredRows.slice(0, 8), [filteredRows]);

  const allVisibleSelected =
    paginatedRows.length > 0 &&
    paginatedRows.every((row) => selectedIds.includes(row.id));

  const someVisibleSelected =
    paginatedRows.some((row) => selectedIds.includes(row.id)) &&
    !allVisibleSelected;

  const rowPaddingClass =
    density === "compact" ? "py-2" : density === "spacious" ? "py-5" : "py-3";

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => rows.some((row) => row.id === id)),
    );
  }, [rows]);

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  function handleRefresh() {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setRows((prev) => [...prev]);
    }, 1200);
  }

  function handleFakeError() {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setError("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
    }, 1000);
  }

  function handleResetAll() {
    setSearch("");
    setSort({ key: "name", direction: "asc" });
    setSelectedIds([]);
    setExpandedIds([]);
    setDensity("comfortable");
    setHiddenColumns([]);
    setActiveFilter(null);
    setFilterOpenFor(null);
    setPinnedColumns({
      selection: "left",
      expand: "left",
      actions: "right",
    });
    setError(null);
    setRows(INITIAL_USERS);
  }

  function toggleSelectRow(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function toggleExpandRow(id: number) {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function toggleSelectAllVisible(checked: boolean) {
    const visibleIds = paginatedRows.map((row) => row.id);

    if (checked) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
      return;
    }

    setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
  }

  function getRowActions(row: UserRecord): DataGridMenuItem[] {
    return [
      {
        id: `view-${row.id}`,
        label: "مشاهده",
        icon: <DataGridIcon name="eye" size={16} />,
        onClick: () => alert(`مشاهده کاربر: ${row.name}`),
      },
      // {
      //   id: `edit-${row.id}`,
      //   label: "ویرایش",
      //   icon: <DataGridIcon name="edit" size={16} />,
      //   onClick: () => alert(`ویرایش کاربر: ${row.name}`),
      // },
      {
        id: `mail-${row.id}`,
        label: "ارسال ایمیل",
        icon: <DataGridIcon name="search" size={16} />,
        onClick: () => alert(`ارسال ایمیل به: ${row.email}`),
      },
      {
        id: `delete-${row.id}`,
        label: "حذف",
        icon: <DataGridIcon name="x" size={16} />,
        danger: true,
        onClick: () => {
          const ok = window.confirm(`آیا از حذف "${row.name}" مطمئن هستید؟`);
          if (!ok) return;
          setRows((prev) => prev.filter((item) => item.id !== row.id));
          setSelectedIds((prev) => prev.filter((id) => id !== row.id));
          setExpandedIds((prev) => prev.filter((id) => id !== row.id));
        },
      },
    ];
  }

  return (
    <div className="space-y-6">
      <DataGrid>
        <DataGridToolbar
          title="لیست کاربران - نسخه Ultimate"
          subtitle="نمایش همه قابلیت‌های ساخته‌شده برای تست رابط کاربری"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <DataGridSearchInput
                value={search}
                onChange={setSearch}
                onSubmit={setSearch}
                onClear={() => setSearch("")}
                placeholder="جستجو در کاربران..."
              />

              <ColumnVisibilityMenu
                columns={ALL_COLUMNS.filter((c) => c.hideable !== false).map(
                  (column) => ({
                    id: column.id,
                    label: column.label,
                    visible: !hiddenColumns.includes(column.id),
                  }),
                )}
                onToggleColumn={(id, visible) => {
                  setHiddenColumns((prev) =>
                    visible
                      ? prev.filter((item) => item !== id)
                      : [...prev, id as ColumnId],
                  );
                }}
                onShowAll={() => setHiddenColumns([])}
                onHideAll={() =>
                  setHiddenColumns(
                    ALL_COLUMNS.filter((item) => item.hideable !== false).map(
                      (item) => item.id,
                    ),
                  )
                }
                onReset={() => setHiddenColumns([])}
              />

              <DataGridDensityToggle value={density} onChange={setDensity} />

              <DataGridSavedViewsMenu
                activeViewId="default"
                views={[
                  {
                    id: "default",
                    name: "نمای پیش‌فرض",
                    description: "چیدمان کامل جدول",
                  },
                  {
                    id: "compact",
                    name: "نمای فشرده",
                    description: "برای داده‌های زیاد",
                  },
                  {
                    id: "finance",
                    name: "نمای مالی",
                    description: "تمرکز روی حقوق و امتیاز",
                  },
                ]}
                onSelectView={(viewId) => {
                  if (viewId === "default") {
                    setDensity("comfortable");
                    setHiddenColumns([]);
                  }
                  if (viewId === "compact") {
                    setDensity("compact");
                    setHiddenColumns(
                      ["bio" as never].filter(Boolean) as ColumnId[],
                    );
                  }
                  if (viewId === "finance") {
                    setHiddenColumns(["email", "city", "role"]);
                  }
                }}
                onSaveCurrentView={() => alert("نمای فعلی ذخیره شد")}
                onRenameView={(id) => alert(`تغییر نام view: ${id}`)}
                onDeleteView={(id) => alert(`حذف view: ${id}`)}
                onResetView={handleResetAll}
              />

              {/* <DataGridExportMenu
                items={[
                  {
                    id: "csv",
                    label: "خروجی CSV",
                    onClick: () => alert("Export CSV"),
                  },
                  {
                    id: "excel",
                    label: "خروجی Excel",
                    onClick: () => alert("Export Excel"),
                  },
                  {
                    id: "pdf",
                    label: "خروجی PDF",
                    onClick: () => alert("Export PDF"),
                  },
                ]}
              /> */}

              <DataGridRefreshButton
                onRefresh={handleRefresh}
                loading={loading}
              />

              <DataGridResetButton confirm onReset={handleResetAll} />

              <DataGridButton variant="secondary" onClick={handleFakeError}>
                تست خطا
              </DataGridButton>

              <DataGridButton
                variant="ghost"
                onClick={() => {
                  setRows([]);
                  setError(null);
                }}
              >
                تست Empty
              </DataGridButton>
            </div>
          }
        />

        <div className="px-4 pb-3">
          <DataGridToolbarActions
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            actions={[
              {
                id: "bulk-activate",
                label: "فعال‌سازی",
                variant: "primary",
                onClick: () => alert(`فعال‌سازی ${selectedIds.length} کاربر`),
              },
              {
                id: "bulk-export",
                label: "خروجی منتخب‌ها",
                variant: "default",
                onClick: () => alert(`خروجی از ${selectedIds.length} ردیف`),
              },
              {
                id: "bulk-delete",
                label: "حذف منتخب‌ها",
                variant: "danger",
                onClick: () => {
                  const ok = window.confirm(
                    "آیا از حذف ردیف‌های انتخاب‌شده مطمئن هستید؟",
                  );
                  if (!ok) return;
                  setRows((prev) =>
                    prev.filter((row) => !selectedIds.includes(row.id)),
                  );
                  setSelectedIds([]);
                },
              },
            ]}
          />
        </div>

        <DataGridTable>
          <DataGridHeader>
            <DataGridHeaderRow>
              {!hiddenColumns.includes("selection") && (
                <DataGridHeaderCell className="w-14">
                  <div className="flex items-center justify-center">
                    <RowSelectionCheckbox
                      checked={allVisibleSelected}
                      indeterminate={someVisibleSelected}
                      onChange={toggleSelectAllVisible}
                    />
                  </div>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("expand") && (
                <DataGridHeaderCell className="w-14 text-center">
                  جزئیات
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("name") && (
                <DataGridHeaderCell>
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="group inline-flex items-center gap-2 font-bold"
                  >
                    نام
                    <ColumnSortIndicator
                      direction={sort?.key === "name" ? sort.direction : false}
                    />
                  </button>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("email") && (
                <DataGridHeaderCell>
                  <button
                    type="button"
                    onClick={() => toggleSort("email")}
                    className="group inline-flex items-center gap-2 font-bold"
                  >
                    ایمیل
                    <ColumnSortIndicator
                      direction={sort?.key === "email" ? sort.direction : false}
                    />
                  </button>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("age") && (
                <DataGridHeaderCell>
                  <button
                    type="button"
                    onClick={() => toggleSort("age")}
                    className="group inline-flex items-center gap-2 font-bold"
                  >
                    سن
                    <ColumnSortIndicator
                      direction={sort?.key === "age" ? sort.direction : false}
                    />
                  </button>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("role") && (
                <DataGridHeaderCell>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSort("role")}
                      className="group inline-flex items-center gap-2 font-bold"
                    >
                      نقش
                      <ColumnSortIndicator
                        direction={
                          sort?.key === "role" ? sort.direction : false
                        }
                      />
                    </button>

                    <div className="relative">
                      <ColumnActionsMenu
                        sortable
                        filterable
                        pinnable
                        hideable
                        onSortAsc={() =>
                          setSort({ key: "role", direction: "asc" })
                        }
                        onSortDesc={() =>
                          setSort({ key: "role", direction: "desc" })
                        }
                        onClearSort={() => setSort(null)}
                        onOpenFilter={() => setFilterOpenFor("role")}
                        onPinLeft={() =>
                          setPinnedColumns((prev) => ({
                            ...prev,
                            role: "left",
                          }))
                        }
                        onPinRight={() =>
                          setPinnedColumns((prev) => ({
                            ...prev,
                            role: "right",
                          }))
                        }
                        onUnpin={() =>
                          setPinnedColumns((prev) => ({ ...prev, role: false }))
                        }
                        onHide={() =>
                          setHiddenColumns((prev) => [...prev, "role"])
                        }
                      />

                      <ColumnFilterPopover
                        open={filterOpenFor === "role"}
                        title="فیلتر نقش"
                        onOpenChange={(open) =>
                          setFilterOpenFor(open ? "role" : null)
                        }
                        onApply={(filter) => {
                          setActiveFilter({
                            column: "role",
                            value: filter.value,
                          });
                        }}
                        onClear={() => setActiveFilter(null)}
                      />
                    </div>

                    <ColumnPinningMenu
                      pinned={pinnedColumns.role}
                      onPinLeft={() =>
                        setPinnedColumns((prev) => ({ ...prev, role: "left" }))
                      }
                      onPinRight={() =>
                        setPinnedColumns((prev) => ({ ...prev, role: "right" }))
                      }
                      onUnpin={() =>
                        setPinnedColumns((prev) => ({ ...prev, role: false }))
                      }
                    />
                  </div>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("status") && (
                <DataGridHeaderCell>
                  <button
                    type="button"
                    onClick={() => toggleSort("status")}
                    className="group inline-flex items-center gap-2 font-bold"
                  >
                    وضعیت
                    <ColumnSortIndicator
                      direction={
                        sort?.key === "status" ? sort.direction : false
                      }
                    />
                  </button>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("city") && (
                <DataGridHeaderCell>
                  <button
                    type="button"
                    onClick={() => toggleSort("city")}
                    className="group inline-flex items-center gap-2 font-bold"
                  >
                    شهر
                    <ColumnSortIndicator
                      direction={sort?.key === "city" ? sort.direction : false}
                    />
                  </button>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("salary") && (
                <DataGridHeaderCell>
                  <button
                    type="button"
                    onClick={() => toggleSort("salary")}
                    className="group inline-flex items-center gap-2 font-bold"
                  >
                    حقوق
                    <ColumnSortIndicator
                      direction={
                        sort?.key === "salary" ? sort.direction : false
                      }
                    />
                  </button>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("score") && (
                <DataGridHeaderCell>
                  <button
                    type="button"
                    onClick={() => toggleSort("score")}
                    className="group inline-flex items-center gap-2 font-bold"
                  >
                    امتیاز
                    <ColumnSortIndicator
                      direction={sort?.key === "score" ? sort.direction : false}
                    />
                  </button>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("createdAt") && (
                <DataGridHeaderCell>
                  <button
                    type="button"
                    onClick={() => toggleSort("createdAt")}
                    className="group inline-flex items-center gap-2 font-bold"
                  >
                    تاریخ عضویت
                    <ColumnSortIndicator
                      direction={
                        sort?.key === "createdAt" ? sort.direction : false
                      }
                    />
                  </button>
                </DataGridHeaderCell>
              )}

              {!hiddenColumns.includes("actions") && (
                <DataGridHeaderCell className="w-[120px] text-center">
                  عملیات
                </DataGridHeaderCell>
              )}
            </DataGridHeaderRow>
          </DataGridHeader>

          <DataGridBody>
            {loading || error || paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length}>
                  {/* <DataGridStatus
                    loading={loading}
                    error={error}
                    empty={!loading && !error && paginatedRows.length === 0}
                    onRetry={handleRefresh}
                    loadingTitle="در حال دریافت داده‌ها..."
                    emptyTitle="هیچ کاربری پیدا نشد"
                    emptyDescription="فیلترها را تغییر بده یا داده جدید اضافه کن."
                    errorTitle="خطا در بارگذاری کاربران"
                    errorDescription={error ?? ""}
                  /> */}
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => {
                const expanded = expandedIds.includes(row.id);
                const selected = selectedIds.includes(row.id);

                return (
                  <Fragment key={row.id}>
                    <DataGridRow
                      key={row.id}
                      selected={selected}
                      onClick={() => toggleSelectRow(row.id)}
                    >
                      {!hiddenColumns.includes("selection") && (
                        <DataGridCell
                          className={`text-center ${rowPaddingClass}`}
                        >
                          <div className="flex items-center justify-center">
                            <RowSelectionCheckbox
                              checked={selected}
                              onChange={() => toggleSelectRow(row.id)}
                            />
                          </div>
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("expand") && (
                        <DataGridCell
                          className={`text-center ${rowPaddingClass}`}
                        >
                          <div className="flex items-center justify-center">
                            <RowExpansionToggle
                              expanded={expanded}
                              onToggle={() => toggleExpandRow(row.id)}
                            />
                          </div>
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("name") && (
                        <DataGridCell className={rowPaddingClass}>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-black text-slate-800">
                              {row.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              #{row.id}
                            </span>
                          </div>
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("email") && (
                        <DataGridCell className={rowPaddingClass}>
                          <span className="text-slate-600">{row.email}</span>
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("age") && (
                        <DataGridCell className={rowPaddingClass}>
                          {row.age.toLocaleString("fa-IR")}
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("role") && (
                        <DataGridCell className={rowPaddingClass}>
                          <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 ring-1 ring-violet-200">
                            {roleLabelMap[row.role]}
                          </span>
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("status") && (
                        <DataGridCell className={rowPaddingClass}>
                          <span
                            className={[
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1",
                              statusColorMap[row.status],
                            ].join(" ")}
                          >
                            {statusLabelMap[row.status]}
                          </span>
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("city") && (
                        <DataGridCell className={rowPaddingClass}>
                          {row.city}
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("salary") && (
                        <DataGridCell className={rowPaddingClass}>
                          <span className="font-bold text-slate-800">
                            {formatMoney(row.salary)}
                          </span>
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("score") && (
                        <DataGridCell className={rowPaddingClass}>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-indigo-600"
                                style={{ width: `${row.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-600">
                              {row.score.toLocaleString("fa-IR")}
                            </span>
                          </div>
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("createdAt") && (
                        <DataGridCell className={rowPaddingClass}>
                          {new Date(row.createdAt).toLocaleDateString("fa-IR")}
                        </DataGridCell>
                      )}

                      {!hiddenColumns.includes("actions") && (
                        <RowActionsCell
                          pinned="right"
                          actions={getRowActions(row)}
                          className={rowPaddingClass}
                        />
                      )}
                    </DataGridRow>

                    {expanded ? (
                      <RowDetailPanel
                        key={`detail-${row.id}`}
                        open={expanded}
                        colSpan={visibleColumns.length}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="mb-2 text-xs font-bold text-slate-500">
                              اطلاعات پایه
                            </div>
                            <div className="space-y-1 text-sm text-slate-700">
                              <div>نام: {row.name}</div>
                              <div>ایمیل: {row.email}</div>
                              <div>سن: {row.age.toLocaleString("fa-IR")}</div>
                            </div>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="mb-2 text-xs font-bold text-slate-500">
                              وضعیت شغلی
                            </div>
                            <div className="space-y-1 text-sm text-slate-700">
                              <div>نقش: {roleLabelMap[row.role]}</div>
                              <div>وضعیت: {statusLabelMap[row.status]}</div>
                              <div>حقوق: {formatMoney(row.salary)}</div>
                            </div>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="mb-2 text-xs font-bold text-slate-500">
                              توضیحات
                            </div>
                            <div className="text-sm leading-7 text-slate-700">
                              {row.bio}
                            </div>
                          </div>
                        </div>
                      </RowDetailPanel>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </DataGridBody>
        </DataGridTable>

        {/* <DataGridFooter
          total={filteredRows.length}
          page={1}
          pageSize={8}
          onPageChange={(page) => alert(`go to page: ${page}`)}
          onPageSizeChange={(size) => alert(`page size: ${size}`)}
        /> */}
      </DataGrid>
    </div>
  );
}
