import { AiAssistantShell } from "./ai/AiAssistantShell";

export default function AiAssistantPage() {
  return <AiAssistantShell tenantId={1} userId={1} model="qwen-3.5" />;
}
