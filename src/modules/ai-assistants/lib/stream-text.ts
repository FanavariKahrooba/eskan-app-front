import { AI_ASSISTANT_CONFIG } from "../config/ai-assistant";

function randomDelay(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function fakeStreamText(
    text: string,
    onChunk: (chunk: string) => void
) {
    const chars = Array.from(text);

    for (const ch of chars) {
        await new Promise((resolve) =>
            setTimeout(
                resolve,
                ch === " "
                    ? AI_ASSISTANT_CONFIG.fakeStreamingMinDelay
                    : randomDelay(
                        AI_ASSISTANT_CONFIG.fakeStreamingMinDelay,
                        AI_ASSISTANT_CONFIG.fakeStreamingMaxDelay
                    )
            )
        );
        onChunk(ch);
    }
}
