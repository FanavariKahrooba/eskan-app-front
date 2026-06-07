"use client";

export function ShelterRecentRequests({
  items,
}: {
  items: {
    id: number;
    request_number: string;
    hall_name: string | null;
    preferred_space_name: string | null;
    applicant_name: string | null;
    priority_label: string;
    status_label: string;
    household_size: number;
    created_at: string | null;
  }[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">
        درخواست‌های اخیر
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">
                  {item.applicant_name ?? "بدون نام"}
                </div>
                <div className="text-xs text-slate-500">
                  {item.request_number}
                </div>
              </div>
              <div className="text-xs text-slate-500">
                {item.created_at ?? "-"}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
              <div>سرا: {item.hall_name ?? "-"}</div>
              <div>فضا: {item.preferred_space_name ?? "-"}</div>
              <div>اولویت: {item.priority_label}</div>
              <div>وضعیت: {item.status_label}</div>
              <div>تعداد نفرات: {item.household_size}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
