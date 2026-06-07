"use client";

export function WidgetMessage({ message }: any) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-2xl px-3 py-2 text-sm max-w-[80%]
        ${isUser ? "bg-blue-600 text-white" : "bg-white/10 text-white"}`}
      >
        {message.content}
      </div>
    </div>
  );
}
