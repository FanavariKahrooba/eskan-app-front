"use client";

export function ShelterAlertsPanel({
  items,
}: {
  items: {
    type: string;
    severity: "info" | "warning" | "critical";
    title: string;
    message: string;
    color?: string;
  }[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">هشدارهای تحلیلی</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {items.length} Alert
        </span>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            در حال حاضر هشدار بحرانی یا مهمی ثبت نشده است.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item.type}-${index}`}
              className="rounded-xl border-l-4 bg-slate-50 p-4"
              style={{
                borderLeftColor: item.color ?? "#94a3b8",
              }}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="font-semibold text-slate-900">{item.title}</div>
                <span className="text-xs font-medium uppercase text-slate-500">
                  {item.severity}
                </span>
              </div>
              <p className="text-sm text-slate-600">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
