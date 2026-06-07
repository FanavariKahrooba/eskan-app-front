"use client";

import { Fragment, useState } from "react";
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
  RowDetailPanel,
} from "@/features/data-grid";

const rows = [
  { id: "1", name: "علی رضایی", email: "ali@example.com", role: "مدیر" },
  { id: "2", name: "مریم احمدی", email: "maryam@example.com", role: "کاربر" },
];

export function ExpandableDataGridDemo() {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId],
    );
  };

  return (
    <DataGrid title="جدول با جزئیات بازشونده">
      <DataGridToolbar title="کاربران" subtitle="نمایش جزئیات هر ردیف" />

      <DataGridTable>
        <DataGridHeader>
          <DataGridHeaderRow>
            <DataGridHeaderCell>نام</DataGridHeaderCell>
            <DataGridHeaderCell>ایمیل</DataGridHeaderCell>
            <DataGridHeaderCell>نقش</DataGridHeaderCell>
          </DataGridHeaderRow>
        </DataGridHeader>

        <DataGridBody>
          {rows.map((row, index) => {
            const expanded = expandedRows.includes(row.id);

            return (
              <Fragment key={row.id || `row-${index}`}>
                <DataGridRow onClick={() => toggleRow(row.id)} index={index}>
                  <DataGridCell>{row.name}</DataGridCell>
                  <DataGridCell>{row.email}</DataGridCell>
                  <DataGridCell>{row.role}</DataGridCell>
                </DataGridRow>

                {expanded ? (
                  <RowDetailPanel open={expanded} colSpan={3}>
                    <div className="p-4 text-sm text-slate-600">
                      جزئیات کاربر: {row.name}
                    </div>
                  </RowDetailPanel>
                ) : null}
              </Fragment>
            );
          })}
        </DataGridBody>
      </DataGridTable>
    </DataGrid>
  );
}
