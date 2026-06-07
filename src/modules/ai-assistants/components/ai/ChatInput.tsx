"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";

interface Props {
  disabled?: boolean;
  onSend: (message: string) => void;
}

export function ChatInput({ disabled, onSend }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "56px";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = "56px";
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-cyan-500/40 via-blue-500/20 to-violet-500/40 blur-xl" />

      <div className="relative flex items-end gap-3 rounded-[2rem] border border-white/10 bg-slate-950/80 p-3 backdrop-blur-2xl">
        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-cyan-200 md:flex">
          <Sparkles className="h-5 w-5" />
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          placeholder=" ... پیام خود را بنویسید"
          className="min-h-[56px] flex-1 text-right resize-none bg-transparent px-2 py-3 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500"
          dir="auto"
        />

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {disabled ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowUp className="h-5 w-5" />
          )}
        </button>
      </div>
    </motion.form>
  );
}
