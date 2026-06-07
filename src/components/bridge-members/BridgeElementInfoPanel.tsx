"use client";

import * as React from "react";
import { Save, X, ClipboardList, AlertTriangle } from "lucide-react";
import type {
  BridgeElementCategory,
  BridgeElementRecord,
  BridgeElementStatus,
} from "@/types/bridge-model";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const statusOptions: Array<{
  value: BridgeElementStatus;
  label: string;
}> = [
  { value: "healthy", label: "پایدار" },
  { value: "warning", label: "نیازمند بررسی" },
  { value: "critical", label: "بحرانی" },
];

const categoryOptions: Array<{
  value: BridgeElementCategory;
  label: string;
}> = [
  { value: "unknown", label: "نامشخص" },
  { value: "deck", label: "عرشه" },
  { value: "pier", label: "پایه" },
  { value: "girder", label: "تیر" },
  { value: "bearing", label: "یاتاقان" },
  { value: "joint", label: "درز انبساط" },
  { value: "cable", label: "کابل" },
  { value: "abutment", label: "کوله" },
  { value: "railing", label: "جان‌پناه" },
  { value: "foundation", label: "فونداسیون" },
];

type Props = {
  open: boolean;
  selectedObjectName: string | null;
  data?: BridgeElementRecord | null;
  onClose: () => void;
  onSave: (payload: BridgeElementRecord) => void;
};

export default function BridgeElementInfoPanel({
  open,
  selectedObjectName,
  data,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = React.useState<BridgeElementRecord>({
    id: "",
    objectName: "",
    title: "",
    code: "",
    category: "unknown",
    status: "healthy",
    description: "",
    inspectionDate: "",
    inspector: "",
    riskScore: 0,
    maintenanceNote: "",
  });

  React.useEffect(() => {
    if (!selectedObjectName) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      id: data?.id || crypto.randomUUID(),
      objectName: selectedObjectName,
      title: data?.title || selectedObjectName,
      code: data?.code || "",
      category: data?.category || "unknown",
      status: data?.status || "healthy",
      description: data?.description || "",
      inspectionDate: data?.inspectionDate || "",
      inspector: data?.inspector || "",
      riskScore: data?.riskScore || 0,
      maintenanceNote: data?.maintenanceNote || "",
      updatedAt: data?.updatedAt,
    });
  }, [selectedObjectName, data]);

  if (!open || !selectedObjectName) return null;

  const handleSave = () => {
    onSave({
      ...form,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-y-0 left-0 z-[80] w-full max-w-xl border-r border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-950">
            <ClipboardList size={19} />
            اطلاعات جزء انتخاب‌شده
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            ثبت، ویرایش و مدیریت داده‌های عضو انتخاب‌شده از مدل سه‌بعدی
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
        >
          <X size={18} />
        </button>
      </div>

      <div className="h-[calc(100vh-73px)] overflow-y-auto p-5">
        <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="text-xs font-medium text-blue-600">Object Name</div>
          <div className="mt-1 text-sm font-bold text-blue-950">
            {selectedObjectName}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              عنوان عضو
            </span>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">کد عضو</span>
            <input
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              placeholder="مثلاً MEM-001"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                دسته‌بندی
              </span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    category: e.target.value as BridgeElementCategory,
                  }))
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
              >
                {categoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">وضعیت</span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    status: e.target.value as BridgeElementStatus,
                  }))
                }
                className={cn(
                  "h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:border-slate-400",
                  form.status === "healthy" &&
                    "border-emerald-200 bg-emerald-50",
                  form.status === "warning" && "border-amber-200 bg-amber-50",
                  form.status === "critical" && "border-rose-200 bg-rose-50",
                )}
              >
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                تاریخ آخرین بازرسی
              </span>
              <input
                type="date"
                value={form.inspectionDate || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, inspectionDate: e.target.value }))
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">بازرس</span>
              <input
                value={form.inspector || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, inspector: e.target.value }))
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <AlertTriangle size={15} />
              امتیاز ریسک
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={form.riskScore || 0}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  riskScore: Number(e.target.value),
                }))
              }
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              توضیحات فنی
            </span>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={5}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              پیشنهاد نگهداری
            </span>
            <textarea
              value={form.maintenanceNote || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, maintenanceNote: e.target.value }))
              }
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          {form.updatedAt ? (
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
              آخرین بروزرسانی:{" "}
              {new Date(form.updatedAt).toLocaleString("fa-IR")}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Save size={16} />
            ذخیره اطلاعات جزء
          </button>
        </div>
      </div>
    </div>
  );
}
