"use client";

import type { DynamicSmartGridProps } from "./DynamicSmartGrid.types";
import {
  DynamicSmartGridProvider,
  useDynamicSmartGrid,
} from "./DynamicSmartGrid.context";

import "./DynamicSmartGrid.css";

import { DynamicSmartGridToolbar } from "./Toolbar";
import { DynamicSmartGridTable } from "./Table";
import { DynamicSmartGridPagination } from "./Pagination";
import { DynamicSmartGridColumnPanel } from "./ColumnPanel";

import { cx } from "../utils/dynamic-grid-helpers";

function DynamicSmartGridShell<TData extends Record<string, any>>() {
  const grid = useDynamicSmartGrid<TData>();

  const { props, isFullscreen, density } = grid;
  const variant = props.variant ?? "grid";

  return (
    <section
      className={cx(
        "dsg-root",
        `dsg-density-${density}`,
        `dsg-variant-${variant}`,
        isFullscreen && "dsg-fullscreen",
      )}
      style={{
        height: props.height,
        maxHeight: props.maxHeight,
      }}
    >
      <DynamicSmartGridToolbar />

      <div className="dsg-content">
        <DynamicSmartGridTable />
        {props.enableColumnPanel ? <DynamicSmartGridColumnPanel /> : null}
      </div>

      {props.enablePagination ? <DynamicSmartGridPagination /> : null}
    </section>
  );
}

export function DynamicSmartGrid<TData extends Record<string, any>>(
  props: DynamicSmartGridProps<TData>,
) {
  return (
    <DynamicSmartGridProvider<TData> props={props}>
      <DynamicSmartGridShell<TData> />
    </DynamicSmartGridProvider>
  );
}

export default DynamicSmartGrid;
