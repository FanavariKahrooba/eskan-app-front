"use client";

import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import type { PageShellModuleDefinition } from "../page-shell/page-shell-types";

export const HeroShellModule: PageShellModuleDefinition = {
  type: "hero",
  title: "Hero",
  description: "بخش معرفی صفحه",
  defaultSize: "full",
  render: ({ module }) => {
    const variant = module.settings?.variant ?? "blue";

    const variants: Record<string, string> = {
      blue: "from-blue-600 to-indigo-600",
      emerald: "from-emerald-600 to-teal-600",
      violet: "from-violet-600 to-fuchsia-600",
      amber: "from-amber-500 to-orange-600",
    };

    return (
      <div
        className={[
          "relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white",
          variants[variant] ?? variants.blue,
        ].join(" ")}
      >
        <div className="relative z-10">
          <p className="text-sm font-medium text-white/80">
            {module.description}
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            {module.settings?.primaryText ?? module.title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
            {module.settings?.secondaryText ??
              "این بخش می‌تواند برای معرفی، پیام مدیریتی یا خلاصه وضعیت صفحه استفاده شود."}
          </p>
        </div>

        <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-10 h-44 w-44 rounded-full bg-white/10" />
      </div>
    );
  },
};

export const StatsShellModule: PageShellModuleDefinition = {
  type: "stats",
  title: "Stats",
  description: "نمایش شاخص‌های آماری",
  defaultSize: "lg",
  render: ({ context }) => {
    const stats = context?.stats ?? [
      {
        label: "کاربران",
        value: "12,420",
        change: "+12%",
        icon: Users,
      },
      {
        label: "گزارش‌ها",
        value: "842",
        change: "+8%",
        icon: FileText,
      },
      {
        label: "نرخ رشد",
        value: "24%",
        change: "+4%",
        icon: TrendingUp,
      },
    ];

    return (
      <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((item: any) => {
          const Icon = item.icon ?? TrendingUp;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  {item.change}
                </span>
              </div>

              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                {item.label}
              </p>

              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    );
  },
};

export const ChartShellModule: PageShellModuleDefinition = {
  type: "chart",
  title: "Chart",
  description: "نمودار عمومی",
  defaultSize: "xl",
  render: () => {
    const bars = [42, 65, 48, 80, 72, 92, 58, 74, 88, 69, 95, 78];

    return (
      <div className="flex h-full min-h-[240px] flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              عملکرد ۱۲ ماه اخیر
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              داده نمونه؛ در production از API پر می‌شود.
            </p>
          </div>

          <BarChart3 className="h-5 w-5 text-blue-600" />
        </div>

        <div className="flex flex-1 items-end gap-2 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/70">
          {bars.map((height, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-t-xl bg-blue-600/80 transition hover:bg-blue-600"
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-zinc-400">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const QuickActionsShellModule: PageShellModuleDefinition = {
  type: "quickActions",
  title: "Quick Actions",
  description: "دسترسی سریع",
  defaultSize: "md",
  render: ({ context }) => {
    const actions = context?.quickActions ?? [
      {
        label: "ایجاد مورد جدید",
        icon: Plus,
        onClick: undefined,
      },
      {
        label: "جستجو",
        icon: Search,
        onClick: undefined,
      },
      {
        label: "خروجی گرفتن",
        icon: Download,
        onClick: undefined,
      },
    ];

    return (
      <div className="grid gap-3">
        {actions.map((action: any) => {
          const Icon = action.icon ?? Plus;

          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-right transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                {action.label}
              </span>

              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Icon className="h-4 w-4" />
              </span>
            </button>
          );
        })}
      </div>
    );
  },
};

export const ActivityShellModule: PageShellModuleDefinition = {
  type: "activity",
  title: "Activity",
  description: "فعالیت‌های اخیر",
  defaultSize: "lg",
  render: ({ context }) => {
    const activities = context?.activities ?? [
      {
        title: "گزارش جدید ساخته شد",
        time: "۵ دقیقه پیش",
        icon: FileText,
      },
      {
        title: "کاربر جدید اضافه شد",
        time: "۱۸ دقیقه پیش",
        icon: Users,
      },
      {
        title: "سطح دسترسی تغییر کرد",
        time: "۴۲ دقیقه پیش",
        icon: Shield,
      },
      {
        title: "پردازش زمان‌بندی‌شده اجرا شد",
        time: "۱ ساعت پیش",
        icon: Clock,
      },
    ];

    return (
      <div className="space-y-3">
        {activities.map((item: any) => {
          const Icon = item.icon ?? Activity;

          return (
            <div
              key={`${item.title}-${item.time}`}
              className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

export const FiltersShellModule: PageShellModuleDefinition = {
  type: "filters",
  title: "Filters",
  description: "فیلترهای صفحه",
  defaultSize: "full",
  render: () => {
    return (
      <div className="grid gap-3 md:grid-cols-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            جستجو
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              placeholder="عبارت مورد نظر..."
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            وضعیت
          </label>
          <select className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-800">
            <option>همه</option>
            <option>فعال</option>
            <option>غیرفعال</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            از تاریخ
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-800"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Filter className="h-4 w-4" />
            اعمال فیلتر
          </button>
        </div>
      </div>
    );
  },
};

export const DataTableShellModule: PageShellModuleDefinition = {
  type: "dataTable",
  title: "Data Table",
  description: "جدول داده",
  defaultSize: "full",
  render: ({ context, module }) => {
    const rows = context?.tableRows ?? [
      {
        name: "گزارش فروش ماهانه",
        status: "آماده",
        date: "1405/02/20",
      },
      {
        name: "گزارش کاربران فعال",
        status: "در حال پردازش",
        date: "1405/02/19",
      },
      {
        name: "گزارش مالی",
        status: "آماده",
        date: "1405/02/18",
      },
    ];

    return (
      <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">
                  عنوان
                </th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">
                  وضعیت
                </th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">
                  تاریخ
                </th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
              {rows.map((row: any) => (
                <tr key={`${module.id}-${row.name}`}>
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    {row.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {row.date}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      مشاهده
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
};

export const coreShellModules = [
  HeroShellModule,
  StatsShellModule,
  ChartShellModule,
  QuickActionsShellModule,
  ActivityShellModule,
  FiltersShellModule,
  DataTableShellModule,
];
