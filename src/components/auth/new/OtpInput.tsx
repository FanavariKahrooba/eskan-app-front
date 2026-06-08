// components/auth/OtpInput.tsx
"use client";

import { useRef } from "react";

export default function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(5, " ").slice(0, 5).split("");

  const setDigit = (i: number, d: string) => {
    const next = value.split("");
    next[i] = d;
    onChange(next.join("").replace(/\s/g, "").slice(0, 5));
  };

  return (
    <div dir="ltr" className="mt-2 flex justify-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digits[i].trim()}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(-1);
            setDigit(i, d);
            if (d && i < 4) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i].trim() && i > 0)
              refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, 5);
            onChange(text);
            refs.current[Math.min(text.length, 4)]?.focus();
          }}
          className="h-14 w-12 rounded-xl border border-slate-300 bg-slate-50 text-center text-xl font-black text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
        />
      ))}
    </div>
  );
}
