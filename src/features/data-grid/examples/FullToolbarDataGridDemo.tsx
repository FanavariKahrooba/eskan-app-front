"use client";
import { useState } from "react";
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
  DataGridBody,
  DataGridRow,
  DataGridCell,
} from "@/features/data-grid";
import type { DataGridDensity } from "@/features/data-grid";

const rows = [
  { id: 1, name: "علی رضایی", email: "ali@example.com", role: "مدیر" },
  { id: 2, name: "مریم احمدی", email: "maryam@example.com", role: "کاربر" },
  { id: 3, name: "رضا کریمی", email: "reza@example.com", role: "اپراتور" },
];

export function FullToolbarDataGridDemo() {
  const [search, setSearch] = useState("");
  const [density, setDensity] = useState<DataGridDensity>("comfortable");
  const [loading, setLoading] = useState(false);

  const filteredRows = rows.filter((row) =>
    `${row.name} ${row.email} ${row.role}`.includes(search),
  );

  return (
    <DataGrid title="جدول با Toolbar کامل">
      <DataGridToolbar
        title="مدیریت کاربران"
        subtitle="جستجو، خروجی، تغییر تراکم، نماها و ستون‌ها"
        actions={
          <DataGridToolbarActions
            actions={[
              {
                id: "create",
                label: "کاربر جدید",
                variant: "primary",
                onClick: () => alert("ایجاد کاربر"),
              },
            ]}
          >
            <DataGridSearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="جستجو در کاربران..."
            />

            <DataGridDensityToggle value={density} onChange={setDensity} />

            <DataGridViewOptions
              columns={[
                { id: "name", label: "نام", visible: true },
                { id: "email", label: "ایمیل", visible: true },
                { id: "role", label: "نقش", visible: true },
              ]}
              onReset={() => alert("بازنشانی ستون‌ها")}
            />

            <DataGridSavedViewsMenu
              views={[
                { id: "default", name: "نمای پیش‌فرض", active: true },
                { id: "compact", name: "نمای فشرده" },
              ]}
              activeViewId="default"
              onSelectView={(id) => alert(`انتخاب نما: ${id}`)}
              onSaveCurrentView={() => alert("ذخیره نمای فعلی")}
              onResetView={() => alert("بازنشانی نما")}
            />

            <DataGridExportMenu
              onExportCsv={() => alert("خروجی CSV")}
              onExportExcel={() => alert("خروجی Excel")}
              onExportJson={() => alert("خروجی JSON")}
              onPrint={() => window.print()}
            />

            <DataGridResetButton
              confirm
              onReset={() => {
                setSearch("");
                setDensity("comfortable");
              }}
            />

            <DataGridRefreshButton
              loading={loading}
              onRefresh={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 800);
              }}
            />
          </DataGridToolbarActions>
        }
      />

      <DataGridTable>
        <DataGridHeader>
          <DataGridHeaderRow>
            <DataGridHeaderCell label="نام" sortable sortDirection="asc" />
            <DataGridHeaderCell label="ایمیل" />
            <DataGridHeaderCell label="نقش" />
          </DataGridHeaderRow>
        </DataGridHeader>

        <DataGridBody>
          {filteredRows.map((row, index) => (
            <DataGridRow key={row.id} index={index}>
              <DataGridCell>{row.name}</DataGridCell>
              <DataGridCell>{row.email}</DataGridCell>
              <DataGridCell>{row.role}</DataGridCell>
            </DataGridRow>
          ))}
        </DataGridBody>
      </DataGridTable>
    </DataGrid>
  );
}
