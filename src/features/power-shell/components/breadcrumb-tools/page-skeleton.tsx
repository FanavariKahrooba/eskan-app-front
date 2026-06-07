export default function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border border-gray-200 bg-white"
          />
        ))}
      </div>

      <div className="h-[320px] rounded-2xl border border-gray-200 bg-white" />

      <div className="h-[260px] rounded-2xl border border-gray-200 bg-white" />
    </div>
  );
}
