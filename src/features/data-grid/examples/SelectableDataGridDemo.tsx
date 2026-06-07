"use client"
import { useMemo, useState } from "react";
import {
  DataGrid,
  DataGridToolbar,
  DataGridBulkActions,
  DataGridTable,
  DataGridHeader,
  DataGridHeaderRow,
  DataGridHeaderCell,
  DataGridSelectHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridSelectCell,
  DataGridFooter,
} from "@/features/data-grid";

const rows = [
  { id: 1, name: "علی رضایی", email: "ali@example.com" },
  { id: 2, name: "مریم احمدی", email: "maryam@example.com" },
  { id: 3, name: "رضا کریمی", email: "reza@example.com" },
];

export function SelectableDataGridDemo() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allSelected = selectedIds.length === rows.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const selectedCount = selectedIds.length;

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  return (
    <DataGrid title="جدول انتخابی">
      <DataGridToolbar
        title="انتخاب کاربران"
        subtitle="امکان انتخاب ردیف و اجرای عملیات گروهی"
        actions={
          <DataGridBulkActions
            selectedCount={selectedCount}
            onClearSelection={() => setSelectedIds([])}
            actions={[
              {
                id: "delete",
                label: "حذف انتخاب‌شده‌ها",
                danger: true,
                onClick: () => alert("حذف گروهی"),
              },
              {
                id: "export",
                label: "خروجی انتخاب‌شده‌ها",
                onClick: () => alert("خروجی گروهی"),
              },
            ]}
          />
        }
      />

      <DataGridTable>
        <DataGridHeader>
          <DataGridHeaderRow>
            <DataGridSelectHeaderCell
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(checked) => {
                setSelectedIds(checked ? rows.map((row) => row.id) : []);
              }}
            />
            <DataGridHeaderCell>نام</DataGridHeaderCell>
            <DataGridHeaderCell>ایمیل</DataGridHeaderCell>
          </DataGridHeaderRow>
        </DataGridHeader>

        <DataGridBody>
          {rows.map((row, index) => {
            const selected = selectedSet.has(row.id);

            return (
              <DataGridRow
                key={row.id}
                index={index}
                selected={selected}
                clickable
                onClick={() => {
                  setSelectedIds((prev) =>
                    prev.includes(row.id)
                      ? prev.filter((id) => id !== row.id)
                      : [...prev, row.id],
                  );
                }}
              >
                <DataGridSelectCell
                  checked={selected}
                  onChange={(checked) => {
                    setSelectedIds((prev) =>
                      checked
                        ? [...prev, row.id]
                        : prev.filter((id) => id !== row.id),
                    );
                  }}
                />
                <DataGridCell>{row.name}</DataGridCell>
                <DataGridCell>{row.email}</DataGridCell>
              </DataGridRow>
            );
          })}
        </DataGridBody>
      </DataGridTable>

      <DataGridFooter
        pageIndex={0}
        pageSize={10}
        totalRows={rows.length}
        pageCount={1}
        selectedCount={selectedCount}
      />
    </DataGrid>
  );
}
