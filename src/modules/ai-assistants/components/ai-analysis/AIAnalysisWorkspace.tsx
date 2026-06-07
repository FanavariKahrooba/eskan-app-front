"use client";

import { useState } from "react";
import { AnalysisInput } from "./AnalysisInput";
import { AnalysisResult } from "./AnalysisResult";
import { AnalysisToolbar } from "./AnalysisToolbar";
import { sendMessageApi } from "../../lib/ai-assistant-api";

export function AIAnalysisWorkspace({
  tenantId,
  userId,
}: {
  tenantId: number;
  userId: number;
}) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("analysis");

  async function analyze() {
    if (!text.trim()) return;

    setLoading(true);

    const prompt = `
You are an AI analyst.

Mode: ${mode}

Analyze the following data and produce a clear professional output.

DATA:
${text}
`;

    const res = await sendMessageApi({
      message: prompt,
      conversation_id: null,
      user_id: userId,
      meta: {
        tenant_id: tenantId,
        model: "gpt-5.5",
      },
    });

    setResult(res?.data?.reply || "");
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-full p-6">
      <div className="flex flex-col space-y-4">
        <AnalysisToolbar
          mode={mode}
          setMode={setMode}
          onRun={analyze}
          loading={loading}
        />
        <AnalysisInput value={text} onChange={setText} />
      </div>

      <AnalysisResult result={result} loading={loading} />
    </div>
  );
}
