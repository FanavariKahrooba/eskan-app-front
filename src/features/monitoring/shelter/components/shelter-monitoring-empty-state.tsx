"use client";

export function ShelterMonitoringEmptyState({
  title = "داده‌ای موجود نیست",
  description = "در حال حاضر داده‌ای برای نمایش در این بخش وجود ندارد.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
      <div className="text-lg font-bold monitoring-title">{title}</div>
      <div className="mt-2 text-sm monitoring-muted">{description}</div>
    </div>
  );
}
