"use client";

export default function NeighborhoodHallMonitoringSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/5"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/5 xl:col-span-8" />
        <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/5 xl:col-span-4" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5 xl:col-span-4" />
        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5 xl:col-span-4" />
        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5 xl:col-span-4" />
      </div>
    </div>
  );
}
