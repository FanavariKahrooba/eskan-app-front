"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Bot, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


import { TypingDots } from "./TypingDots";
import { toast } from "sonner";
import { ChatMessageItem } from "../../types/ai";
import { cn, copyText } from "../../lib/utils";
import { MessageActions } from "../ui/MessageActions";

interface Props {
  message: ChatMessageItem;
  onRegenerate?: () => void;
  allowRegenerate?: boolean;
}

export function ChatMessage({ message, onRegenerate, allowRegenerate }: Props) {
  const isUser = message.role === "user";

  async function handleCopy() {
    try {
      await copyText(message.content);
      toast.success("پیام کپی شد");
    } catch {
      toast.error("کپی انجام نشد");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/20">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[90%] rounded-3xl px-5 py-4 text-sm leading-8 shadow-xl backdrop-blur-xl md:max-w-[75%]",
          isUser
            ? "rounded-br-md bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
            : "rounded-bl-md border border-white/10 bg-white/[0.06] text-slate-100",
          message.error && "border-red-400/30 bg-red-500/10",
        )}
      >
        {message.pending ? (
          <div className="flex items-center gap-3">
            <TypingDots />
            <span className="text-xs text-slate-300">در حال تولید پاسخ...</span>
          </div>
        ) : (
          <>
            {message.error && (
              <div className="mb-2 flex items-center gap-2 text-red-300">
                <AlertTriangle className="h-4 w-4" />
                <span>خطا</span>
              </div>
            )}

            {isUser ? (
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            ) : (
              <div className="prose prose-invert max-w-none prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/30 prose-code:text-cyan-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {!message.pending && message.content && !isUser && (
              <MessageActions
                onCopy={handleCopy}
                onRegenerate={onRegenerate}
                showRegenerate={allowRegenerate}
              />
            )}

            {!isUser && message.model && (
              <div className="mt-3 flex items-center gap-1 border-t border-white/10 pt-2 text-[11px] text-slate-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{message.model}</span>
              </div>
            )}
          </>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08]">
          <User className="h-5 w-5 text-cyan-100" />
        </div>
      )}
    </motion.div>
  );
}
