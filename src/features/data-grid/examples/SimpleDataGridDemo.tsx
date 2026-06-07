"use client"
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
  DataGridFooter,
} from "@/features/data-grid";

const users = [
  {
    id: 1,
    name: "علی رضایی",
    email: "ali@example.com",
    role: "مدیر",
    status: "فعال",
  },
  {
    id: 2,
    name: "مریم احمدی",
    email: "maryam@example.com",
    role: "کاربر",
    status: "غیرفعال",
  },
];

export function SimpleDataGridDemo() {
  return (
    <DataGrid title="دموی ساده جدول" description="حداقل استفاده از جدول">
      <DataGridToolbar
        title="کاربران"
        subtitle="لیست کاربران ثبت‌شده در سیستم"
      />

      <DataGridTable>
        <DataGridHeader>
          <DataGridHeaderRow>
            <DataGridHeaderCell width={80}>شناسه</DataGridHeaderCell>
            <DataGridHeaderCell>نام</DataGridHeaderCell>
            <DataGridHeaderCell>ایمیل</DataGridHeaderCell>
            <DataGridHeaderCell>نقش</DataGridHeaderCell>
            <DataGridHeaderCell>وضعیت</DataGridHeaderCell>
          </DataGridHeaderRow>
        </DataGridHeader>

        <DataGridBody>
          {users.map((user, index) => (
            <DataGridRow key={user.id} index={index}>
              <DataGridCell>{user.id}</DataGridCell>
              <DataGridCell>{user.name}</DataGridCell>
              <DataGridCell>{user.email}</DataGridCell>
              <DataGridCell>{user.role}</DataGridCell>
              <DataGridCell>{user.status}</DataGridCell>
            </DataGridRow>
          ))}
        </DataGridBody>
      </DataGridTable>

      <DataGridFooter
        pageIndex={0}
        pageSize={10}
        totalRows={users.length}
        pageCount={1}
      />
    </DataGrid>
  );
}
