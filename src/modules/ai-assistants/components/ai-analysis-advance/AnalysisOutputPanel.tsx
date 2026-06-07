"use client";

import { AnalysisInsight, AnalysisMessage } from "../../types/ai-analysis";
import { AnalysisResultTabs } from "./AnalysisResultTabs";

interface AnalysisOutputPanelProps {
  loading: boolean;
  result: string;
  report: string;
  insights: AnalysisInsight[];
  messages: AnalysisMessage[];
}

export function AnalysisOutputPanel({
  loading,
  result,
  report,
  insights,
  messages,
}: AnalysisOutputPanelProps) {
  return (
    <section className="h-full rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-sm font-bold text-card-foreground">خروجی تحلیل</h2>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          خلاصه، گزارش، بینش‌ها و تاریخچه تعامل در این بخش نمایش داده می‌شود.
        </p>
      </div>

      <div className="min-h-[540px] p-4">
        {loading ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <p className="mt-4 text-sm font-medium text-foreground">
                در حال تحلیل محتوا...
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                لطفاً چند لحظه منتظر بمانید.
              </p>
            </div>
          </div>
        ) : (
          <AnalysisResultTabs
            result={result}
            report={report}
            insights={insights}
            messages={messages}
          />
        )}
      </div>
    </section>
  );
}
