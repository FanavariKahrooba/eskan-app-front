export function MessageSkeleton() {
  return (
    <div className="flex animate-pulse gap-3">
      <div className="h-10 w-10 rounded-2xl bg-white/10" />
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <div className="h-4 w-1/2 rounded bg-white/10" />
        <div className="mt-3 h-4 w-full rounded bg-white/10" />
        <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
      </div>
    </div>
  );
}
