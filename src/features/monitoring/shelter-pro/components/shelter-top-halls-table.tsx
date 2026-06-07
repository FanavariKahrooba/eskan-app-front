"use client";

export function ShelterTopHallsTable({
  items,
}: {
  items: {
    id: number;
    name: string | null;
    hall_code: string | null;
    usable_capacity: number;
    occupied_capacity: number;
    reserved_capacity: number;
    available_capacity: number;
    usage_rate: number;
    occupancy_rate: number;
  }[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">
        سراهای با بیشترین مصرف ظرفیت
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        اولویت برای پایش سریع مراکز پرترافیک
      </p>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">
                  {item.name ?? "بدون نام"}
                </div>
                <div className="text-xs text-slate-500">
                  کد: {item.hall_code ?? "-"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">
                  {item.usage_rate}%
                </div>
                <div className="text-xs text-slate-500">نرخ مصرف</div>
              </div>
            </div>

            <div className="mb-2 h-3 rounded-full bg-slate-100">
              <div
                className={`h-3 rounded-full ${
                  item.usage_rate >= 95
                    ? "bg-rose-500"
                    : item.usage_rate >= 85
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(item.usage_rate, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs text-slate-600">
              <div>قابل استفاده: {item.usable_capacity}</div>
              <div>اشغال: {item.occupied_capacity}</div>
              <div>رزرو: {item.reserved_capacity}</div>
              <div>خالی: {item.available_capacity}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
