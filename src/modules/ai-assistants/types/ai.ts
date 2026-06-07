export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageItem {
    id: string;
    role: ChatRole;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    model?: string | null;
    pending?: boolean;
    error?: boolean;
    conversationId?: string | null;
}

export interface SendMessagePayload {
    conversation_id?: string | null;
    message: string;
    user_id: number;
    meta?: {
        tenant_id?: number;
        model?: string;
        options?: Record<string, unknown>;
    };
}

export interface SendMessageResponse {
    success: boolean;
    data?: {
        conversation_id: string;
        user_message_id: string;
        assistant_message_id: string;
        reply: string;
        intent?: string | null;
        model?: string | null;
        execution_id?: string | null;
        meta?: Record<string, unknown>;
    };
    message?: string;
}

export interface ConversationListItem {
    id: string;
    title?: string | null;
    status?: string | null;
    last_message_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface ConversationMessageItem {
    id: string;
    role: ChatRole;
    content: string;
    model?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface ShowConversationResponse {
    success: boolean;
    data?: {
        id: string;
        title?: string | null;
        status?: string | null;
        messages?: ConversationMessageItem[];
    };
    message?: string;
}

export interface ListConversationsResponse {
    success: boolean;
    data: ConversationListItem[];
    message?: string;
}

export interface RenameConversationPayload {
    tenant_id: number;
    user_id: number;
    title: string;
}

export interface DeleteConversationPayload {
    tenant_id: number;
    user_id: number;
}

export interface GenericApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
}
