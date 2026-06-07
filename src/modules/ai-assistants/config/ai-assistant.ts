export const AI_ASSISTANT_CONFIG = {
    apiBaseUrl:
        process.env.NEXT_PUBLIC_AI_API_BASE_URL || "http://localhost:8000",
    defaultModel: "gpt-5.5",
    conversationListLimit: 30,
    conversationMessageLimit: 100,
    fakeStreaming: true,
    fakeStreamingMinDelay: 8,
    fakeStreamingMaxDelay: 18,
};
