// components/hero/SliderControls.tsx
"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const AUTOPLAY = 6000;

export default function SliderControls({
  index,
  count,
  paused,
  onPrev,
  onNext,
  onGo,
  onTogglePlay,
}: {
  index: number;
  count: number;
  paused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGo: (i: number) => void;
  onTogglePlay: () => void;
}) {
  return (
    <>
      <button
        aria-label="اسلاید بعدی"
        onClick={onNext}
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25 sm:block"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        aria-label="اسلاید قبلی"
        onClick={onPrev}
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25 sm:block"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* نوار پایین: dots + play/pause */}
      <div className="absolute bottom-7 left-0 right-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              aria-label={`اسلاید ${i + 1}`}
              onClick={() => onGo(i)}
              className="group relative h-2 overflow-hidden rounded-full bg-white/30 transition-all"
              style={{ width: i === index ? 44 : 16 }}
            >
              {i === index && !paused && (
                <motion.span
                  key={index}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTOPLAY / 1000, ease: "linear" }}
                  className="absolute inset-y-0 right-0 block bg-orange-500"
                />
              )}
              {i === index && paused && (
                <span className="absolute inset-0 bg-orange-500" />
              )}
            </button>
          ))}
        </div>

        <button
          aria-label={paused ? "پخش" : "توقف"}
          onClick={onTogglePlay}
          className="rounded-full border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25"
        >
          {paused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </button>
      </div>
    </>
  );
}
