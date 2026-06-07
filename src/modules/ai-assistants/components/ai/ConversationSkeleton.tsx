export function ConversationSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <div className="h-4 w-2/3 rounded bg-white/10" />
      <div className="mt-3 h-3 w-1/3 rounded bg-white/10" />
    </div>
  );
}
