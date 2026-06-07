"use client";

import * as React from "react";
import {
  Boxes,
  Crosshair,
  Download,
  Expand,
  Eye,
  EyeOff,
  Focus,
  Info,
  Maximize2,
  Minimize2,
  MousePointerClick,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react";
import BridgeModelViewer from "./BridgeModelViewer";
import BridgeElementInfoPanel from "./BridgeElementInfoPanel";
import BridgeModelTree from "./BridgeModelTree";
import type {
  BridgeElementRecord,
  BridgeModelPart,
} from "@/types/bridge-model";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STORAGE_KEY = "bridge-members-3d-model-records-v1";

const defaultRecords: Record<string, BridgeElementRecord> = {
  "Deck-A": {
    id: "obj-deck-a",
    objectName: "Deck-A",
    title: "عرشه A",
    code: "MEM-DECK-A",
    category: "deck",
    status: "healthy",
    description: "بخش اصلی عرشه پل با وضعیت پایدار.",
    inspectionDate: "2025-01-10",
    inspector: "واحد بازرسی سازه",
    riskScore: 18,
    maintenanceNote: "پایش دوره‌ای کافی است.",
    updatedAt: new Date().toISOString(),
  },
};

export default function BridgeModelSection() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const [selectedPart, setSelectedPart] = React.useState<string | null>(null);
  const [parts, setParts] = React.useState<BridgeModelPart[]>([]);
  const [records, setRecords] =
    React.useState<Record<string, BridgeElementRecord>>(defaultRecords);

  const [hiddenParts, setHiddenParts] = React.useState<string[]>([]);
  const [isolatedPart, setIsolatedPart] = React.useState<string | null>(null);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [resetSignal, setResetSignal] = React.useState(0);
  const [useMtl, setUseMtl] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecords({
          ...defaultRecords,
          ...JSON.parse(raw),
        });
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  React.useEffect(() => {
    const onFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const selectedData = selectedPart ? records[selectedPart] || null : null;

  const detectedParts = React.useMemo(() => {
    return parts.map((part) => ({
      ...part,
      visible: !hiddenParts.includes(part.name),
    }));
  }, [parts, hiddenParts]);

  const summary = React.useMemo(() => {
    const values = Object.values(records);

    return {
      totalParts: parts.length,
      registered: values.length,
      healthy: values.filter((item) => item.status === "healthy").length,
      warning: values.filter((item) => item.status === "warning").length,
      critical: values.filter((item) => item.status === "critical").length,
    };
  }, [records, parts.length]);

  const handleSave = (payload: BridgeElementRecord) => {
    setRecords((prev) => ({
      ...prev,
      [payload.objectName]: payload,
    }));
  };

  const handleToggleVisibility = (name: string) => {
    setHiddenParts((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const handleToggleFullscreen = async () => {
    if (!rootRef.current) return;

    if (!document.fullscreenElement) {
      await rootRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "bridge-model-records.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleImportJson = (file?: File | null) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        setRecords((prev) => ({
          ...prev,
          ...parsed,
        }));
      } catch {
        alert("فایل JSON معتبر نیست.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <>
      <section
        ref={rootRef}
        className={cn(
          "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm",
          fullscreen && "h-screen overflow-auto rounded-none border-0",
        )}
      >
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <Boxes size={21} />
              مدل سه‌بعدی هوشمند اجزای پل
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              فایل{" "}
              <span className="font-semibold text-slate-700">3dModel.obj</span>{" "}
              بارگذاری می‌شود؛ اجزای مدل قابل انتخاب هستند و هر جزء به فرم
              اطلاعات، وضعیت سلامت، ریسک، بازرسی و برنامه نگهداری متصل است.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <MousePointerClick size={13} />
                انتخاب مستقیم روی مدل
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <Info size={13} />
                فایل: 3dModel.obj
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Save size={13} />
                ذخیره خودکار در localStorage
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
            <button
              type="button"
              onClick={() => setResetSignal((p) => p + 1)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw size={15} />
              Reset Camera
            </button>

            <button
              type="button"
              onClick={() => {
                if (!selectedPart) return;
                setIsolatedPart((prev) => (prev ? null : selectedPart));
              }}
              disabled={!selectedPart}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Focus size={15} />
              {isolatedPart ? "لغو Isolate" : "Isolate"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!selectedPart) return;
                handleToggleVisibility(selectedPart);
              }}
              disabled={!selectedPart}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {selectedPart && hiddenParts.includes(selectedPart) ? (
                <Eye size={15} />
              ) : (
                <EyeOff size={15} />
              )}
              Hide/Show
            </button>

            <button
              type="button"
              onClick={() => setUseMtl((p) => !p)}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition",
                useMtl
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50",
              )}
            >
              <Crosshair size={15} />
              MTL
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={15} />
              Export
            </button>

            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
              <Upload size={15} />
              Import
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => handleImportJson(e.target.files?.[0])}
              />
            </label>

            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              Fullscreen
            </button>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          <MiniStat label="اجزای شناسایی‌شده" value={summary.totalParts} />
          <MiniStat label="ثبت اطلاعات" value={summary.registered} />
          <MiniStat label="پایدار" value={summary.healthy} tone="green" />
          <MiniStat
            label="نیازمند بررسی"
            value={summary.warning}
            tone="amber"
          />
          <MiniStat label="بحرانی" value={summary.critical} tone="rose" />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <BridgeModelTree
            parts={detectedParts}
            selectedPart={selectedPart}
            records={records}
            onSelectPart={setSelectedPart}
            onToggleVisibility={handleToggleVisibility}
          />

          <BridgeModelViewer
            modelUrl="/models/3dModel.obj"
            selectedPart={selectedPart}
            isolatedPart={isolatedPart}
            hiddenParts={hiddenParts}
            records={records}
            resetSignal={resetSignal}
            onSelectPart={setSelectedPart}
            onPartsDetected={setParts}
          />
        </div>
      </section>

      <BridgeElementInfoPanel
        open={Boolean(selectedPart)}
        selectedObjectName={selectedPart}
        data={selectedData}
        onClose={() => setSelectedPart(null)}
        onSave={handleSave}
      />
    </>
  );
}

function MiniStat({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: "slate" | "green" | "amber" | "rose";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        tone === "slate" && "border-slate-200 bg-slate-50",
        tone === "green" && "border-emerald-100 bg-emerald-50",
        tone === "amber" && "border-amber-100 bg-amber-50",
        tone === "rose" && "border-rose-100 bg-rose-50",
      )}
    >
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}
