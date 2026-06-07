"use client";

export function AnalysisInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-white/10 bg-slate-950 p-4">

      <div className="mb-2 text-sm text-gray-400">
        Input Data
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste text, logs, JSON, reports, or data here..."
        className="h-[420px] w-full resize-none bg-transparent text-sm text-white outline-none"
      />

    </div>
  );
}
