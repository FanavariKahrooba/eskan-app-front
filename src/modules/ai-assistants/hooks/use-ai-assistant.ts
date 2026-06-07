"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AI_ASSISTANT_CONFIG } from "../config/ai-assistant";
import { ChatMessageItem, ConversationListItem } from "../types/ai";
import { deleteConversationApi, listConversationsApi, renameConversationApi, sendMessageApi, showConversationApi } from "../lib/ai-assistant-api";
import { makeId } from "../lib/utils";
import { fakeStreamText } from "../lib/stream-text";



interface Options {
    tenantId: number;
    userId: number;
    model?: string;
}

export function useAiAssistant({
    tenantId,
    userId,
    model = AI_ASSISTANT_CONFIG.defaultModel,
}: Options) {
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<ConversationListItem[]>([]);
    const [messages, setMessages] = useState<ChatMessageItem[]>([
        {
            id: "welcome",
            role: "assistant",
            content:
                "سلام! من دستیار هوشمند سازمانی شما هستم. می‌توانم در تحلیل، خلاصه‌سازی، بازنویسی و پاسخ‌گویی کمک کنم.",
            model,
        },
    ]);
    const [isSending, setIsSending] = useState(false);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);

    const statusText = useMemo(
        () => (isSending ? "در حال تولید پاسخ..." : "متصل به سرویس هوشمند"),
        [isSending]
    );

    useEffect(() => {
        loadConversations();
    }, []);

    async function loadConversations() {
        try {
            setIsLoadingConversations(true);
            const res = await listConversationsApi({
                tenant_id: tenantId,
                user_id: userId,
                limit: AI_ASSISTANT_CONFIG.conversationListLimit,
            });
            setConversations(res.data || []);
        } catch (e: any) {
            toast.error(e?.message || "خطا در دریافت گفتگوها");
        } finally {
            setIsLoadingConversations(false);
        }
    }

    function newChat() {
        abortRef.current?.abort();
        setConversationId(null);
        setLastUserPrompt(null);
        setMessages([
            {
                id: makeId(),
                role: "assistant",
                content: "گفتگوی جدید شروع شد. بفرمایید، در چه زمینه‌ای کمکتان کنم؟",
                model,
            },
        ]);
    }

    async function selectConversation(id: string) {
        try {
            setIsLoadingMessages(true);

            const res = await showConversationApi({
                conversation_id: id,
                tenant_id: tenantId,
                user_id: userId,
                message_limit: AI_ASSISTANT_CONFIG.conversationMessageLimit,
            });

            const loaded: ChatMessageItem[] =
                res.data?.messages?.map((m) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    model: m.model,
                    createdAt: m.created_at || undefined,
                    updatedAt: m.updated_at || undefined,
                    conversationId: id,
                })) || [];

            setConversationId(id);
            setMessages(
                loaded.length
                    ? loaded
                    : [
                        {
                            id: makeId(),
                            role: "assistant",
                            content: "این گفتگو هنوز پیامی ندارد.",
                            model,
                        },
                    ]
            );

            const lastUser = [...loaded].reverse().find((m) => m.role === "user");
            setLastUserPrompt(lastUser?.content || null);
        } catch (e: any) {
            toast.error(e?.message || "خطا در دریافت گفتگو");
        } finally {
            setIsLoadingMessages(false);
        }
    }

    async function send(text: string) {
        if (!text.trim() || isSending) return;

        const userLocalId = makeId();
        const assistantLocalId = makeId();
        setLastUserPrompt(text);

        setMessages((prev) => [
            ...prev,
            {
                id: userLocalId,
                role: "user",
                content: text,
                conversationId,
            },
            {
                id: assistantLocalId,
                role: "assistant",
                content: "",
                pending: true,
                model,
                conversationId,
            },
        ]);

        setIsSending(true);
        abortRef.current = new AbortController();

        try {
            const res = await sendMessageApi(
                {
                    conversation_id: conversationId,
                    message: text,
                    user_id: userId,
                    meta: {
                        tenant_id: tenantId,
                        model,
                        options: {},
                    },
                },
                abortRef.current.signal
            );

            if (!res.success || !res.data) {
                throw new Error(res.message || "پاسخ نامعتبر از سرور");
            }

            const data = res.data;
            setConversationId(data.conversation_id);

            setMessages((prev) =>
                prev.map((item) =>
                    item.id === assistantLocalId
                        ? {
                            ...item,
                            id: data.assistant_message_id || assistantLocalId,
                            pending: false,
                            content: "",
                            model: data.model || model,
                            conversationId: data.conversation_id,
                        }
                        : item
                )
            );

            if (AI_ASSISTANT_CONFIG.fakeStreaming) {
                await fakeStreamText(data.reply || "", (chunk) => {
                    setMessages((prev) =>
                        prev.map((item) =>
                            item.id === (data.assistant_message_id || assistantLocalId)
                                ? { ...item, content: item.content + chunk }
                                : item
                        )
                    );
                });
            } else {
                setMessages((prev) =>
                    prev.map((item) =>
                        item.id === (data.assistant_message_id || assistantLocalId)
                            ? { ...item, content: data.reply || "" }
                            : item
                    )
                );
            }

            await loadConversations();
        } catch (e: any) {
            setMessages((prev) =>
                prev.map((item) =>
                    item.id === assistantLocalId
                        ? {
                            ...item,
                            pending: false,
                            error: true,
                            content:
                                e?.name === "AbortError"
                                    ? "درخواست لغو شد."
                                    : e?.message || "خطا در ارتباط با سرور",
                        }
                        : item
                )
            );

            toast.error(e?.message || "ارسال پیام ناموفق بود");
        } finally {
            setIsSending(false);
        }
    }

    async function regenerate() {
        if (!lastUserPrompt || isSending) return;
        await send(lastUserPrompt);
    }

    async function renameConversation(id: string, title: string) {
        const previous = conversations;
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, title } : c))
        );

        try {
            await renameConversationApi({
                conversation_id: id,
                payload: {
                    tenant_id: tenantId,
                    user_id: userId,
                    title,
                },
            });
            toast.success("عنوان گفتگو به‌روزرسانی شد");
        } catch (e: any) {
            setConversations(previous);
            toast.error(e?.message || "تغییر عنوان ناموفق بود");
        }
    }

    async function deleteConversation(id: string) {
        const previous = conversations;
        setConversations((prev) => prev.filter((c) => c.id !== id));

        if (conversationId === id) {
            newChat();
        }

        try {
            await deleteConversationApi({
                conversation_id: id,
                payload: {
                    tenant_id: tenantId,
                    user_id: userId,
                },
            });
            toast.success("گفتگو حذف شد");
        } catch (e: any) {
            setConversations(previous);
            toast.error(e?.message || "حذف گفتگو ناموفق بود");
        }
    }

    return {
        conversationId,
        conversations,
        messages,
        isSending,
        isLoadingConversations,
        isLoadingMessages,
        statusText,
        model,
        newChat,
        loadConversations,
        selectConversation,
        send,
        regenerate,
        renameConversation,
        deleteConversation,
    };
}
