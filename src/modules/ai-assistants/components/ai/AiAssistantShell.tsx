"use client";

import { useRef, useState, useEffect } from "react";
import { BackgroundEffects } from "./BackgroundEffects";
import { ChatHeader } from "./ChatHeader";
import { ConversationSidebar } from "./ConversationSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { HeroCard } from "./HeroCard";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { MessageSkeleton } from "./MessageSkeleton";
import { useAiAssistant } from "../../hooks/use-ai-assistant";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface Props {
  tenantId: number;
  userId: number;
  model?: string;
}

export function AiAssistantShell({ tenantId, userId, model }: Props) {
  const {
    conversationId,
    conversations,
    messages,
    isSending,
    isLoadingConversations,
    isLoadingMessages,
    statusText,
    newChat,
    selectConversation,
    send,
    regenerate,
    renameConversation,
    deleteConversation,
  } = useAiAssistant({
    tenantId,
    userId,
    model,
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoadingMessages]);

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-100"
    >
      <BackgroundEffects />

      <div className="relative z-10 flex h-screen">
        <ConversationSidebar
          loading={isLoadingConversations}
          conversations={conversations}
          activeConversationId={conversationId}
          onNewChat={newChat}
          onSelect={selectConversation}
          onRename={renameConversation}
          onDelete={(id) => setDeleteId(id)}
        />

        <MobileSidebar
          open={mobileSidebarOpen}
          conversations={conversations}
          activeConversationId={conversationId}
          onClose={() => setMobileSidebarOpen(false)}
          onNewChat={newChat}
          onSelect={selectConversation}
          onRename={renameConversation}
          onDelete={(id) => setDeleteId(id)}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <ChatHeader
            model={model || "qwen-3.5"}
            statusText={statusText}
            onOpenSidebar={() => setMobileSidebarOpen(true)}
          />

          <section
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-6 md:px-8"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-5">
              <HeroCard />

              {isLoadingMessages ? (
                <>
                  <MessageSkeleton />
                  <MessageSkeleton />
                  <MessageSkeleton />
                </>
              ) : messages.length === 0 ? (
                <EmptyState />
              ) : (
                messages.map((message, index) => {
                  const isLastAssistant =
                    message.role === "assistant" &&
                    index === messages.length - 1 &&
                    !message.pending &&
                    !message.error;

                  return (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onRegenerate={isLastAssistant ? regenerate : undefined}
                      allowRegenerate={isLastAssistant}
                    />
                  );
                })
              )}
            </div>
          </section>

          <footer className="border-t border-white/10 bg-slate-950/30 px-4 py-4 backdrop-blur-2xl md:px-8">
            <div className="mx-auto max-w-5xl">
              <ChatInput disabled={isSending} onSend={send} />
              <p className="mt-3 text-center text-[11px] text-slate-500">
                سامانه ثبت اسکان
              </p>
            </div>
          </footer>
        </main>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="حذف گفتگو"
        description="آیا از حذف این گفتگو مطمئن هستید؟ این عملیات قابل بازگشت نیست."
        confirmText="حذف"
        cancelText="انصراف"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteConversation(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
