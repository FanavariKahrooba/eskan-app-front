"use client";

import { Copy, RotateCcw } from "lucide-react";

interface Props {
  onCopy?: () => void;
  onRegenerate?: () => void;
  showRegenerate?: boolean;
}

export function MessageActions({
  onCopy,
  onRegenerate,
  showRegenerate,
}: Props) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        onClick={onCopy}
        className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/[0.08]"
      >
        <span className="flex items-center gap-1">
          <Copy className="h-3.5 w-3.5" />
          کپی
        </span>
      </button>

      {showRegenerate && (
        <button
          onClick={onRegenerate}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/[0.08]"
        >
          <span className="flex items-center gap-1">
            <RotateCcw className="h-3.5 w-3.5" />
            بازتولید
          </span>
        </button>
      )}
    </div>
  );
}
