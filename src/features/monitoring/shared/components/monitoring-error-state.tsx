"use client";

export function MonitoringErrorState({ message }: { message?: string }) {
  return (
    <div
      dir="rtl"
      className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800"
    >
      <h3 className="text-lg font-black">خطا در دریافت داده‌های مانیتورینگ</h3>
      <p className="mt-2 text-sm leading-7">
        {message ?? "امکان دریافت اطلاعات وجود ندارد. لطفاً دوباره تلاش کنید."}
      </p>
    </div>
  );
}
