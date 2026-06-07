"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { WidgetMessage } from "./WidgetMessage";
import { WidgetInput } from "./WidgetInput";
import { useAiAssistant } from "../../hooks/use-ai-assistant";

export function WidgetPanel({ open, onClose, tenantId, userId }: any) {
  const { messages, send, isSending } = useAiAssistant({
    tenantId,
    userId,
  });

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[360px] rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <span className="font-semibold text-white">AI Assistant</span>
        <button onClick={onClose}>
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="h-[420px] overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <WidgetMessage key={m.id} message={m} />
        ))}
      </div>

      <WidgetInput disabled={isSending} onSend={send} />
    </div>
  );
}
