"use client";

import { useRef, useState } from "react";
import { UploadedAnalysisFile } from "../../types/ai-analysis";

interface AnalysisDropzoneProps {
  files: UploadedAnalysisFile[];
  onFilesChange: React.Dispatch<React.SetStateAction<UploadedAnalysisFile[]>>;
  disabled?: boolean;
}

const ACCEPTED_EXTENSIONS = [".txt", ".md", ".json", ".csv"];

function isAcceptedFile(file: File) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

async function readFileAsText(file: File) {
  return await file.text();
}

export function AnalysisDropzone({
  files,
  onFilesChange,
  disabled,
}: AnalysisDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  async function processFiles(fileList: FileList | null) {
    if (!fileList || disabled) return;

    const candidates = Array.from(fileList);
    const validFiles = candidates.filter(isAcceptedFile);

    if (!validFiles.length) return;

    setLoadingFiles(true);

    try {
      const parsedFiles: UploadedAnalysisFile[] = await Promise.all(
        validFiles.map(async (file) => ({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type || "text/plain",
          text: await readFileAsText(file),
        })),
      );

      onFilesChange((prev) => [...prev, ...parsedFiles]);
    } finally {
      setLoadingFiles(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={(event) => processFiles(event.target.files)}
        disabled={disabled}
      />

      <button
        type="button"
        disabled={disabled || loadingFiles}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          processFiles(event.dataTransfer.files);
        }}
        className={[
          "flex min-h-[120px] w-full flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center transition",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20 hover:bg-muted/40",
          disabled ? "cursor-not-allowed opacity-60" : "",
        ].join(" ")}
      >
        <span className="text-sm font-bold text-foreground">
          {loadingFiles ? "در حال پردازش فایل‌ها..." : "افزودن فایل برای تحلیل"}
        </span>

        <span className="mt-2 text-xs leading-6 text-muted-foreground">
          فایل‌ها را اینجا رها کنید یا برای انتخاب کلیک کنید
        </span>

        <span className="mt-2 text-[11px] text-muted-foreground">
          فرمت‌های مجاز: TXT / MD / JSON / CSV
        </span>

        {files.length > 0 && (
          <span className="mt-3 text-[11px] font-medium text-primary">
            {files.length.toLocaleString("fa-IR")} فایل انتخاب شده است
          </span>
        )}
      </button>
    </div>
  );
}
