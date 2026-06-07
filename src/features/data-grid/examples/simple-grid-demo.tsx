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
} from "../ui";

const rows = [
  { id: 1, name: "آیتم اول", value: 120 },
  { id: 2, name: "آیتم دوم", value: 340 },
  { id: 3, name: "آیتم سوم", value: 560 },
];

export function SimpleGridDemo() {
  return (
    <DataGrid>
      <DataGridToolbar title="دموی ساده جدول" subtitle="حداقل استفاده ممکن" />

      <DataGridTable>
        <DataGridHeader>
          <DataGridHeaderRow>
            <DataGridHeaderCell>شناسه</DataGridHeaderCell>
            <DataGridHeaderCell>عنوان</DataGridHeaderCell>
            <DataGridHeaderCell>مقدار</DataGridHeaderCell>
          </DataGridHeaderRow>
        </DataGridHeader>

        <DataGridBody>
          {rows.map((row) => (
            <DataGridRow key={row.id}>
              <DataGridCell>{row.id.toLocaleString("fa-IR")}</DataGridCell>
              <DataGridCell>{row.name}</DataGridCell>
              <DataGridCell>{row.value.toLocaleString("fa-IR")}</DataGridCell>
            </DataGridRow>
          ))}
        </DataGridBody>
      </DataGridTable>
    </DataGrid>
  );
}
