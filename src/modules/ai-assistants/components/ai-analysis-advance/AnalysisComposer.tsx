"use client";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AnalysisDropzone } from "./AnalysisDropzone";
import { UploadedAnalysisFile } from "../../types/ai-analysis";

interface AnalysisComposerProps {
  content: string;
  onContentChange: (value: string) => void;
  files: UploadedAnalysisFile[];
  onFilesChange: React.Dispatch<React.SetStateAction<UploadedAnalysisFile[]>>;
  onRemoveFile: (fileId: string) => void;
  loadingRun: boolean;
  onRun: () => void;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} بایت`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} کیلوبایت`;
  return `${(size / (1024 * 1024)).toFixed(1)} مگابایت`;
}

export function AnalysisComposer({
  content,
  onContentChange,
  files,
  onFilesChange,
  onRemoveFile,
  loadingRun,
  onRun,
}: AnalysisComposerProps) {
  const characterCount = content.length;
  const wordCount = content.trim()
    ? content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-card-foreground">
            ورودی تحلیل
          </h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            متن، داده خام، گزارش، توضیحات یا محتوای فایل را برای تحلیل وارد
            کنید.
          </p>
        </div>

        <Badge variant="secondary">{wordCount} کلمه</Badge>
      </div>

      <Textarea
        value={content}
        onChange={(event) => onContentChange(event.target.value)}
        placeholder="مثلاً: گزارش فروش فصل اخیر، داده‌های عملکرد تیم، متن جلسه، خروجی CSV یا هر محتوایی که نیاز به تحلیل دارد..."
        className="min-h-[210px]"
        disabled={loadingRun}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{characterCount.toLocaleString("fa-IR")} کاراکتر</span>
        <span>فایل‌های پشتیبانی‌شده: TXT, MD, JSON, CSV</span>
      </div>

      <div className="mt-4">
        <AnalysisDropzone
          files={files}
          onFilesChange={onFilesChange}
          disabled={loadingRun}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            فایل‌های افزوده‌شده
          </p>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveFile(file.id)}
                  disabled={loadingRun}
                  className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition hover:bg-background hover:text-destructive disabled:opacity-50"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-end">
        <Button
          type="button"
          onClick={onRun}
          disabled={loadingRun}
          className="w-full md:w-auto"
        >
          {loadingRun ? "در حال تحلیل..." : "تحلیل محتوا"}
        </Button>
      </div>
    </section>
  );
}
