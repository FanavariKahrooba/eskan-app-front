"use client";

import { AnalysisMessage, UploadedAnalysisFile } from "../../types/ai-analysis";

interface AnalysisStatsBarProps {
  content: string;
  files: UploadedAnalysisFile[];
  messages: AnalysisMessage[];
}

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

function formatNumber(value: number) {
  return value.toLocaleString("fa-IR");
}

export function AnalysisStatsBar({
  content,
  files,
  messages,
}: AnalysisStatsBarProps) {
  const totalFileCharacters = files.reduce(
    (sum, file) => sum + file.text.length,
    0,
  );

  const stats = [
    {
      label: "کاراکتر متن",
      value: formatNumber(content.length),
    },
    {
      label: "کلمات متن",
      value: formatNumber(countWords(content)),
    },
    {
      label: "فایل‌ها",
      value: formatNumber(files.length),
    },
    {
      label: "پیام‌ها",
      value: formatNumber(messages.length),
    },
    {
      label: "کاراکتر فایل‌ها",
      value: formatNumber(totalFileCharacters),
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-sm font-bold text-card-foreground">
          وضعیت فضای تحلیل
        </h2>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          نمایی سریع از حجم داده و فعالیت فعلی.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-background px-3 py-3"
          >
            <p className="text-[11px] text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-sm font-bold text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
