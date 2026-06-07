"use client";

import { Button } from "../ui/button";

interface AnalysisEnterpriseTopbarProps {
  loadingRun: boolean;
  onRun: () => void;
  onClear: () => void;
}

export function AnalysisEnterpriseTopbar({
  loadingRun,
  onRun,
  onClear,
}: AnalysisEnterpriseTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-foreground md:text-lg">
            فضای تحلیل هوشمند داده
          </h1>
          <p className="hidden text-xs text-muted-foreground md:block">
            تحلیل، خلاصه‌سازی، استخراج بینش و تولید گزارش با هوش مصنوعی
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={loadingRun}
          >
            پاک‌سازی
          </Button>

          <Button type="button" onClick={onRun} disabled={loadingRun}>
            {loadingRun ? "در حال تحلیل..." : "اجرای تحلیل"}
          </Button>
        </div>
      </div>
    </header>
  );
}
