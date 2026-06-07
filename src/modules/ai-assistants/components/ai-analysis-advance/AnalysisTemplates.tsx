"use client";

import { EnterpriseTemplateItem } from "../../types/ai-analysis";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface AnalysisTemplatesProps {
  onApplyTemplate: (
    templateContent: string,
    analysisType?: EnterpriseTemplateItem["analysisType"],
  ) => void;
}

const templates: EnterpriseTemplateItem[] = [
  {
    id: "business-report",
    title: "تحلیل گزارش کسب‌وکار",
    description:
      "استخراج نکات کلیدی، ریسک‌ها، پیشنهادها و جمع‌بندی مدیریتی از گزارش.",
    analysisType: "full_analysis",
    content:
      "لطفاً این گزارش کسب‌وکار را به‌صورت مدیریتی تحلیل کن. خلاصه، نکات کلیدی، ریسک‌ها، فرصت‌ها، شاخص‌های مهم و پیشنهادهای اجرایی را ارائه بده:\n\n",
  },
  {
    id: "meeting-summary",
    title: "خلاصه جلسه",
    description:
      "تبدیل متن جلسه به خلاصه ساختاریافته، تصمیم‌ها و اقدامات بعدی.",
    analysisType: "summary",
    content:
      "لطفاً متن جلسه زیر را خلاصه کن و خروجی را شامل تصمیم‌های مهم، اقدامات بعدی، مسئول هر اقدام و ریسک‌های احتمالی ارائه بده:\n\n",
  },
  {
    id: "risk-assessment",
    title: "ارزیابی ریسک",
    description: "شناسایی ریسک‌های عملیاتی، مالی، فنی یا سازمانی از روی متن.",
    analysisType: "risk_assessment",
    content:
      "لطفاً محتوای زیر را از منظر ریسک تحلیل کن. ریسک‌ها را اولویت‌بندی کن، اثر هر ریسک را توضیح بده و راهکار کاهش ریسک پیشنهاد کن:\n\n",
  },
  {
    id: "data-insight",
    title: "استخراج بینش از داده",
    description:
      "یافتن الگوها، ناهنجاری‌ها، شاخص‌ها و پیشنهادهای مبتنی بر داده.",
    analysisType: "insight_extraction",
    content:
      "لطفاً داده‌های زیر را تحلیل کن و بینش‌های مهم، الگوها، ناهنجاری‌ها، شاخص‌های کلیدی و پیشنهادهای قابل اجرا را ارائه بده:\n\n",
  },
];

export function AnalysisTemplates({ onApplyTemplate }: AnalysisTemplatesProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-card-foreground">
          قالب‌های آماده تحلیل
        </h2>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          برای شروع سریع‌تر، یکی از سناریوهای آماده را انتخاب کنید.
        </p>
      </div>

      <div className="grid gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() =>
              onApplyTemplate(template.content, template.analysisType)
            }
            className="group rounded-xl border border-border bg-background p-3 text-right transition hover:border-primary/50 hover:bg-primary/5"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-xs font-bold text-foreground">
                {template.title}
              </h3>

              <Badge variant="outline" className="shrink-0">
                آماده
              </Badge>
            </div>

            <p className="text-xs leading-6 text-muted-foreground">
              {template.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            onApplyTemplate(
              "لطفاً محتوای زیر را به‌صورت کامل تحلیل کن و خلاصه، نکات کلیدی، ریسک‌ها، پیشنهادها و جمع‌بندی مدیریتی ارائه بده:\n\n",
              "full_analysis",
            )
          }
        >
          استفاده از قالب عمومی
        </Button>
      </div>
    </section>
  );
}
