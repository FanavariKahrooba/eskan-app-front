"use client";

import { MessageSquarePlus } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { ConversationListItem } from "../../types/ai";
import { ConversationSkeleton } from "./ConversationSkeleton";

interface Props {
  loading?: boolean;
  conversations: ConversationListItem[];
  activeConversationId?: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationSidebar({
  loading,
  conversations,
  activeConversationId,
  onNewChat,
  onSelect,
  onRename,
  onDelete,
}: Props) {
  return (
    <aside className="hidden h-full w-80 shrink-0 border-l border-white/10 bg-white/[0.04] p-4 backdrop-blur-2xl lg:block">
      <button
        onClick={onNewChat}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/20"
      >
        <MessageSquarePlus className="h-5 w-5" />
        گفتگوی جدید
      </button>

      <div className="space-y-2 overflow-y-auto relative">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ConversationSkeleton key={i} />
          ))
        ) : conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-500">
            هنوز گفتگویی ثبت نشده است.
          </div>
        ) : (
          conversations.map((item) => (
            <ConversationItem
              key={item.id}
              item={item}
              active={activeConversationId === item.id}
              onClick={() => onSelect(item.id)}
              onRename={(title) => onRename(item.id, title)}
              onDelete={() => onDelete(item.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
