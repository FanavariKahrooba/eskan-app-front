"use client";

export function AnalysisEmptyState() {
  return (
    <section className="flex min-h-[620px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6 shadow-sm">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
          AI
        </div>

        <h2 className="text-lg font-bold text-card-foreground">
          هنوز تحلیلی اجرا نشده است
        </h2>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          متن یا فایل موردنظر را در سمت راست وارد کنید، نوع تحلیل را انتخاب کنید
          و سپس روی دکمه «اجرای تحلیل» بزنید. خروجی تحلیل در همین بخش نمایش داده
          خواهد شد.
        </p>

        <div className="mt-6 grid gap-2 text-right">
          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-xs font-bold text-foreground">۱. ورود داده</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              متن، گزارش یا فایل‌های متنی را اضافه کنید.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-xs font-bold text-foreground">
              ۲. انتخاب نوع تحلیل
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              خلاصه‌سازی، تحلیل کامل، ارزیابی ریسک یا استخراج بینش را انتخاب
              کنید.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-xs font-bold text-foreground">۳. دریافت خروجی</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              خلاصه، گزارش، بینش‌ها و تاریخچه پیام‌ها را مشاهده کنید.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
