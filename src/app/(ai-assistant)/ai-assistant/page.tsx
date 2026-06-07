import { AiChatWidget } from "@/modules/ai-assistants/components/ai-widget/AiChatWidget";
import AiAssistantPage from "@/modules/ai-assistants/components/AiAssistantPage";

export default function AiAssistant() {
  return (
    <>
      <AiAssistantPage />

      <AiChatWidget tenantId={1} userId={1} />
    </>
  );
}
