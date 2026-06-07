"use client";

import * as React from "react";
import {
  Eye,
  EyeOff,
  Layers3,
  MousePointerClick,
  Search,
  ShieldAlert,
} from "lucide-react";
import type {
  BridgeElementRecord,
  BridgeModelPart,
} from "@/types/bridge-model";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  parts: BridgeModelPart[];
  selectedPart: string | null;
  records: Record<string, BridgeElementRecord>;
  onSelectPart: (name: string) => void;
  onToggleVisibility: (name: string) => void;
};

function getStatusClass(status?: BridgeElementRecord["status"]) {
  if (status === "healthy") return "bg-emerald-500";
  if (status === "warning") return "bg-amber-500";
  if (status === "critical") return "bg-rose-500";
  return "bg-slate-300";
}

export default function BridgeModelTree({
  parts,
  selectedPart,
  records,
  onSelectPart,
  onToggleVisibility,
}: Props) {
  const [query, setQuery] = React.useState("");

  const filteredParts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parts;

    return parts.filter((part) => {
      const record = records[part.name];

      return (
        part.name.toLowerCase().includes(q) ||
        record?.title?.toLowerCase().includes(q) ||
        record?.code?.toLowerCase().includes(q)
      );
    });
  }, [parts, query, records]);

  const criticalCount = React.useMemo(() => {
    return Object.values(records).filter((item) => item.status === "critical")
      .length;
  }, [records]);

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Layers3 size={17} />
              درخت اجزای مدل
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              انتخاب، جستجو و کنترل نمایش اجزای مدل
            </p>
          </div>

          {criticalCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
              <ShieldAlert size={13} />
              {criticalCount} بحرانی
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3">
          <Search size={15} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی object، کد یا عنوان..."
            className="h-full flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="max-h-[610px] overflow-y-auto p-3">
        {filteredParts.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-500">
            موردی پیدا نشد.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredParts.map((part) => {
              const record = records[part.name];
              const active = selectedPart === part.name;

              return (
                <div
                  key={part.name}
                  className={cn(
                    "group rounded-2xl border p-3 transition",
                    active
                      ? "border-blue-200 bg-blue-50"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectPart(part.name)}
                      className="min-w-0 flex-1 text-right"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2.5 w-2.5 shrink-0 rounded-full",
                            getStatusClass(record?.status),
                          )}
                        />
                        <span className="truncate text-sm font-semibold text-slate-900">
                          {record?.title || part.name}
                        </span>
                      </div>

                      <div className="mt-1 truncate text-xs text-slate-500">
                        {record?.code ? `${record.code} · ` : ""}
                        {part.name}
                      </div>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onSelectPart(part.name)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-blue-600"
                        title="انتخاب"
                      >
                        <MousePointerClick size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleVisibility(part.name)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900"
                        title={part.visible ? "مخفی کردن" : "نمایش دادن"}
                      >
                        {part.visible ? (
                          <Eye size={15} />
                        ) : (
                          <EyeOff size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
