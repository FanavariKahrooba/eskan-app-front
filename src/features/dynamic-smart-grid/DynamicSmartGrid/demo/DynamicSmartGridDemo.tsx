"use client";
import { useMemo, useState } from "react";
import { DynamicSmartGrid } from "../DynamicSmartGrid";
import type { DynamicGridColumn } from "../DynamicSmartGrid.types";
import "../DynamicSmartGrid.css";

type DemoOrder = {
  id: number;
  customer: string;
  email: string;
  status: "paid" | "pending" | "cancelled";
  amount: number;
  city: string;
  createdAt: string;
};

const initialRows: DemoOrder[] = [
  {
    id: 1001,
    customer: "علی رضایی",
    email: "ali@example.com",
    status: "paid",
    amount: 2450000,
    city: "تهران",
    createdAt: "1405/02/01",
  },
  {
    id: 1002,
    customer: "مریم احمدی",
    email: "maryam@example.com",
    status: "pending",
    amount: 850000,
    city: "شیراز",
    createdAt: "1405/02/03",
  },
  {
    id: 1003,
    customer: "رضا کریمی",
    email: "reza@example.com",
    status: "cancelled",
    amount: 1200000,
    city: "مشهد",
    createdAt: "1405/02/05",
  },
  {
    id: 1004,
    customer: "سارا محمدی",
    email: "sara@example.com",
    status: "paid",
    amount: 3100000,
    city: "اصفهان",
    createdAt: "1405/02/07",
  },
  {
    id: 1005,
    customer: "حسین مرادی",
    email: "hossein@example.com",
    status: "pending",
    amount: 450000,
    city: "تبریز",
    createdAt: "1405/02/09",
  },
];

export function DynamicSmartGridDemo() {
  const [rows, setRows] = useState<DemoOrder[]>(initialRows);

  const columns = useMemo<DynamicGridColumn<DemoOrder>[]>(
    () => [
      {
        id: "id",
        header: "شناسه",
        accessorKey: "id",
        width: 110,
        pinned: "right",
        align: "center",
        enableEditing: false,
      },
      {
        id: "customer",
        header: "مشتری",
        accessorKey: "customer",
        width: 180,
        enableEditing: true,
      },
      {
        id: "email",
        header: "ایمیل",
        accessorKey: "email",
        width: 220,
        enableEditing: true,
      },
      {
        id: "status",
        header: "وضعیت",
        accessorKey: "status",
        width: 140,
        cell: ({ value }) => {
          const status = value as DemoOrder["status"];

          const label =
            status === "paid"
              ? "پرداخت شده"
              : status === "pending"
                ? "در انتظار"
                : "لغو شده";

          return <span className={`demo-status demo-status-${status}`}>{label}</span>;
        },
      },
      {
        id: "amount",
        header: "مبلغ",
        accessorKey: "amount",
        width: 160,
        align: "left",
        editVariant: "number",
        cell: ({ value }) =>
          `${Number(value ?? 0).toLocaleString("fa-IR")} تومان`,
      },
      {
        id: "city",
        header: "شهر",
        accessorKey: "city",
        width: 140,
      },
      {
        id: "createdAt",
        header: "تاریخ ثبت",
        accessorKey: "createdAt",
        width: 150,
        align: "center",
      },
    ],
    []
  );

  return (
    <div dir="rtl" style={{ padding: 24 }}>
      <DynamicSmartGrid<DemoOrder>
        title="سفارش‌ها"
        subtitle="نمونه استفاده از Dynamic Smart Grid"
        data={rows}
        columns={columns}
        getRowId={(row) => String(row.id)}
        variant="sheet"
        storageKey="orders-dynamic-smart-grid-demo"
        enableSearch
        enableSorting
        enableMultiSort
        enableColumnFilters
        enableColumnResizing
        enableColumnReorder
        enableColumnPinning
        enableColumnVisibility
        enableSelection
        enableExpansion
        enableInlineEdit
        enableExport
        enableDensity
        enableFullscreen
        enablePagination
        pageSizeOptions={[5, 10, 25, 50]}
        initialPageSize={5}
        renderExpandedRow={(row) => (
          <div className="demo-expanded-card">
            <strong>جزئیات سفارش #{row.id}</strong>
            <div>مشتری: {row.customer}</div>
            <div>ایمیل: {row.email}</div>
            <div>شهر: {row.city}</div>
            <div>مبلغ: {row.amount.toLocaleString("fa-IR")} تومان</div>
          </div>
        )}
        onCellEdit={({ rowId, columnId, nextValue }) => {
          setRows((prev) =>
            prev.map((row) => {
              if (String(row.id) !== rowId) return row;

              return {
                ...row,
                [columnId]:
                  columnId === "amount" ? Number(nextValue) : nextValue,
              };
            })
          );
        }}
        onRowClick={(row) => {
          console.log("row clicked", row);
        }}
      />
    </div>
  );
}
