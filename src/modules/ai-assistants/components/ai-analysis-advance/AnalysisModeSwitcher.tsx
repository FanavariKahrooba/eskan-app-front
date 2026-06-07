"use client";

import { AnalysisType } from "../../types/ai-analysis";
import { Badge } from "../ui/badge";

interface AnalysisModeSwitcherProps {
  value: AnalysisType;
  onChange: (value: AnalysisType) => void;
}

interface AnalysisModeItem {
  value: AnalysisType;
  title: string;
  description: string;
}

const modes: AnalysisModeItem[] = [
  {
    value: "full_analysis",
    title: "تحلیل کامل",
    description: "خلاصه، نکات کلیدی، گزارش، ریسک و پیشنهاد",
  },
  {
    value: "summary",
    title: "خلاصه‌سازی",
    description: "تبدیل متن طولانی به خلاصه مدیریتی",
  },
  {
    value: "deep_analysis",
    title: "تحلیل عمیق",
    description: "بررسی دقیق‌تر ابعاد پنهان و ارتباطات",
  },
  {
    value: "risk_assessment",
    title: "ارزیابی ریسک",
    description: "شناسایی و اولویت‌بندی ریسک‌ها",
  },
  {
    value: "insight_extraction",
    title: "استخراج بینش",
    description: "یافتن الگوها، شاخص‌ها و فرصت‌ها",
  },
  {
    value: "report_generation",
    title: "تولید گزارش",
    description: "ساخت گزارش ساختاریافته و قابل ارائه",
  },
];

export function AnalysisModeSwitcher({
  value,
  onChange,
}: AnalysisModeSwitcherProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-card-foreground">نوع تحلیل</h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            مشخص کنید سرویس تحلیل با چه رویکردی محتوا را پردازش کند.
          </p>
        </div>

        <Badge variant="secondary">
          {modes.find((mode) => mode.value === value)?.title || "سفارشی"}
        </Badge>
      </div>

      <div className="grid gap-2">
        {modes.map((mode) => {
          const active = value === mode.value;

          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange(mode.value)}
              className={[
                "rounded-xl border p-3 text-right transition",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold">{mode.title}</span>

                {active && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                    فعال
                  </span>
                )}
              </div>

              <p
                className={[
                  "mt-1 text-xs leading-6",
                  active ? "text-primary/80" : "text-muted-foreground",
                ].join(" ")}
              >
                {mode.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
