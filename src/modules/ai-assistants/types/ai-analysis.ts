export type AnalysisType =
  | "summary"
  | "deep_analysis"
  | "sentiment"
  | "risk_assessment"
  | "insight_extraction"
  | "report_generation"
  | "classification"
  | "recommendation"
  | "full_analysis"
  | string;

export type AnalysisRole = "user" | "assistant";

export interface AnalysisConversation {
  id: string;
  title?: string | null;
  tenant_id?: string | null;
  user_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  last_message_at?: string | null;
  archived_at?: string | null;
}

export interface AnalysisMessage {
  id: string;
  conversation_id: string;
  analysis_run_id?: string | null;
  tenant_id?: string | null;
  user_id?: string | null;
  role: AnalysisRole;
  content: string;
  metadata: Record<string, any>;
  created_at?: string | null;
}

export interface AnalysisInsight {
  title: string;
  description: string;
}

export interface UploadedAnalysisFile {
  id: string;
  name: string;
  size: number;
  type: string;
  text: string;
}

export interface EnterpriseTemplateItem {
  id: string;
  title: string;
  description: string;
  analysisType: AnalysisType;
  content: string;
}

export interface UseAiDataLabOptions {
  tenantId: string | number;
  userId: string | number;
  initialConversationId?: string | null;
}

export interface RunAnalysisPayload {
  tenant_id: string | number;
  user_id: string | number;
  conversation_id?: string | null;
  title?: string;
  content: string;
  analysis_type: AnalysisType;
  options?: Record<string, any>;
}

export interface AnalysisStatisticItem {
  label: string;
  value: string | number;
  description?: string;
}

export interface AnalysisApiData {
  summary?: string;
  key_points?: string[];
  statistics?: AnalysisStatisticItem[];
  conclusion?: string;
  recommendations?: string[];
  risks?: string[];
  confidence_score?: number;
  raw_response?: string;
  metadata?: Record<string, any>;
  conversation_id?: string;
  analysis_run_id?: string;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface RunAnalysisResponse
  extends ApiSuccessResponse<AnalysisApiData> { }

export interface ListConversationsResponse
  extends ApiSuccessResponse<AnalysisConversation[]> { }

export interface ConversationDetailResponse
  extends ApiSuccessResponse<AnalysisConversation> { }

export interface GetConversationMessagesResponse
  extends ApiSuccessResponse<AnalysisMessage[]> { }
