import { MessageSquareDashed } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
      <MessageSquareDashed className="h-10 w-10 text-slate-500" />
      <h3 className="mt-4 text-lg font-semibold text-white">
        گفتگو را شروع کنید
      </h3>
      <p className="mt-2 max-w-md text-sm leading-7 text-slate-400">
        یک سوال بپرس، متنی برای خلاصه‌سازی بفرست یا از دستیار بخواه تحلیل انجام
        دهد.
      </p>
    </div>
  );
}
