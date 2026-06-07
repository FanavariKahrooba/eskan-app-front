"use client"
import { useState } from "react";
import type { ReactNode } from "react";
import { DataGridButton, DataGridIcon, DataGridMenu } from "../shared";
import type { DataGridMenuItem } from "../shared";

export interface DataGridActionCellProps {
  actions?: DataGridMenuItem[];
  children?: ReactNode;
  pinned?: "left" | "right" | false;
  align?: "start" | "center" | "end";
  className?: string;
}

const alignClass = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

export function DataGridActionCell({
  actions = [],
  children,
  pinned = false,
  align = "end",
  className = "",
}: DataGridActionCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <td
      className={[
        "border-b border-slate-100 px-4 py-3",
        pinned ? "sticky z-20 bg-inherit backdrop-blur-xl" : "",
        pinned === "left"
          ? "left-0 shadow-[8px_0_18px_-18px_rgba(15,23,42,0.55)]"
          : "",
        pinned === "right"
          ? "right-0 shadow-[-8px_0_18px_-18px_rgba(15,23,42,0.55)]"
          : "",
        className,
      ].join(" ")}
    >
      <div
        className={["relative flex items-center gap-2", alignClass[align]].join(
          " ",
        )}
      >
        {children}

        {actions.length > 0 ? (
          <>
            <DataGridButton
              size="icon"
              variant="ghost"
              onClick={(event) => {
                event.stopPropagation();
                setOpen((value) => !value);
              }}
            >
              <DataGridIcon name="more" />
            </DataGridButton>

            <DataGridMenu
              open={open}
              items={actions}
              align="end"
              onClose={() => setOpen(false)}
            />
          </>
        ) : null}
      </div>
    </td>
  );
}
