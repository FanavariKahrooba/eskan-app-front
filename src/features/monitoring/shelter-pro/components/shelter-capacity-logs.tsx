"use client";

export function ShelterCapacityLogs({
  items,
}: {
  items: {
    id: number;
    hall_name: string | null;
    space_name: string | null;
    user_name: string | null;
    action_label: string;
    delta_available: number;
    delta_reserved: number;
    delta_occupied: number;
    created_at: string | null;
  }[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">
        لاگ تغییرات ظرفیت
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-semibold text-slate-900">
                  {item.action_label}
                </div>
                <div className="text-xs text-slate-500">
                  {item.hall_name ?? "-"} / {item.space_name ?? "-"}
                </div>
              </div>
              <div className="text-xs text-slate-500">
                {item.created_at ?? "-"}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-800">
                Δ خالی: {item.delta_available}
              </div>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-800">
                Δ رزرو: {item.delta_reserved}
              </div>
              <div className="rounded-lg bg-rose-50 p-2 text-rose-800">
                Δ اشغال: {item.delta_occupied}
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              کاربر: {item.user_name ?? "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
