import Link from "next/link";

const cards = [
  {
    title: "مانیتورینگ سراهای محله",
    subtitle: "پایش وضعیت سراها، امکانات، ظرفیت، کیفیت داده و وضعیت منطقه‌ای",
    href: "/console/monitoring/halls",
    wallboardHref: "/console/monitoring/halls/wallboard",
    color: "from-sky-500 to-blue-700",
  },
  {
    title: "مانیتورینگ کامل اسکان",
    subtitle: "پایش ظرفیت، درخواست‌ها، رزروها، فضاها، هشدارها و لاگ‌های اسکان",
    href: "/console/monitoring/shelter",
    wallboardHref: "/console/monitoring/shelter/wallboard",
    color: "from-violet-500 to-fuchsia-700",
  },
  {
    title: "نقشه و ظرفیت سرای های محله",
    subtitle: "پایش ظرفیت، درخواست‌ها، رزروها، فضاها، هشدارها و لاگ‌های اسکان",
    href: "/console/monitoring/shelters",
    wallboardHref: "/console/monitoring/shelters/wallboard",
    color: "from-violet-500 to-fuchsia-700",
  },
];

export default function MonitoringIndexPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-950">مرکز مانیتورینگ</h1>
        <p className="mt-2 text-sm text-slate-500">
          انتخاب داشبورد عملیاتی برای پایش زنده سامانه
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.href}
            className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`h-40 bg-gradient-to-br ${card.color} p-6 text-white`}
            >
              <div className="text-2xl font-black">{card.title}</div>
              <div className="mt-3 max-w-xl text-sm leading-7 text-white/80">
                {card.subtitle}
              </div>
            </div>

            <div className="flex flex-col gap-3 p-6 sm:flex-row">
              <Link
                href={card.href}
                className="flex-1 rounded-2xl bg-slate-950 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-slate-800"
              >
                ورود به داشبورد
              </Link>

              <Link
                href={card.wallboardHref}
                className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 text-center text-sm font-black text-slate-800 transition hover:bg-slate-200"
              >
                نمایش Wallboard
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
