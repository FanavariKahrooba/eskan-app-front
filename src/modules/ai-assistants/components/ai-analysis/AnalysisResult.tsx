"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AnalysisResult({
  result,
  loading,
}: {
  result: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 h-full overflow-y-auto">

      <div className="mb-3 text-sm text-gray-400">
        AI Result
      </div>

      {loading && (
        <div className="text-gray-400 text-sm">
          AI is analyzing the data...
        </div>
      )}

      {!loading && !result && (
        <div className="text-gray-500 text-sm">
          Run an analysis to see the results here.
        </div>
      )}

      {!loading && result && (
        <div className="prose prose-invert max-w-none text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result}
          </ReactMarkdown>
        </div>
      )}

    </div>
  );
}
