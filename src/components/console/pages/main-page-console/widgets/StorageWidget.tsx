"use client";

import { HardDrive } from "lucide-react";

export function StorageWidget() {
  const used = 75;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3 text-slate-700">
        <HardDrive size={20} className="text-blue-500" />
        <h3 className="text-sm font-bold">فضای ذخیره‌سازی</h3>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-1000"
          style={{ width: `${used}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between text-[11px] font-medium text-slate-500">
        <span>{used} گیگابایت مصرف شده</span>
        <span>۱۰۰ گیگابایت کل</span>
      </div>
    </div>
  );
}
