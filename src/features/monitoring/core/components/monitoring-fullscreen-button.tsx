"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useMonitoringFullscreen } from "../hooks/use-monitoring-fullscreen";

export function MonitoringFullscreenButton({ targetId }: { targetId?: string }) {
  const { isFullscreen, toggle } = useMonitoringFullscreen(targetId);

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
      aria-label="Toggle fullscreen"
    >
      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
    </button>
  );
}
