"use client"
import { useState } from "react";
import {
  DataGrid,
  DataGridToolbar,
  DataGridButton,
  DataGridEmpty,
  DataGridError,
  DataGridLoading,
  DataGridTable,
  DataGridHeader,
  DataGridHeaderRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
} from "@/features/data-grid";

type Mode = "loading" | "empty" | "error" | "data";

const rows = [
  { id: 1, name: "علی رضایی" },
  { id: 2, name: "مریم احمدی" },
];

export function StatusDataGridDemo() {
  const [mode, setMode] = useState<Mode>("data");

  return (
    <DataGrid title="وضعیت‌های جدول">
      <DataGridToolbar
        title="دموی وضعیت‌ها"
        subtitle="Loading، Empty، Error و Data"
        actions={
          <>
            <DataGridButton size="sm" onClick={() => setMode("loading")}>
              Loading
            </DataGridButton>
            <DataGridButton size="sm" onClick={() => setMode("empty")}>
              Empty
            </DataGridButton>
            <DataGridButton size="sm" onClick={() => setMode("error")}>
              Error
            </DataGridButton>
            <DataGridButton size="sm" onClick={() => setMode("data")}>
              Data
            </DataGridButton>
          </>
        }
      />

      {mode === "loading" ? <DataGridLoading /> : null}

      {mode === "empty" ? (
        <DataGridEmpty
          action={
            <DataGridButton variant="primary" onClick={() => setMode("data")}>
              افزودن داده نمونه
            </DataGridButton>
          }
        />
      ) : null}

      {mode === "error" ? (
        <DataGridError onRetry={() => setMode("data")} />
      ) : null}

      {mode === "data" ? (
        <DataGridTable>
          <DataGridHeader>
            <DataGridHeaderRow>
              <DataGridHeaderCell>شناسه</DataGridHeaderCell>
              <DataGridHeaderCell>نام</DataGridHeaderCell>
            </DataGridHeaderRow>
          </DataGridHeader>

          <DataGridBody>
            {rows.map((row, index) => (
              <DataGridRow key={row.id} index={index}>
                <DataGridCell>{row.id}</DataGridCell>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            ))}
          </DataGridBody>
        </DataGridTable>
      ) : null}
    </DataGrid>
  );
}
