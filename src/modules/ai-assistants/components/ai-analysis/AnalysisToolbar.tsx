"use client";

export function AnalysisToolbar({
  mode,
  setMode,
  onRun,
  loading,
}: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 p-3">

      <div className="flex gap-2">

        <button
          onClick={() => setMode("analysis")}
          className={`px-3 py-1 rounded-xl text-sm ${
            mode === "analysis" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-300"
          }`}
        >
          Analyze
        </button>

        <button
          onClick={() => setMode("summary")}
          className={`px-3 py-1 rounded-xl text-sm ${
            mode === "summary" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-300"
          }`}
        >
          Summary
        </button>

        <button
          onClick={() => setMode("insights")}
          className={`px-3 py-1 rounded-xl text-sm ${
            mode === "insights" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-300"
          }`}
        >
          Insights
        </button>

      </div>

      <button
        onClick={onRun}
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1 text-white"
      >
        {loading ? "Running..." : "Run Analysis"}
      </button>
    </div>
  );
}
