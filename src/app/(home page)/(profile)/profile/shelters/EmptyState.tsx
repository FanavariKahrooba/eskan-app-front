import { Search } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-white/15 dark:bg-zinc-950/40">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-200 bg-white text-zinc-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:shadow-none">
        <Search className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-zinc-950 dark:text-white">
        موردی یافت نشد
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-zinc-600 dark:text-zinc-400">
        با فیلترهای فعلی هیچ سرایی پیدا نشد. لطفاً فیلترها را تغییر دهید یا
        عبارت جستجو را حذف کنید.
      </p>
    </div>
  );
}
