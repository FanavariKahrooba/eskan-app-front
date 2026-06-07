"use client";

import { useMemo, useState } from "react";
import {
  DataGrid,
  DataGridToolbar,
  DataGridTable,
  DataGridHeader,
  DataGridHeaderRow,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridFooter,
  DataGridStatus,
  RowSelectionCheckbox,
  RowActionsCell,
  DataGridSearchInput,
  DataGridRefreshButton,
  DataGridExportMenu,
  DataGridSavedViewsMenu,
  ColumnSortIndicator,
  DataGridHeaderCell,
} from "../ui";
import type { DataGridMenuItem } from "../ui";

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  status: "active" | "inactive";
}

const DATA: User[] = [
  {
    id: 1,
    name: "علی رضایی",
    email: "ali@test.com",
    department: "فنی",
    status: "active",
  },
  {
    id: 2,
    name: "مینا شریفی",
    email: "mina@test.com",
    department: "مالی",
    status: "inactive",
  },
  {
    id: 3,
    name: "حسام جعفری",
    email: "hesam@test.com",
    department: "منابع انسانی",
    status: "active",
  },
  {
    id: 4,
    name: "سارا یوسفی",
    email: "sara@test.com",
    department: "پشتیبانی",
    status: "active",
  },
];

type SortKey = "name" | "email" | "department" | "status";

export function UsersGridAdminDemo() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sort, setSort] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const rows = useMemo(() => {
    let data = [...DATA];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((row) =>
        [row.name, row.email, row.department, row.status]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    if (sort) {
      data.sort((a, b) => {
        const aValue = String(a[sort.key]);
        const bValue = String(b[sort.key]);
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue, "fa")
          : bValue.localeCompare(aValue, "fa");
      });
    }

    return data;
  }, [search, sort]);

  const allSelected =
    rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));
  const someSelected =
    rows.some((row) => selectedIds.includes(row.id)) && !allSelected;

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  function rowActions(row: User): DataGridMenuItem[] {
    return [
      { id: `view-${row.id}`, label: "مشاهده", onClick: () => alert(row.name) },
      {
        id: `edit-${row.id}`,
        label: "ویرایش",
        onClick: () => alert(`ویرایش ${row.name}`),
      },
      {
        id: `delete-${row.id}`,
        label: "حذف",
        danger: true,
        onClick: () => alert(`حذف ${row.name}`),
      },
    ];
  }

  return (
    <DataGrid>
      <DataGridToolbar
        title="کاربران پنل ادمین"
        subtitle="نسخه کاربردی‌تر برای استفاده واقعی"
        actions={
          <div className="flex flex-wrap gap-2">
            <DataGridSearchInput value={search} onChange={setSearch} />
            <DataGridSavedViewsMenu
              views={[
                { id: "default", name: "پیش‌فرض" },
                { id: "active-only", name: "کاربران فعال" },
              ]}
              onSelectView={(id) => alert(`select view: ${id}`)}
            />
            <DataGridExportMenu
              items={[
                { id: "csv", label: "CSV", onClick: () => alert("csv") },
                { id: "excel", label: "Excel", onClick: () => alert("excel") },
              ]}
            />
            <DataGridRefreshButton
              loading={loading}
              onRefresh={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
            />
          </div>
        }
      />

      <DataGridTable>
        <DataGridHeader>
          <DataGridHeaderRow>
            <DataGridHeaderCell className="w-14">
              <div className="flex justify-center">
                <RowSelectionCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(checked) => {
                    setSelectedIds(checked ? rows.map((row) => row.id) : []);
                  }}
                />
              </div>
            </DataGridHeaderCell>

            <DataGridHeaderCell>
              <button
                className="group inline-flex items-center gap-2"
                onClick={() => toggleSort("name")}
              >
                نام
                <ColumnSortIndicator
                  direction={sort?.key === "name" ? sort.direction : false}
                />
              </button>
            </DataGridHeaderCell>

            <DataGridHeaderCell>
              <button
                className="group inline-flex items-center gap-2"
                onClick={() => toggleSort("email")}
              >
                ایمیل
                <ColumnSortIndicator
                  direction={sort?.key === "email" ? sort.direction : false}
                />
              </button>
            </DataGridHeaderCell>

            <DataGridHeaderCell>
              <button
                className="group inline-flex items-center gap-2"
                onClick={() => toggleSort("department")}
              >
                دپارتمان
                <ColumnSortIndicator
                  direction={
                    sort?.key === "department" ? sort.direction : false
                  }
                />
              </button>
            </DataGridHeaderCell>

            <DataGridHeaderCell>
              <button
                className="group inline-flex items-center gap-2"
                onClick={() => toggleSort("status")}
              >
                وضعیت
                <ColumnSortIndicator
                  direction={sort?.key === "status" ? sort.direction : false}
                />
              </button>
            </DataGridHeaderCell>

            <DataGridHeaderCell className="w-28 text-center">
              عملیات
            </DataGridHeaderCell>
          </DataGridHeaderRow>
        </DataGridHeader>

        <DataGridBody>
          {loading ? (
            <tr>
              <td colSpan={6}>
                <DataGridStatus loading />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <DataGridStatus empty />
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const selected = selectedIds.includes(row.id);

              return (
                <DataGridRow key={row.id} selected={selected}>
                  <DataGridCell>
                    <div className="flex justify-center">
                      <RowSelectionCheckbox
                        checked={selected}
                        onChange={() => {
                          setSelectedIds((prev) =>
                            prev.includes(row.id)
                              ? prev.filter((id) => id !== row.id)
                              : [...prev, row.id],
                          );
                        }}
                      />
                    </div>
                  </DataGridCell>

                  <DataGridCell>{row.name}</DataGridCell>
                  <DataGridCell>{row.email}</DataGridCell>
                  <DataGridCell>{row.department}</DataGridCell>
                  <DataGridCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                        row.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {row.status === "active" ? "فعال" : "غیرفعال"}
                    </span>
                  </DataGridCell>

                  <RowActionsCell actions={rowActions(row)} />
                </DataGridRow>
              );
            })
          )}
        </DataGridBody>
      </DataGridTable>

      <DataGridFooter total={rows.length} page={1} pageSize={10} />
    </DataGrid>
  );
}
