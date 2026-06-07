"use client";

type KpiItem = {
  key: string;
  title: string;
  value: string | number;
  subtitle?: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

const toneClasses: Record<NonNullable<KpiItem["tone"]>, string> = {
  neutral: "border-slate-200 bg-white text-slate-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
};

export function ShelterKpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.key}
          className={`rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${toneClasses[item.tone ?? "neutral"]}`}
        >
          <div className="text-sm font-medium opacity-80">{item.title}</div>
          <div className="mt-3 text-3xl font-black tracking-tight">
            {item.value}
          </div>
          {item.subtitle ? (
            <div className="mt-2 text-xs opacity-70">{item.subtitle}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
