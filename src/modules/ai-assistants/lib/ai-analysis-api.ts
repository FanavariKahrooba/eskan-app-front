import {
    RunAnalysisPayload,
    RunAnalysisResponse,
} from "../types/ai-analysis";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_AI_API_BASE_URL || "http://localhost:8000";

async function parseJsonSafe(res: Response) {
    const text = await res.text();

    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
}

export async function runAnalysisApi(
    payload: RunAnalysisPayload,
    signal?: AbortSignal
): Promise<RunAnalysisResponse> {
    const res = await fetch(`${API_BASE_URL}/api/ai-assistant/analyses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
    });

    const json = await parseJsonSafe(res);

    if (!res.ok) {
        throw new Error(json?.message || "خطا در ارتباط با سرویس تحلیل");
    }

    if (!json?.success) {
        throw new Error(json?.message || "پاسخ نامعتبر از سرویس تحلیل");
    }

    return json as RunAnalysisResponse;
}
