// src/app/users/users-table.tsx

"use client";

import { ColumnDef, DataGrid } from "@/components/dynamic-table/features";


type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  status: "active" | "inactive";
};

const users: User[] = [
  {
    id: "1",
    name: "Ali",
    email: "ali@example.com",
    age: 25,
    status: "active",
  },
  {
    id: "2",
    name: "Sara",
    email: "sara@example.com",
    age: 30,
    status: "inactive",
  },
  {
    id: "3",
    name: "Reza",
    email: "reza@example.com",
    age: 28,
    status: "active",
  },
];

const columns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "نام",
    type: "text",
    searchable: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "ایمیل",
    type: "text",
    searchable: true,
  },
  {
    id: "age",
    accessorKey: "age",
    header: "سن",
    type: "number",
    searchable: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "وضعیت",
    type: "badge",
    searchable: true,
    renderCell: ({ value }) => {
      const isActive = value === "active";

      return (
        <span
          className={
            isActive
              ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
              : "rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
          }
        >
          {isActive ? "فعال" : "غیرفعال"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "عملیات",
    type: "custom",
    renderCell: ({ row }: any) => (
      <button
        className="rounded-md border px-2 py-1 text-xs"
        onClick={(event) => {
          event.stopPropagation();
          alert(`Edit ${row.original.name}`);
        }}
      >
        ویرایش
      </button>
    ),
  },
];

export default function UsersTable() {
  return (
    <DataGrid<User>
      id="users-table"
      columns={columns}
      dataSource={users}
      rowKey="id"
      mode="client"
      features={{
        search: true,
        pagination: true,
      }}
      pagination={{
        pageSize: 2,
      }}
      search={{
        placeholder: "جستجو در کاربران...",
      }}
      events={{
        onRowClick: (row) => {
          console.log("Row clicked:", row);
        },
      }}
    />
  );
}
