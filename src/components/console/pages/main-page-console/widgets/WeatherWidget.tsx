"use client";

import { CloudSun } from "lucide-react";

export function WeatherWidget() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg shadow-blue-100">
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-3xl font-bold">۲۷°</h3>
            <p className="mt-1 text-sm text-blue-100">تهران، ایران</p>
          </div>
          <CloudSun size={48} className="text-white/80" />
        </div>

        <div className="mt-8 flex items-center justify-between rounded-2xl bg-white/10 p-3 backdrop-blur-md">
          <span className="text-xs">وضعیت: آفتابی</span>
          <span className="text-xs">رطوبت: ۳۰٪</span>
        </div>
      </div>

      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
}
