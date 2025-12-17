import { TeachingStyle, Message } from "../types";

/**
 * Backend-powered AI call.
 * Keeps the SAME streaming API shape your App.tsx expects.
 * (Single-chunk streaming for now)
 */
export async function sendMessageStream(
  history: Message[],
  text: string,
  image: string | null,
  style: TeachingStyle
): Promise<AsyncGenerator<string>> {

  async function* generator() {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI request failed");
    }

    // Yield once (backend is non-streaming)
    yield data.reply;
  }

  return generator();
}

/**
 * Session reset (kept ONLY for compatibility)
 * Backend is stateless for now
 */
export const resetChatSession = () => {
  // no-op
};
