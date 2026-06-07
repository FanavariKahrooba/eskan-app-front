"use client";

export function MonitoringSkeleton({
  wallboard = false,
}: {
  wallboard?: boolean;
}) {
  const base = wallboard ? "bg-slate-800" : "bg-slate-200";

  return (
    <div className="space-y-6" dir="rtl">
      <div className={`h-20 animate-pulse rounded-3xl ${base}`} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={`h-36 animate-pulse rounded-3xl ${base}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-80 animate-pulse rounded-3xl ${base}`}
          />
        ))}
      </div>
    </div>
  );
}
