import { apiRequest } from "../lib/api-client";
import type {
  DeleteConversationPayload,
  GenericApiResponse,
  ListConversationsResponse,
  RenameConversationPayload,
  SendMessagePayload,
  SendMessageResponse,
  ShowConversationResponse,
} from "../types/ai";

export function sendMessageApi(
  payload: SendMessagePayload,
  signal?: AbortSignal
) {
  return apiRequest<SendMessageResponse>("/api/ai-assistant/messages/send", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

export function listConversationsApi(params: {
  tenant_id: number;
  user_id: number;
  limit?: number;
}) {
  return apiRequest<ListConversationsResponse>("/api/ai-assistant/conversations", {
    method: "GET",
    params,
  });
}

export function showConversationApi(params: {
  conversation_id: string;
  tenant_id: number;
  user_id: number;
  message_limit?: number;
}) {
  const { conversation_id, ...query } = params;

  return apiRequest<ShowConversationResponse>(
    `/api/ai-assistant/conversations/${conversation_id}`,
    {
      method: "GET",
      params: query,
    }
  );
}

export function renameConversationApi(params: {
  conversation_id: string;
  payload: RenameConversationPayload;
}) {
  return apiRequest<GenericApiResponse>(
    `/api/ai-assistant/conversations/${params.conversation_id}/title`,
    {
      method: "PATCH",
      body: JSON.stringify(params.payload),
    }
  );
}

export function deleteConversationApi(params: {
  conversation_id: string;
  payload: DeleteConversationPayload;
}) {
  return apiRequest<GenericApiResponse>(
    `/api/ai-assistant/conversations/${params.conversation_id}`,
    {
      method: "DELETE",
      body: JSON.stringify(params.payload),
    }
  );
}
