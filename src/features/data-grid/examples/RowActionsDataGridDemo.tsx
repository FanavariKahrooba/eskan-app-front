"use client";

import {
  DataGrid,
  DataGridToolbar,
  DataGridTable,
  DataGridHeader,
  DataGridHeaderRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  RowActionsCell,
} from "@/features/data-grid";

const rows = [
  {
    id: 1,
    name: "علی رضایی",
    email: "ali@example.com",
  },
  {
    id: 2,
    name: "مریم احمدی",
    email: "maryam@example.com",
  },
];

export function RowActionsDataGridDemo() {
  return (
    <DataGrid title="جدول با عملیات ردیف">
      <DataGridToolbar
        title="مدیریت کاربران"
        subtitle="ویرایش، مشاهده و حذف هر ردیف"
      />

      <DataGridTable>
        <DataGridHeader>
          <DataGridHeaderRow>
            <DataGridHeaderCell>نام</DataGridHeaderCell>
            <DataGridHeaderCell>ایمیل</DataGridHeaderCell>
            <DataGridHeaderCell align="end" width={120}>
              عملیات
            </DataGridHeaderCell>
          </DataGridHeaderRow>
        </DataGridHeader>

        <DataGridBody>
          {rows.map((row, index) => (
            <DataGridRow key={row.id} index={index}>
              <DataGridCell>{row.name}</DataGridCell>
              <DataGridCell>{row.email}</DataGridCell>

              <RowActionsCell
                actions={[
                  {
                    id: `view-${row.id}`,
                    label: "مشاهده",
                    onClick: () => alert(`مشاهده ${row.name}`),
                  },
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
                ]}
              />
            </DataGridRow>
          ))}
        </DataGridBody>
      </DataGridTable>
    </DataGrid>
  );
}
