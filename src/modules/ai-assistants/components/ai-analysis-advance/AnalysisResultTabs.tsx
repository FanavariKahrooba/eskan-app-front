"use client";

import { useMemo, useState } from "react";
import { AnalysisInsight, AnalysisMessage } from "../../types/ai-analysis";
import { Badge } from "../ui/badge";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AnalysisResultTabsProps {
  result: string;
  report: string;
  insights: AnalysisInsight[];
  messages: AnalysisMessage[];
}

type TabKey = "overview" | "insights" | "report" | "history";

interface TabItem {
  key: TabKey;
  label: string;
  count?: number;
}

function MessageCard({ message }: { message: AnalysisMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={[
        "rounded-2xl border p-4",
        isUser ? "border-border bg-muted/30" : "border-primary/20 bg-primary/5",
      ].join(" ")}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <Badge variant={isUser ? "secondary" : "default"}>
          {isUser ? "کاربر" : "دستیار"}
        </Badge>

        <span className="text-[11px] text-muted-foreground">
          {message.created_at
            ? new Date(message.created_at).toLocaleString("fa-IR")
            : ""}
        </span>
      </div>

      <div className="text-sm leading-7 text-foreground">
        <MarkdownRenderer content={message.content} />
      </div>
    </div>
  );
}

function InsightCard({
  insight,
  index,
}: {
  insight: AnalysisInsight;
  index: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
          {index + 1}
        </span>
        <h3 className="text-sm font-bold text-foreground">{insight.title}</h3>
      </div>

      <div className="text-sm leading-7 text-muted-foreground">
        <MarkdownRenderer content={insight.description} />
      </div>
    </div>
  );
}

export function AnalysisResultTabs({
  result,
  report,
  insights,
  messages,
}: AnalysisResultTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const tabs: TabItem[] = useMemo(
    () => [
      { key: "overview", label: "نمای کلی" },
      { key: "insights", label: "بینش‌ها", count: insights.length },
      { key: "report", label: "گزارش" },
      { key: "history", label: "تاریخچه", count: messages.length },
    ],
    [insights.length, messages.length],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5",
              ].join(" ")}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    active
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {tab.count.toLocaleString("fa-IR")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-[420px]">
        {activeTab === "overview" && (
          <div className="rounded-2xl border border-border bg-background p-5">
            {result ? (
              <MarkdownRenderer content={result} />
            ) : (
              <p className="text-sm text-muted-foreground">
                هنوز خروجی نمای کلی تولید نشده است.
              </p>
            )}
          </div>
        )}

        {activeTab === "report" && (
          <div className="rounded-2xl border border-border bg-background p-5">
            {report ? (
              <MarkdownRenderer content={report} />
            ) : (
              <p className="text-sm text-muted-foreground">
                هنوز گزارشی برای نمایش وجود ندارد.
              </p>
            )}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="grid gap-3">
            {insights.length ? (
              insights.map((insight, index) => (
                <InsightCard
                  key={`${insight.title}-${index}`}
                  insight={insight}
                  index={index}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-sm text-muted-foreground">
                  هنوز بینشی استخراج نشده است.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="grid gap-3">
            {messages.length ? (
              messages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))
            ) : (
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-sm text-muted-foreground">
                  هنوز تاریخچه‌ای ثبت نشده است.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
