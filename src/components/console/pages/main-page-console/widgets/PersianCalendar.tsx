"use client";

export function PersianCalendar() {
  const days = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const numbers = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="rounded-[28px] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">اردیبهشت ۱۴۰۳</h3>
          <p className="text-xs text-slate-400">تقویم شمسی</p>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-bold text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {numbers.map((day) => {
          const active = day === 8;

          return (
            <div
              key={day}
              className={`flex aspect-square items-center justify-center rounded-2xl text-sm transition ${
                active
                  ? "bg-blue-600 font-bold text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
