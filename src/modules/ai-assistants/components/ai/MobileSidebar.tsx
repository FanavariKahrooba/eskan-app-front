"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, MessageSquarePlus } from "lucide-react";

import { ConversationItem } from "./ConversationItem";
import { ConversationListItem } from "../../types/ai";

interface Props {
  open: boolean;
  conversations: ConversationListItem[];
  activeConversationId?: string | null;
  onClose: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function MobileSidebar({
  open,
  conversations,
  activeConversationId,
  onClose,
  onNewChat,
  onSelect,
  onRename,
  onDelete,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col border-l border-white/10 bg-slate-950 p-4 lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">گفتگوها</h3>
              <button
                onClick={onClose}
                className="rounded-xl p-2 hover:bg-white/10"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <button
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-medium text-white"
            >
              <MessageSquarePlus className="h-5 w-5" />
              گفتگوی جدید
            </button>

            <div className="space-y-2 overflow-y-auto">
              {conversations.map((item) => (
                <ConversationItem
                  key={item.id}
                  item={item}
                  active={activeConversationId === item.id}
                  onClick={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                  onRename={(title) => onRename(item.id, title)}
                  onDelete={() => onDelete(item.id)}
                />
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
