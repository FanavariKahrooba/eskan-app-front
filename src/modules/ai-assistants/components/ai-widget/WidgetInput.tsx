"use client";

import { useState } from "react";

export function WidgetInput({ onSend, disabled }: any) {
  const [value, setValue] = useState("");

  function send() {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  }

  return (
    <div className="flex border-t border-white/10 p-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="پیام..."
        className="flex-1 bg-transparent text-white outline-none"
      />

      <button
        disabled={disabled}
        onClick={send}
        className="ml-2 rounded-xl bg-blue-600 px-3 py-1 text-white"
      >
        ارسال
      </button>
    </div>
  );
}
